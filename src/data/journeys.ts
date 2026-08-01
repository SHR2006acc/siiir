import importedJourneyData from "./generated/importedJourneys.json";
import { simulatedJourneys } from "./simulatedJourneys";

export type Mode = "TRAIN" | "COACH" | "FLIGHT" | "GRAND_TAXI" | "COMBINED";

export type Journey = {
  id: string;
  mode: Mode;
  operator: string;
  service: string;
  from: string;
  to: string;
  via?: string[];
  mapVia?: string[];
  depart: string;
  arrive: string;
  wait: number;
  ride: number;
  transfer: number;
  price: number;
  comfort: string;
  transfers: number;
  refundable: boolean;
  exchangeable: boolean;
  seats: number;
  tags: string[];
  source?: "CURATED_DEMO" | "COLLECTED" | "SIMULATED";
  sourceUpdatedAt?: string;
  routeId?: string;
};

const trip = (
  id: string, mode: Mode, operator: string, service: string, from: string, to: string,
  depart: string, arrive: string, ride: number, price: number,
  options: Partial<Omit<Journey, "id"|"mode"|"operator"|"service"|"from"|"to"|"depart"|"arrive"|"ride"|"price">> = {}
): Journey => ({
  id, mode, operator, service, from, to, depart, arrive, ride, price,
  wait: options.wait ?? 30,
  transfer: options.transfer ?? 0,
  comfort: options.comfort ?? "Confort",
  transfers: options.transfers ?? 0,
  refundable: options.refundable ?? false,
  exchangeable: options.exchangeable ?? true,
  seats: options.seats ?? 9,
  tags: options.tags ?? [],
  via: options.via,
});

