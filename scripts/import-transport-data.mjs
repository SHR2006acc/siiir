import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = process.argv[2];
const knowledgeRoot = process.argv[3];

if (!sourceRoot) {
  throw new Error("Usage: node scripts/import-transport-data.mjs <Transportation_Data> [travel_knowledge_base]");
}

const projectRoot = process.cwd();
const dataOutput = path.join(projectRoot, "src", "data", "generated");
const logoOutput = path.join(projectRoot, "public", "operators");
await mkdir(dataOutput, { recursive: true });
await mkdir(logoOutput, { recursive: true });

const readJson = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));

const cityLabels = {
  agadir: "Agadir", al_hoceima: "Al Hoceïma", berkane: "Berkane",
  beni_mellal: "Béni Mellal", casablanca: "Casablanca", chefchaouen: "Chefchaouen",
  dakhla: "Dakhla", el_jadida: "El Jadida", errachidia: "Errachidia",
  essaouira: "Essaouira", fes: "Fès", ifrane: "Ifrane", kenitra: "Kénitra",
  khouribga: "Khouribga", ksar_el_kebir: "Ksar El Kébir", laayoune: "Laâyoune",
  larache: "Larache", marrakech: "Marrakech", meknes: "Meknès",
  mohammedia: "Mohammedia", nador: "Nador", ouarzazate: "Ouarzazate",
  oujda: "Oujda", rabat: "Rabat", safi: "Safi", tangier: "Tanger",
  taza: "Taza", tetouan: "Tétouan",
};

const titleCity = (value) => cityLabels[value] ?? value
  .split("_")
  .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : part)
  .join(" ");

