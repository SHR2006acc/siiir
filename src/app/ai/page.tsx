"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Database, ExternalLink, Route } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import type { AssistantAnswer } from "@/lib/travelAssistant";

export default function AiPage() {
  const { locale, t, formatPrice } = useApp();
  const examples = useMemo(() => locale === "ar"
    ? ["أفضل رحلة من الدار البيضاء إلى فاس", "أرخص رحلة من مراكش إلى الرباط", "ماذا أزور في مراكش؟", "ما هي أرقام الطوارئ في المغرب؟"]
    : locale === "en"
      ? ["Best Casablanca to Fez journey", "Cheapest Marrakech to Rabat option", "What should I visit in Marrakech?", "Emergency numbers in Morocco"]
      : ["Meilleur trajet Casablanca → Fès", "Option la moins chère Marrakech → Rabat", "Que visiter à Marrakech ?", "Quels sont les numéros d’urgence au Maroc ?"],
  [locale]);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Array<{ question:string; answer:AssistantAnswer }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(value = question) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ question:trimmed, locale }),
      });
      const payload = await response.json() as AssistantAnswer & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Réponse indisponible");
      setHistory((current) => [...current, { question:trimmed, answer:payload }]);
      setQuestion("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "SirAI est momentanément indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="ai-page"><div className="ai-shell">
    <div className="ai-orb"><BrainCircuit aria-hidden="true"/></div>
    <span className="kicker ai-kicker">Assistant enrichi · Base de connaissances locale</span>
    <h1>Voyagez avec <span>SirAI</span></h1>
    <p>SirAI analyse les trajets collectés, classe les options et recherche des conseils fiables dans votre base de connaissances.</p>
    <div className="ai-architecture" aria-label="Architecture de SirAI">
      <span><Route aria-hidden="true"/> Compréhension du trajet</span>
      <span><Database aria-hidden="true"/> Recherche dans les données</span>
      <span><BrainCircuit aria-hidden="true"/> Recommandation expliquée</span>
    </div>
    <div className="prompts">{examples.map((example) => <button className="prompt" key={example} onClick={() => ask(example)}>{example}</button>)}</div>
    <div className="chatbox">
      {!history.length && <div className="ai-welcome"><b>Salam 👋</b><p>Donnez-moi deux villes et votre priorité, ou posez une question touristique et pratique sur le Maroc.</p></div>}
      <div className="conversation" aria-live="polite">{history.map((item, index) => <div key={`${item.question}-${index}`}>
        <div className="user-message">{item.question}</div>
        <div className="chat-response">
          <b>SirAI</b><p>{item.answer.text}</p>
          {item.answer.journey && <div className="ai-result"><span>{item.answer.journey.operator}</span><strong>{formatPrice(item.answer.journey.price)}</strong><Link href={`/journey/${item.answer.journey.id}`}>{t("viewJourney")} →</Link></div>}
          {item.answer.alternatives?.length ? <div className="ai-alternatives"><small>Autres options trouvées</small>{item.answer.alternatives.map((journey) => <Link key={journey.id} href={`/journey/${journey.id}`}><span>{journey.operator} · {journey.depart}</span><b>{formatPrice(journey.price)}</b></Link>)}</div> : null}
          {item.answer.from && item.answer.to && <Link className="ai-search-link" href={`/search?from=${encodeURIComponent(item.answer.from)}&to=${encodeURIComponent(item.answer.to)}`}>{t("search")} {item.answer.from} → {item.answer.to}</Link>}
          {item.answer.sources.length ? <div className="ai-sources"><small>Sources consultées dans la base SIR</small>{item.answer.sources.map((source) => <span key={source.id}><ExternalLink aria-hidden="true"/>{source.title}</span>)}</div> : null}
        </div>
      </div>)}</div>
      {loading && <div className="typing"><i></i><i></i><i></i></div>}
      {error && <div className="form-error">{error}</div>}
      <form className="chatrow" onSubmit={(event) => { event.preventDefault(); ask(); }}><input className="chatinput" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={600} placeholder="Ex. Le moyen le moins cher de Casablanca à Fès…"/><button disabled={loading}>{loading ? "Analyse…" : t("send")}</button></form>
    </div>
    <p className="ai-disclaimer">SirAI n’invente aucun horaire. Les données collectées restent indicatives et doivent être confirmées auprès des opérateurs officiels.</p>
  </div></main>;
}
