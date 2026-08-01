import type { Journey, Mode } from "./journeys";

type RouteSeed = {
  from: string;
  to: string;
  minutes: number;
  price: number;
  distanceKm?: number;
  mapVia?: string[];
};

const coachRoutes: RouteSeed[] = [
  { from:"Casablanca", to:"Fès", minutes:285, price:135 },
  { from:"Casablanca", to:"Agadir", minutes:390, price:190 },
  { from:"Casablanca", to:"Marrakech", minutes:220, price:115 },
  { from:"Casablanca", to:"Tanger", minutes:330, price:175 },
  { from:"Fès", to:"Agadir", minutes:650, price:245 },
  { from:"Fès", to:"Marrakech", minutes:455, price:190 },
  { from:"Fès", to:"Tanger", minutes:315, price:145 },
  { from:"Agadir", to:"Marrakech", minutes:210, price:105 },
  { from:"Agadir", to:"Tanger", minutes:720, price:285 },
  { from:"Marrakech", to:"Tanger", minutes:570, price:235 },
  { from:"Casablanca", to:"Rabat", minutes:95, price:55 },
  { from:"Casablanca", to:"Oujda", minutes:600, price:225 },
  { from:"Casablanca", to:"Dakhla", minutes:1320, price:440 },
  { from:"Rabat", to:"Fès", minutes:190, price:105 },
  { from:"Rabat", to:"Tanger", minutes:210, price:115 },
  { from:"Rabat", to:"Marrakech", minutes:285, price:155 },
  { from:"Rabat", to:"Agadir", minutes:450, price:215 },
  { from:"Rabat", to:"Oujda", minutes:510, price:210 },
  { from:"Rabat", to:"Dakhla", minutes:1260, price:420 },
  { from:"Fès", to:"Oujda", minutes:320, price:145 },
  { from:"Fès", to:"Dakhla", minutes:1440, price:455 },
  { from:"Agadir", to:"Oujda", minutes:900, price:325 },
  { from:"Agadir", to:"Dakhla", minutes:720, price:285 },
  { from:"Marrakech", to:"Oujda", minutes:780, price:285 },
  { from:"Marrakech", to:"Dakhla", minutes:900, price:325 },
  { from:"Tanger", to:"Oujda", minutes:650, price:240 },
  { from:"Tanger", to:"Dakhla", minutes:1560, price:475 },
  { from:"Oujda", to:"Dakhla", minutes:1800, price:510 },
  { from:"Casablanca", to:"Laâyoune", minutes:1020, price:360 },
  { from:"Rabat", to:"Laâyoune", minutes:1110, price:375 },
  { from:"Marrakech", to:"Laâyoune", minutes:780, price:300 },
  { from:"Agadir", to:"Laâyoune", minutes:650, price:255 },
  { from:"Tanger", to:"Chefchaouen", minutes:150, price:75 },
  { from:"Fès", to:"Meknès", minutes:75, price:45 },
  { from:"Rabat", to:"Kénitra", minutes:80, price:55 },
];

const trainRoutes: RouteSeed[] = [
  { from:"Casablanca", to:"Fès", minutes:205, price:135, mapVia:["Rabat","Kénitra","Meknès"] },
  { from:"Casablanca", to:"Marrakech", minutes:165, price:170, mapVia:["Settat","Ben Guerir"] },
  { from:"Casablanca", to:"Tanger", minutes:135, price:245, mapVia:["Rabat","Kénitra"] },
  { from:"Fès", to:"Marrakech", minutes:410, price:255, mapVia:["Meknès","Rabat","Casablanca","Settat","Ben Guerir"] },
  { from:"Fès", to:"Tanger", minutes:260, price:195, mapVia:["Kénitra"] },
  { from:"Marrakech", to:"Tanger", minutes:320, price:315, mapVia:["Ben Guerir","Settat","Casablanca","Rabat","Kénitra"] },
  { from:"Casablanca", to:"Rabat", minutes:60, price:45 },
  { from:"Casablanca", to:"Oujda", minutes:570, price:235, mapVia:["Rabat","Meknès","Fès"] },
  { from:"Rabat", to:"Fès", minutes:165, price:110, mapVia:["Meknès"] },
  { from:"Rabat", to:"Tanger", minutes:85, price:165, mapVia:["Kénitra"] },
  { from:"Rabat", to:"Marrakech", minutes:230, price:195, mapVia:["Casablanca","Settat","Ben Guerir"] },
  { from:"Rabat", to:"Oujda", minutes:470, price:210, mapVia:["Meknès","Fès"] },
  { from:"Tanger", to:"Oujda", minutes:520, price:275, mapVia:["Kénitra","Meknès","Fès"] },
];