const airportMap = new Map();
const airportRoot = path.join(sourceRoot, "airports");
for (const directory of await readdir(airportRoot, { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const airport = await readJson(path.join(airportRoot, directory.name, "airport.json"));
  airportMap.set(directory.name, airport);
  airportMap.set(String(airport.IATA ?? "").toLowerCase(), airport);
}

const oncfStations = await readJson(path.join(sourceRoot, "trains", "oncf", "stations.json"));
const stationMap = new Map(oncfStations.map((station) => [station.id, station]));

function assignSchedules(routes, schedules) {
  if (schedules.every((schedule) => schedule.routeId)) {
    const grouped = new Map();
    for (const schedule of schedules) {
      const current = grouped.get(schedule.routeId) ?? [];
      current.push(schedule);
      grouped.set(schedule.routeId, current);
    }
    return grouped;
  }

  if (schedules.length % routes.length === 0) {
    const perRoute = schedules.length / routes.length;
    return new Map(routes.map((route, index) => [
      route.routeId,
      schedules.slice(index * perRoute, (index + 1) * perRoute),
    ]));
  }

  const grouped = new Map();
  let cursor = 0;
  for (const route of routes) {
    const matches = [];
    while (cursor < schedules.length && Number(schedules[cursor].duration) === Number(route.estimatedDuration)) {
      matches.push(schedules[cursor]);
      cursor += 1;
    }
    grouped.set(route.routeId, matches);
  }
  return grouped;
}

const importedJourneys = [];
const importedOperators = [];

async function importOperator(kind, directoryName) {
  const directory = path.join(sourceRoot, kind, directoryName);
  const company = await readJson(path.join(directory, "company.json"));
  const routes = await readJson(path.join(directory, "routes.json"));
  const schedules = await readJson(path.join(directory, "schedules.json"));
  const prices = await readJson(path.join(directory, "prices.json"));
  const metadata = await readJson(path.join(directory, "metadata.json"));
  const groupedSchedules = assignSchedules(routes, schedules);
  const mode = kind === "trains" ? "TRAIN" : kind === "buses" ? "COACH" : "FLIGHT";
  const priceByRoute = new Map();

  for (const price of prices) {
    const current = priceByRoute.get(price.routeId);
    if (!current || Number(price.price) < Number(current.price)) priceByRoute.set(price.routeId, price);
  }

  const logoName = `dataset-${directoryName}.png`;
  await copyFile(path.join(directory, "logo.png"), path.join(logoOutput, logoName));
  importedOperators.push({
    id: directoryName,
    name: company.name,
    mode,
    logo: `/operators/${logoName}`,
    officialUrl: company.website,
    lastUpdated: metadata.lastUpdated,
  });

  for (const route of routes) {
    const originRecord = mode === "TRAIN" ? stationMap.get(route.origin)
      : mode === "FLIGHT" ? airportMap.get(route.origin) : { city: route.origin };
    const destinationRecord = mode === "TRAIN" ? stationMap.get(route.destination)
      : mode === "FLIGHT" ? airportMap.get(route.destination) : { city: route.destination };

    // The website currently compares travel inside Morocco only.
    if (!originRecord?.city || !destinationRecord?.city) continue;

    const from = titleCity(String(originRecord.city).toLowerCase());
    const to = titleCity(String(destinationRecord.city).toLowerCase());
    const price = priceByRoute.get(route.routeId);
    const routeSchedules = groupedSchedules.get(route.routeId) ?? [];

    routeSchedules
      .filter((schedule) => schedule.status === "scheduled")
      .forEach((schedule, index) => {
        const direct = Boolean(route.direct);
        importedJourneys.push({
          id: `collected-${route.routeId}-${String(schedule.departureTime).replace(":", "")}-${index}`,
          mode,
          operator: company.name,
          service: mode === "TRAIN" ? "Service ONCF collecté"
            : mode === "COACH" ? "Autocar interurbain collecté"
              : "Vol collecté",
          from,
          to,
          depart: schedule.departureTime,
          arrive: schedule.arrivalTime,
          wait: mode === "FLIGHT" ? 90 : mode === "TRAIN" ? 20 : 30,
          ride: Number(schedule.duration ?? route.estimatedDuration),
          transfer: 0,
          price: Number(price?.price ?? 0),
          comfort: price?.cabinClass ?? (mode === "FLIGHT" ? "Economy" : "Standard"),
          transfers: direct ? 0 : Math.max(1, Number(route.numberOfStops ?? 1)),
          refundable: false,
          exchangeable: true,
          seats: Math.min(Number(schedule.availableSeats ?? 9), mode === "COACH" ? 50 : mode === "FLIGHT" ? 220 : 400),
          tags: ["Données collectées", direct ? "Direct" : "Avec arrêts"],
          source: "COLLECTED",
          sourceUpdatedAt: metadata.lastUpdated,
          routeId: route.routeId,
        });
      });
  }
}

for (const directory of await readdir(path.join(sourceRoot, "buses"), { withFileTypes: true })) {
  if (directory.isDirectory()) await importOperator("buses", directory.name);
}

await importOperator("trains", "oncf");

for (const directoryName of ["air_arabia_maroc", "royal_air_maroc", "ryanair"]) {
  await importOperator("airlines", directoryName);
}

const uniqueJourneys = Array.from(
  new Map(importedJourneys.map((journey) => [journey.id, journey])).values(),
).sort((a, b) => `${a.from}-${a.to}-${a.depart}`.localeCompare(`${b.from}-${b.to}-${b.depart}`, "fr"));

await writeFile(
  path.join(dataOutput, "importedJourneys.json"),
  `${JSON.stringify(uniqueJourneys, null, 2)}\n`,
);
await writeFile(
  path.join(dataOutput, "importedOperators.json"),
  `${JSON.stringify(importedOperators, null, 2)}\n`,
);
await writeFile(
  path.join(dataOutput, "transportMetadata.json"),
  `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: "User-provided collected transportation dataset",
    disclaimer: "Indicative collected data. Verify schedules, fares and availability with the official operator.",
    journeyCount: uniqueJourneys.length,
    operatorCount: importedOperators.length,
  }, null, 2)}\n`,
);

if (knowledgeRoot) {
  const documents = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = await readFile(fullPath, "utf8");
        const relative = path.relative(knowledgeRoot, fullPath).replaceAll("\\", "/");
        const title = content.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(entry.name, ".md");
        documents.push({
          id: relative.replace(/\.md$/, ""),
          category: relative.split("/")[0],
          title,
          content,
        });
      }
    }
  }
  await visit(knowledgeRoot);
  await writeFile(
    path.join(dataOutput, "travelKnowledge.json"),
    `${JSON.stringify(documents, null, 2)}\n`,
  );
}

console.log(JSON.stringify({
  journeys: uniqueJourneys.length,
  operators: importedOperators.length,
  knowledge: knowledgeRoot ? "imported" : "skipped",
}, null, 2));
