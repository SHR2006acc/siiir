import type { Mode } from "./journeys";
import importedOperatorData from "./generated/importedOperators.json";

export type Operator = {
  id: string;
  name: string;
  modes: Mode[];
  logo: string;
  officialUrl: string;
  isDemo?: boolean;
};

const featuredOperators: Operator[] = [
  { id:"oncf", name:"ONCF", modes:["TRAIN"], logo:"/operators/oncf.png", officialUrl:"https://www.oncf-voyages.ma" },
  { id:"ctm", name:"CTM", modes:["COACH"], logo:"/operators/ctm.png", officialUrl:"https://ctm.ma" },
  { id:"supratours", name:"Supratours", modes:["COACH"], logo:"/operators/supratours.png", officialUrl:"https://www.oncf-voyages.ma" },
  { id:"ram", name:"Royal Air Maroc", modes:["FLIGHT"], logo:"/operators/ram.png", officialUrl:"https://www.royalairmaroc.com" },
  { id:"airarabia", name:"Air Arabia Maroc", modes:["FLIGHT"], logo:"/operators/airarabia.png", officialUrl:"https://www.airarabia.com" },
  { id:"ryanair", name:"Ryanair", modes:["FLIGHT"], logo:"/operators/ryanair.png", officialUrl:"https://www.ryanair.com" },
  { id:"ghazala", name:"Trans Ghazala", modes:["COACH"], logo:"/operators/ghazala.png", officialUrl:"https://www.transghazala.ma" },
  { id:"stcr", name:"STCR", modes:["COACH"], logo:"/operators/stcr.png", officialUrl:"#", isDemo:true },
  { id:"nejme-chamal", name:"Nejme Chamal", modes:["COACH"], logo:"/operators/nejme-chamal.png", officialUrl:"#", isDemo:true },
  { id:"sat-messagerie", name:"SAT Messagerie", modes:["COACH"], logo:"/operators/sat-messagerie.png", officialUrl:"#", isDemo:true },
  { id:"trans-al-yamama", name:"Trans Al Yamama", modes:["COACH"], logo:"/operators/trans-al-yamama.png", officialUrl:"#", isDemo:true },
  { id:"trans-sahara", name:"Trans Sahara", modes:["COACH"], logo:"/operators/trans-sahara.png", officialUrl:"#", isDemo:true },
  { id:"globus", name:"Globus", modes:["COACH"], logo:"/operators/globus.png", officialUrl:"#", isDemo:true },
  { id:"sama-aidia-kar", name:"Sama Aidia Kar", modes:["COACH"], logo:"/operators/sama-aidia-kar.png", officialUrl:"#", isDemo:true },
  { id:"palmer-du-sahara", name:"Palmer du Sahara", modes:["COACH"], logo:"/operators/palmer-du-sahara.png", officialUrl:"#", isDemo:true },
  { id:"str", name:"STR", modes:["COACH"], logo:"/operators/str.png", officialUrl:"#", isDemo:true },
  { id:"trans-annamir", name:"Trans Annamir", modes:["COACH"], logo:"/operators/trans-annamir.png", officialUrl:"#", isDemo:true },
  { id:"sahara-prestige", name:"Sahara Prestige", modes:["COACH"], logo:"/operators/sahara-prestige.png", officialUrl:"#", isDemo:true },
  { id:"wissam-nejmy", name:"Wissam Nejmy", modes:["COACH"], logo:"/operators/wissam-nejmy.png", officialUrl:"#", isDemo:true },
  { id:"trans-tassadout", name:"Trans Tassadout", modes:["COACH"], logo:"/operators/trans-tassadout.png", officialUrl:"#", isDemo:true },
  { id:"lux-sahara", name:"Lux Sahara", modes:["COACH"], logo:"/operators/lux-sahara.png", officialUrl:"#", isDemo:true },
  { id:"achkid", name:"Achkid Transport", modes:["COACH"], logo:"/operators/achkid.png", officialUrl:"#", isDemo:true },
  { id:"tcheks-tours", name:"Tcheks Tours", modes:["COACH"], logo:"/operators/tcheks-tours.png", officialUrl:"#", isDemo:true },
  { id:"asfar-rahman", name:"Asfar Rahman", modes:["COACH"], logo:"/operators/asfar-rahman.png", officialUrl:"#", isDemo:true },
  { id:"itrane-sim", name:"Itrane", modes:["COACH"], logo:"/operators/itrane.png", officialUrl:"#", isDemo:true },
  { id:"erml-express", name:"ERML Express", modes:["COACH"], logo:"/operators/erml-express.png", officialUrl:"#", isDemo:true },
  { id:"grand-taxi", name:"Grands taxis", modes:["GRAND_TAXI"], logo:"/operators/grand-taxi.png", officialUrl:"#", isDemo:true },
  { id:"sahara", name:"Sahara Voyage Demo", modes:["COACH"], logo:"/operators/demo-coach.svg", officialUrl:"#", isDemo:true },
  { id:"pullman", name:"Pullman du Sud Demo", modes:["COACH"], logo:"/operators/demo-coach.svg", officialUrl:"#", isDemo:true },
  { id:"itrane", name:"Itrane Voyage Demo", modes:["COACH"], logo:"/operators/demo-coach.svg", officialUrl:"#", isDemo:true },
];

const collectedOperators: Operator[] = importedOperatorData.map((operator) => ({
  id: operator.id,
  name: operator.name,
  modes: [operator.mode as Mode],
  logo: operator.logo,
  officialUrl: operator.officialUrl,
}));

export const operators: Operator[] = Array.from(
  new Map([...collectedOperators, ...featuredOperators].map((operator) => [operator.name, operator])).values(),
);

export function getOperator(name: string) {
  return operators.find((operator) => operator.name === name) ?? operators.find((operator) => operator.id === name);
}