const flightRoutes: RouteSeed[] = [
  { from:"Casablanca", to:"Agadir", minutes:70, price:770 },
  { from:"Casablanca", to:"Tanger", minutes:65, price:540 },
  { from:"Casablanca", to:"Marrakech", minutes:55, price:490 },
  { from:"Casablanca", to:"Fès", minutes:55, price:470 },
  { from:"Agadir", to:"Tanger", minutes:95, price:690 },
  { from:"Marrakech", to:"Tanger", minutes:80, price:630 },
  { from:"Casablanca", to:"Oujda", minutes:70, price:525 },
  { from:"Casablanca", to:"Dakhla", minutes:145, price:1050 },
  { from:"Agadir", to:"Dakhla", minutes:100, price:840 },
  { from:"Marrakech", to:"Dakhla", minutes:130, price:810 },
  { from:"Tanger", to:"Dakhla", minutes:180, price:1120 },
  { from:"Rabat", to:"Agadir", minutes:70, price:510 },
  { from:"Rabat", to:"Oujda", minutes:65, price:450 },
  { from:"Fès", to:"Agadir", minutes:85, price:610 },
];

const taxiRoutes: RouteSeed[] = [
  { from:"Casablanca", to:"Fès", minutes:225, price:165, distanceKm:295 },
  { from:"Casablanca", to:"Marrakech", minutes:185, price:150, distanceKm:245 },
  { from:"Marrakech", to:"Agadir", minutes:180, price:140, distanceKm:255 },
  { from:"Casablanca", to:"Rabat", minutes:75, price:55, distanceKm:90 },
  { from:"Casablanca", to:"Mohammedia", minutes:35, price:25, distanceKm:28 },
  { from:"Casablanca", to:"El Jadida", minutes:95, price:65, distanceKm:105 },
  { from:"Fès", to:"Meknès", minutes:55, price:35, distanceKm:65 },
  { from:"Fès", to:"Ifrane", minutes:70, price:45, distanceKm:70 },
  { from:"Fès", to:"Sefrou", minutes:40, price:25, distanceKm:30 },
  { from:"Marrakech", to:"Essaouira", minutes:170, price:100, distanceKm:180 },
  { from:"Marrakech", to:"Safi", minutes:155, price:90, distanceKm:155 },
  { from:"Marrakech", to:"Béni Mellal", minutes:195, price:105, distanceKm:195 },
  { from:"Agadir", to:"Taghazout", minutes:35, price:25, distanceKm:25 },
  { from:"Agadir", to:"Taroudant", minutes:80, price:45, distanceKm:82 },
  { from:"Agadir", to:"Tiznit", minutes:90, price:50, distanceKm:95 },
  { from:"Agadir", to:"Essaouira", minutes:175, price:105, distanceKm:175 },
  { from:"Tanger", to:"Tétouan", minutes:70, price:40, distanceKm:65 },
  { from:"Tanger", to:"Chefchaouen", minutes:125, price:70, distanceKm:115 },
  { from:"Tanger", to:"Larache", minutes:85, price:50, distanceKm:85 },
  { from:"Rabat", to:"Kénitra", minutes:50, price:30, distanceKm:45 },
  { from:"Rabat", to:"Khémisset", minutes:85, price:45, distanceKm:85 },
  { from:"Rabat", to:"Témara", minutes:25, price:15, distanceKm:15 },
  { from:"Rabat", to:"Salé", minutes:20, price:12, distanceKm:10 },
  { from:"Fès", to:"Taza", minutes:120, price:70, distanceKm:120 },
  { from:"Fès", to:"Taounate", minutes:95, price:55, distanceKm:85 },
  { from:"Meknès", to:"Ifrane", minutes:70, price:45, distanceKm:65 },
  { from:"Marrakech", to:"Ouarzazate", minutes:230, price:125, distanceKm:195 },
  { from:"Marrakech", to:"Ben Guerir", minutes:70, price:40, distanceKm:75 },
  { from:"Marrakech", to:"Chichaoua", minutes:75, price:40, distanceKm:75 },
  { from:"Agadir", to:"Inezgane", minutes:20, price:12, distanceKm:12 },
  { from:"Agadir", to:"Aït Melloul", minutes:30, price:15, distanceKm:20 },
  { from:"Agadir", to:"Sidi Ifni", minutes:165, price:90, distanceKm:160 },
  { from:"Agadir", to:"Guelmim", minutes:210, price:110, distanceKm:200 },
  { from:"Tanger", to:"Asilah", minutes:45, price:28, distanceKm:45 },
  { from:"Tanger", to:"Ksar El Kébir", minutes:105, price:55, distanceKm:115 },
  { from:"Tanger", to:"Ouezzane", minutes:125, price:65, distanceKm:125 },
  { from:"Tétouan", to:"Chefchaouen", minutes:75, price:45, distanceKm:65 },
  { from:"Oujda", to:"Berkane", minutes:65, price:40, distanceKm:60 },
  { from:"Oujda", to:"Nador", minutes:145, price:80, distanceKm:140 },
];

