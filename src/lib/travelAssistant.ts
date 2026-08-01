import { journeys, formatDuration, type Journey } from "@/data/journeys";
import { locationNames } from "@/data/locations";
import knowledgeDocuments from "@/data/generated/travelKnowledge.json";

export type AssistantSource = {
  id: string;
  title: string;
  category: string;
};

export type AssistantAnswer = {
  text: string;
  journey?: Journey;
  alternatives?: Journey[];
  from?: string;
  to?: string;
  sources: AssistantSource[];
  intent: "ROUTE" | "TOURISM" | "PRACTICAL" | "GENERAL";
};

const cityAliases: Record<string, string[]> = {
  Casablanca: ["casa", "الدار البيضاء"],
  Marrakech: ["marrakesh", "مراكش"],
  Fès: ["fes", "fez", "فاس"],
  Rabat: ["الرباط"],
  Tanger: ["tangier", "طنجة"],
  Chefchaouen: ["chaouen", "شفشاون"],
  Dakhla: ["الداخلة"],
  Agadir: ["أكادير"],
  Oujda: ["وجدة"],
  Meknès: ["meknes", "مكناس"],
};

const stopWords = new Set([
  "avec", "dans", "pour", "plus", "moins", "quel", "quelle", "comment", "depuis",
  "entre", "vers", "trajet", "voyage", "ville", "the", "from", "with", "what", "where",
  "this", "that", "and", "une", "des", "les", "est", "sur", "par", " إلى ", " من ",
]);

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLocaleLowerCase("fr")
  .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
  .replace(/\s+/g, " ")
  .trim();

const tokens = (value: string) => normalize(value)
  .split(" ")
  .filter((token) => token.length > 2 && !stopWords.has(token));

function detectCities(question: string) {
  const normalized = normalize(question);
  return locationNames.filter((city) => {
    const candidates = [city, ...(cityAliases[city] ?? [])];
    return candidates.some((candidate) => normalized.includes(normalize(candidate)));
  });
}