const featuredJourneys: Journey[] = [
  trip("ctm-casa-fez","COACH","CTM","Confort Plus","Casablanca","Fès","11:00","15:40",280,145,{wait:60,comfort:"Confort+",seats:8,tags:["Recommended","Earliest arrival","Best value"]}),
  trip("oncf-casa-fez","TRAIN","ONCF","Al Atlas 202","Casablanca","Fès","15:00","18:20",200,132,{wait:300,comfort:"1ère classe",refundable:true,seats:14,tags:["Cheapest","Most comfortable"]}),
  trip("ram-casa-fez","FLIGHT","Royal Air Maroc","AT 440","Casablanca","Fès","13:40","14:40",60,690,{wait:220,exchangeable:false,seats:4,tags:["Fastest in vehicle"]}),
  trip("oncf-casa-marrakech","TRAIN","ONCF","Al Atlas 606","Casablanca","Marrakech","08:35","11:14",159,175,{wait:25,comfort:"1ère classe",refundable:true,seats:21,tags:["Most comfortable"]}),
  trip("ctm-casa-marrakech","COACH","CTM","Premium","Casablanca","Marrakech","09:00","12:30",210,105,{wait:10,comfort:"Premium",seats:13,tags:["Cheapest","Best value"]}),
  trip("night-casa-marrakech","COACH","Supratours","Nuit Confort","Casablanca","Marrakech","23:55","03:10",195,150,{wait:25,comfort:"Premium",refundable:true,seats:6,tags:["Recommended","Shortest wait"]}),
  trip("boraq-casa-tanger","TRAIN","ONCF","Al Boraq 1208","Casablanca","Tanger","09:00","11:10",130,249,{wait:20,comfort:"Grande vitesse",refundable:true,seats:18,tags:["Recommended","Fastest"]}),
  trip("ctm-casa-tanger","COACH","CTM","Confort Plus","Casablanca","Tanger","08:15","13:30",315,175,{wait:15,comfort:"Confort+",seats:12,tags:["Cheapest"]}),
  trip("boraq-rabat-tanger","TRAIN","ONCF","Al Boraq 1210","Rabat","Tanger","10:05","11:25",80,165,{wait:15,comfort:"Grande vitesse",refundable:true,seats:16,tags:["Recommended"]}),
  trip("ctm-rabat-marrakech","COACH","CTM","Confort Plus","Rabat","Marrakech","08:40","13:25",285,160,{wait:10,comfort:"Confort+",seats:11,tags:["Cheapest","Shortest wait"]}),
  trip("oncf-rabat-marrakech","TRAIN","ONCF","Al Atlas 604","Rabat","Marrakech","09:20","13:10",230,195,{wait:20,comfort:"1ère classe",refundable:true,seats:17,tags:["Recommended","Most comfortable"]}),
  trip("ctm-marrakech-agadir","COACH","CTM","Premium","Marrakech","Agadir","08:00","11:15",195,110,{wait:15,comfort:"Premium",refundable:true,seats:15,tags:["Recommended","Best value"]}),
  trip("supra-marrakech-agadir","COACH","Supratours","Confort","Marrakech","Agadir","10:30","14:00",210,100,{wait:40,comfort:"Confort",seats:10,tags:["Cheapest"]}),
  trip("airarabia-rabat-agadir","FLIGHT","Air Arabia Maroc","3O 700","Rabat","Agadir","14:15","15:25",70,446,{wait:90,comfort:"Économique",seats:7,tags:["Fastest"]}),
  trip("airarabia-rabat-oujda","FLIGHT","Air Arabia Maroc","3O 725","Rabat","Oujda","18:20","19:25",65,350,{wait:85,comfort:"Économique",seats:8,tags:["Recommended"]}),
  trip("airarabia-rabat-nador","FLIGHT","Air Arabia Maroc","3O 735","Rabat","Nador","07:10","08:15",65,390,{wait:80,comfort:"Économique",seats:5,tags:["Fastest"]}),
  trip("ryanair-marrakech-oujda","FLIGHT","Ryanair","FR Maroc 612","Marrakech","Oujda","12:20","13:30",70,320,{wait:75,comfort:"Essentiel",exchangeable:false,seats:9,tags:["Recommended","Low cost"]}),
  trip("ram-casa-dakhla","FLIGHT","Royal Air Maroc","AT 1420","Casablanca","Dakhla","08:25","10:45",140,1054,{wait:100,comfort:"Économique",refundable:true,seats:12,tags:["Recommended"]}),
  trip("ram-casa-laayoune","FLIGHT","Royal Air Maroc","AT 1410","Casablanca","Laâyoune","16:30","18:05",95,839,{wait:90,comfort:"Économique",refundable:true,seats:14,tags:["Recommended"]}),
  trip("ram-casa-oujda","FLIGHT","Royal Air Maroc","AT 1400","Casablanca","Oujda","07:50","09:00",70,524,{wait:80,comfort:"Économique",seats:9,tags:["Fastest"]}),
  trip("oncf-casa-oujda","TRAIN","ONCF","Al Atlas Oriental","Casablanca","Oujda","06:40","16:05",565,235,{wait:20,comfort:"1ère classe",refundable:true,seats:22,tags:["Best value"]}),
  trip("ctm-casa-oujda","COACH","CTM","Nuit Premium","Casablanca","Oujda","20:30","06:15",585,220,{wait:30,comfort:"Premium",seats:12,tags:["Cheapest"]}),
  trip("oncf-fes-marrakech","TRAIN","ONCF","Al Atlas 607","Fès","Marrakech","07:35","14:14",399,260,{wait:20,comfort:"1ère classe",refundable:true,seats:18,tags:["Recommended"]}),
  trip("oncf-fes-oujda","TRAIN","ONCF","Al Atlas Oriental","Fès","Oujda","09:25","14:55",330,155,{wait:25,comfort:"Confort",seats:15,tags:["Recommended"]}),
  trip("ctm-tanger-chefchaouen","COACH","CTM","Confort","Tanger","Chefchaouen","10:00","12:15",135,70,{wait:15,comfort:"Confort",seats:11,tags:["Recommended"]}),
  trip("ctm-marrakech-essaouira","COACH","CTM","Confort Plus","Marrakech","Essaouira","08:30","11:30",180,95,{wait:20,comfort:"Confort+",seats:13,tags:["Recommended"]}),
  trip("supra-marrakech-essaouira","COACH","Supratours","Confort","Marrakech","Essaouira","11:45","14:45",180,90,{wait:45,comfort:"Confort",seats:8,tags:["Cheapest"]}),
  trip("safi-errachidia","COMBINED","CTM + Sahara Voyage Demo","Autocar combiné","Safi","Errachidia","08:15","18:35",535,285,{wait:45,transfer:40,comfort:"Standard",transfers:1,via:["Marrakech","Ouarzazate"],seats:9,tags:["Combined","Best available"]}),
  trip("supra-ouarzazate-errachidia","COACH","Supratours","Confort","Ouarzazate","Errachidia","13:20","18:00",280,125,{wait:30,comfort:"Confort",seats:9,tags:["Recommended"]}),
  trip("ghazala-casa-tetouan","COACH","Trans Ghazala","Confort Plus","Casablanca","Tétouan","07:30","13:15",345,175,{wait:20,comfort:"Confort+",seats:10,tags:["Best value"]}),
  trip("ctm-agadir-laayoune","COACH","CTM","Premium Sud","Agadir","Laâyoune","19:00","06:30",690,260,{wait:30,comfort:"Premium",refundable:true,seats:14,tags:["Recommended"]}),
  trip("pullman-agadir-guelmim","COACH","Pullman du Sud Demo","Confort","Agadir","Guelmim","09:15","12:45",210,90,{wait:20,comfort:"Confort",seats:12,tags:["Cheapest"]}),
  trip("itrane-fes-ifrane","COACH","Itrane Voyage Demo","Navette régionale","Fès","Ifrane","08:30","09:45",75,45,{wait:15,comfort:"Standard",seats:16,tags:["Recommended"]}),
  trip("ctm-fes-taza","COACH","CTM","Confort","Fès","Taza","15:10","17:15",125,65,{wait:25,comfort:"Confort",seats:10,tags:["Recommended"]}),
  trip("oncf-casa-eljadida","TRAIN","ONCF","TNR 218","Casablanca","El Jadida","07:10","08:35",85,55,{wait:10,comfort:"Standard",seats:30,tags:["Recommended"]}),
  trip("oncf-casa-settat","TRAIN","ONCF","TNR 504","Casablanca","Settat","08:05","09:10",65,42,{wait:10,comfort:"Standard",seats:28,tags:["Cheapest"]}),
  trip("oncf-casa-khouribga","TRAIN","ONCF","Al Atlas 804","Casablanca","Khouribga","12:15","14:05",110,68,{wait:20,comfort:"Confort",seats:20,tags:["Recommended"]}),
  trip("ctm-marrakech-beni","COACH","CTM","Confort","Marrakech","Béni Mellal","09:00","12:30",210,95,{wait:20,comfort:"Confort",seats:11,tags:["Recommended"]}),
];

export const journeys: Journey[] = [
  ...featuredJourneys.map((journey) => ({ ...journey, source:"CURATED_DEMO" as const })),
  ...(importedJourneyData as Journey[]),
  ...simulatedJourneys,
];

export const locations = Array.from(new Set(journeys.flatMap((journey) => [journey.from, journey.to, ...(journey.via ?? [])])));

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours} h${remaining ? ` ${remaining} min` : ""}`;
};

export function findJourneys(from: string, to: string) {
  return journeys.filter((journey) =>
    journey.from.localeCompare(from, "fr", { sensitivity:"base" }) === 0 &&
    journey.to.localeCompare(to, "fr", { sensitivity:"base" }) === 0
  );
}