const coachTimes = ["03:30", "06:30", "11:45", "17:30", "22:00"];
const trainTimes = ["07:20", "16:05"];
const flightTimes = ["09:10", "18:35"];
const taxiTimes = ["07:00", "12:30", "18:00"];

function addMinutes(time: string, duration: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const total = (hours * 60 + minutes + duration) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function simulatedTrip(
  id: string,
  mode: Mode,
  operator: string,
  service: string,
  from: string,
  to: string,
  depart: string,
  minutes: number,
  price: number,
  options: Partial<Journey> = {},
): Journey {
  return {
    id,
    mode,
    operator,
    service,
    from,
    to,
    depart,
    arrive:addMinutes(depart, minutes + (options.transfer ?? 0)),
    wait:options.wait ?? 20,
    ride:minutes,
    transfer:options.transfer ?? 0,
    price,
    comfort:options.comfort ?? "Confort standard",
    transfers:options.transfers ?? 0,
    refundable:options.refundable ?? false,
    exchangeable:options.exchangeable ?? true,
    seats:options.seats ?? 12,
    tags:options.tags ?? ["Simulation", "Horaire indicatif"],
    via:options.via,
    mapVia:options.mapVia,
    source:"SIMULATED",
    sourceUpdatedAt:"2026-07-28",
    routeId:`simulation-${slug(from)}-${slug(to)}`,
  };
}

function directions(route: RouteSeed) {
  return [
    route,
    { ...route, from:route.to, to:route.from, mapVia:route.mapVia ? [...route.mapVia].reverse() : undefined },
  ];
}

const northernCoachOperators = ["CTM","Nejme Chamal","Globus","Sama Aidia Kar","STR","Tcheks Tours","Asfar Rahman","Itrane","SAT Messagerie","Trans Al Yamama"];
const southernCoachOperators = ["CTM","STCR","Trans Sahara","Palmer du Sahara","Trans Annamir","Sahara Prestige","Wissam Nejmy","Trans Tassadout","Lux Sahara","Achkid Transport","ERML Express","SAT Messagerie","Trans Al Yamama","Supratours"];
const centralCoachOperators = ["CTM","STCR","Globus","SAT Messagerie","Trans Al Yamama","STR","Tcheks Tours","Itrane"];

const simulatedCoaches = coachRoutes.flatMap((route, routeIndex) =>
  directions(route).flatMap((direction, directionIndex) =>
    coachTimes.map((depart, scheduleIndex) => {
      const northern = ["Tanger","Fès","Oujda"].includes(direction.from) || ["Tanger","Fès","Oujda"].includes(direction.to);
      const southern = ["Agadir","Marrakech","Dakhla"].includes(direction.from) || ["Agadir","Marrakech","Dakhla"].includes(direction.to);
      const operators = southern ? southernCoachOperators : northern ? northernCoachOperators : centralCoachOperators;
      const operator = operators[(routeIndex + scheduleIndex) % operators.length];
      const variation = scheduleIndex * 8 + directionIndex * 5;
      return simulatedTrip(
        `sim-coach-${slug(direction.from)}-${slug(direction.to)}-${scheduleIndex}`,
        "COACH",
        operator,
        scheduleIndex === 2 ? "Autocar de nuit simulé" : "Ligne interville simulée",
        direction.from,
        direction.to,
        addMinutes(depart, directionIndex * 35),
        direction.minutes + variation,
        direction.price + scheduleIndex * 10,
        { comfort:scheduleIndex === 1 ? "Confort+" : "Confort", seats:8 + ((routeIndex + scheduleIndex) % 15) },
      );
    }),
  ),
);

const simulatedTrains = trainRoutes.flatMap((route, routeIndex) =>
  directions(route).flatMap((direction, directionIndex) =>
    trainTimes.map((depart, scheduleIndex) =>
      simulatedTrip(
        `sim-train-${slug(direction.from)}-${slug(direction.to)}-${scheduleIndex}`,
        "TRAIN",
        "ONCF",
        routeIndex === 2 ? "Al Boraq simulé" : "Al Atlas simulé",
        direction.from,
        direction.to,
        addMinutes(depart, directionIndex * 25),
        direction.minutes + scheduleIndex * 6,
        direction.price + scheduleIndex * 35,
        {
          wait:15,
          comfort:scheduleIndex ? "1ère classe simulée" : "2e classe simulée",
          refundable:scheduleIndex === 1,
          seats:18 + routeIndex,
          mapVia:direction.mapVia,
        },
      ),
    ),
  ),
);

const simulatedFlights = flightRoutes.flatMap((route, routeIndex) =>
  directions(route).flatMap((direction, directionIndex) =>
    flightTimes.map((depart, scheduleIndex) =>
      simulatedTrip(
        `sim-flight-${slug(direction.from)}-${slug(direction.to)}-${scheduleIndex}`,
        "FLIGHT",
        scheduleIndex ? "Air Arabia Maroc" : "Royal Air Maroc",
        `Vol intérieur simulé ${routeIndex + 101}`,
        direction.from,
        direction.to,
        addMinutes(depart, directionIndex * 40),
        direction.minutes,
        direction.price + scheduleIndex * 75,
        { wait:90, comfort:"Économique", exchangeable:scheduleIndex === 0, seats:5 + routeIndex },
      ),
    ),
  ),
);

const simulatedTaxis = taxiRoutes.filter((route) => (route.distanceKm ?? Number.POSITIVE_INFINITY) < 250).flatMap((route, routeIndex) =>
  directions(route).flatMap((direction, directionIndex) =>
    taxiTimes.map((depart, scheduleIndex) =>
      simulatedTrip(
        `sim-taxi-${slug(direction.from)}-${slug(direction.to)}-${scheduleIndex}`,
        "GRAND_TAXI",
        "Grands taxis",
        "Taxi collectif simulé",
        direction.from,
        direction.to,
        addMinutes(depart, directionIndex * 20),
        direction.minutes + scheduleIndex * 5,
        direction.price,
        {
          wait:15 + scheduleIndex * 10,
          comfort:"Taxi partagé · paiement sur place",
          exchangeable:false,
          seats:6,
          tags:["Simulation", "Départ après remplissage"],
        },
      ),
    ),
  ),
);

const simulatedCombined: Journey[] = [
  simulatedTrip("sim-combined-casablanca-agadir","COMBINED","ONCF + CTM","Train + autocar simulé","Casablanca","Agadir","07:20",375,285,{wait:20,transfer:40,transfers:1,via:["Marrakech"],mapVia:["Marrakech"],comfort:"Train confort + autocar",refundable:true,seats:10,tags:["Simulation","Alternative sans avion"]}),
  simulatedTrip("sim-combined-agadir-casablanca","COMBINED","CTM + ONCF","Autocar + train simulé","Agadir","Casablanca","07:00",385,280,{wait:20,transfer:40,transfers:1,via:["Marrakech"],mapVia:["Marrakech"],comfort:"Autocar + train confort",refundable:true,seats:10,tags:["Simulation","Alternative sans avion"]}),
  simulatedTrip("sim-combined-rabat-agadir","COMBINED","ONCF + CTM","Train + autocar simulé","Rabat","Agadir","06:50",440,300,{wait:20,transfer:40,transfers:1,via:["Marrakech"],mapVia:["Casablanca","Marrakech"],comfort:"Train confort + autocar",seats:12,tags:["Simulation","Correspondance optimisée"]}),
  simulatedTrip("sim-combined-agadir-rabat","COMBINED","CTM + ONCF","Autocar + train simulé","Agadir","Rabat","06:30",445,295,{wait:20,transfer:45,transfers:1,via:["Marrakech"],mapVia:["Marrakech","Casablanca"],comfort:"Autocar + train confort",seats:12,tags:["Simulation","Correspondance optimisée"]}),
  simulatedTrip("sim-combined-fes-agadir","COMBINED","ONCF + Supratours","Train + autocar simulé","Fès","Agadir","05:45",620,365,{wait:25,transfer:45,transfers:1,via:["Marrakech"],mapVia:["Meknès","Rabat","Casablanca","Marrakech"],comfort:"Train confort + autocar",seats:9,tags:["Simulation","Alternative sans avion"]}),
  simulatedTrip("sim-combined-agadir-fes","COMBINED","Supratours + ONCF","Autocar + train simulé","Agadir","Fès","06:10",625,360,{wait:20,transfer:45,transfers:1,via:["Marrakech"],mapVia:["Marrakech","Casablanca","Rabat","Meknès"],comfort:"Autocar + train confort",seats:9,tags:["Simulation","Alternative sans avion"]}),
  simulatedTrip("sim-combined-tanger-agadir","COMBINED","ONCF + CTM","Train + autocar simulé","Tanger","Agadir","06:00",530,435,{wait:20,transfer:50,transfers:1,via:["Marrakech"],mapVia:["Rabat","Casablanca","Marrakech"],comfort:"Al Boraq simulé + autocar",seats:8,tags:["Simulation","Correspondance optimisée"]}),
  simulatedTrip("sim-combined-agadir-tanger","COMBINED","CTM + ONCF","Autocar + train simulé","Agadir","Tanger","06:00",535,430,{wait:20,transfer:50,transfers:1,via:["Marrakech"],mapVia:["Marrakech","Casablanca","Rabat"],comfort:"Autocar + Al Boraq simulé",seats:8,tags:["Simulation","Correspondance optimisée"]}),
];

export const simulatedJourneys: Journey[] = [
  ...simulatedCoaches,
  ...simulatedTrains,
  ...simulatedFlights,
  ...simulatedTaxis,
  ...simulatedCombined,
];