function retrieveKnowledge(question: string, limit = 3) {
  const queryTokens = new Set(tokens(question));
  return knowledgeDocuments
    .map((document) => {
      const titleTokens = tokens(document.title);
      const contentTokens = tokens(document.content);
      const titleScore = titleTokens.filter((token) => queryTokens.has(token)).length * 5;
      const contentScore = contentTokens.filter((token) => queryTokens.has(token)).length;
      return { document, score:titleScore + contentScore };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => document);
}

function rankJourneys(candidates: Journey[], question: string) {
  const normalized = normalize(question);
  const wantsCheap = /(moins cher|budget|econom|cheap|ارخص|اقتصاد)/.test(normalized);
  const wantsFast = /(rapide|vite|fast|tot|اسرع)/.test(normalized);
  const wantsComfort = /(confort|comfortable|راحة)/.test(normalized);

  return [...candidates].sort((a, b) => {
    if (wantsCheap) return a.price - b.price;
    if (wantsFast) return (a.ride + a.wait + a.transfer) - (b.ride + b.wait + b.transfer);
    if (wantsComfort) {
      const comfortScore = (journey: Journey) => /premium|1ère|business|grande vitesse/i.test(journey.comfort) ? 1 : 0;
      return comfortScore(b) - comfortScore(a);
    }
    const score = (journey: Journey) =>
      Number(journey.tags.includes("Recommended")) * 4
      + Number(journey.source === "CURATED_DEMO") * 2
      - journey.price / 1000
      - (journey.ride + journey.wait) / 2000;
    return score(b) - score(a);
  });
}

function practicalSnippet(content: string) {
  return content
    .replace(/^#+\s+.+$/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph.length > 45)
    ?.slice(0, 320);
}

export function answerTravelQuestion(question: string, locale = "fr"): AssistantAnswer {
  const normalized = normalize(question);
  const matchedCities = detectCities(question);
  const wantsTourism = /(visit|touris|activit|medina|monument|voir|سياح|زيارة|معالم)/.test(normalized);
  const wantsPractical = /(secur|urgence|hopital|sim|monnaie|change|ramadan|taxi|meteo|pourboire|safety|emergency|currency|weather)/.test(normalized);
  const retrieved = retrieveKnowledge(question);
  const sources = retrieved.map(({ id, title, category }) => ({ id, title, category }));

  if ((wantsTourism || wantsPractical) && retrieved[0]) {
    const snippet = practicalSnippet(retrieved[0].content) ?? "Consultez les informations locales et vérifiez les conditions avant votre déplacement.";
    const text = locale === "ar"
      ? `وجدت معلومات موثقة في قاعدة SIR حول «${retrieved[0].title}». ${snippet}`
      : locale === "en"
        ? `I found grounded information in the SIR knowledge base about “${retrieved[0].title}”. ${snippet}`
        : `J’ai trouvé une information dans la base SIR sur « ${retrieved[0].title} ». ${snippet}`;
    return {
      text,
      to: matchedCities[0],
      sources,
      intent: wantsTourism ? "TOURISM" : "PRACTICAL",
    };
  }

  const from = matchedCities[0];
  const to = matchedCities[1];
  let candidates = from && to
    ? journeys.filter((journey) => journey.from === from && journey.to === to)
    : matchedCities.length === 1
      ? journeys.filter((journey) => journey.to === matchedCities[0] || journey.from === matchedCities[0])
      : [];

  if (!candidates.length && from && to) {
    const firstLegs = journeys.filter((journey) => journey.from === from);
    const connections = firstLegs.flatMap((first) =>
      journeys
        .filter((second) => second.from === first.to && second.to === to)
        .slice(0, 3)
        .map((second) => ({ first, second })),
    );
    if (connections[0]) {
      const { first, second } = connections[0];
      const text = locale === "en"
        ? `No direct option was found, but SIR found a connection via ${first.to}: ${first.operator} at ${first.depart}, then ${second.operator} at ${second.depart}. Verify the connection time and both tickets with the operators.`
        : locale === "ar"
          ? `لا يوجد مسار مباشر، لكن SIR وجد ربطاً عبر ${first.to}: ${first.operator} الساعة ${first.depart} ثم ${second.operator} الساعة ${second.depart}. تحقق من مدة الربط والتذكرتين لدى الناقلين.`
          : `Aucune option directe trouvée, mais SIR propose une correspondance via ${first.to} : ${first.operator} à ${first.depart}, puis ${second.operator} à ${second.depart}. Vérifiez le temps de correspondance et les deux billets auprès des opérateurs.`;
      return {
        text,
        journey:first,
        alternatives:[second],
        from,
        to,
        sources,
        intent:"ROUTE",
      };
    }
  }

  candidates = rankJourneys(candidates, question);
  const best = candidates[0];
  if (best) {
    const duration = formatDuration(best.ride + best.wait + best.transfer);
    const sourceNote = best.source === "COLLECTED"
      ? "Donnée collectée indicative, à vérifier auprès de l’opérateur."
      : "Option de démonstration, à vérifier auprès de l’opérateur.";
    const text = locale === "en"
      ? `Best matching option: ${best.operator}, ${best.from} → ${best.to}, departure ${best.depart}, arrival ${best.arrive}, ${duration} total, ${best.price} MAD. Indicative data must be verified with the operator.`
      : locale === "ar"
        ? `أفضل خيار مطابق: ${best.operator} من ${best.from} إلى ${best.to}، الانطلاق ${best.depart} والوصول ${best.arrive}، المدة الإجمالية ${duration}، السعر ${best.price} درهم. يجب التحقق من البيانات لدى الناقل.`
        : `Meilleure option trouvée : ${best.operator}, ${best.from} → ${best.to}, départ ${best.depart}, arrivée ${best.arrive}, ${duration} au total, ${best.price} MAD. ${sourceNote}`;
    return {
      text,
      journey:best,
      alternatives:candidates.slice(1, 4),
      from:best.from,
      to:best.to,
      sources,
      intent:"ROUTE",
    };
  }

  const text = locale === "en"
    ? "Tell me your departure, destination and priority (price, time or comfort). I can also answer practical questions using the SIR travel knowledge base."
    : locale === "ar"
      ? "اذكر مدينة الانطلاق والوجهة والأولوية (السعر أو الوقت أو الراحة). يمكنني أيضاً الإجابة عن الأسئلة العملية من قاعدة معرفة SIR."
      : "Indiquez votre départ, votre destination et votre priorité (prix, temps ou confort). Je peux aussi répondre aux questions pratiques grâce à la base de connaissances SIR.";
  return { text, sources, intent:"GENERAL" };
}
