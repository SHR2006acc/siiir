import Link from "next/link";
import { journeys, formatDuration } from "@/data/journeys";
import { getOperator } from "@/data/operators";
import { OperatorLogo } from "@/components/OperatorLogo";
import { Price } from "@/components/Price";
import { RouteMap } from "@/components/RouteMap";

export default async function JourneyPage({ params }: { params:Promise<{journeyId:string}> }) {
  const { journeyId } = await params;
  const journey = journeys.find((item) => item.id === journeyId) || journeys[0];
  const operator = getOperator(journey.operator.split(" + ")[0]);
  return <main>
    <section className="pagehero"><div className="container journey-hero-row"><div><span className="kicker">Détail du trajet</span><h1>{journey.from} → {journey.to}</h1><p>{journey.operator} · {journey.service} · {journey.depart} — {journey.arrive}</p></div><OperatorLogo operator={journey.operator}/></div></section>
    <div className="container detail-wrap">
      <div>
        <section className="panel">
          <div className="badges"><span className="badge">{journey.tags[0] || "Demo"}</span><span className="badge red">{journey.mode}</span></div>
          <h2>Votre itinéraire</h2>
          <div className="journey-timeline">
            <div className="segment"><h4>{journey.depart} · {journey.from}</h4><p>{journey.operator} · {journey.service} · {journey.comfort}</p><p>{formatDuration(journey.ride)} à bord · {journey.seats} places disponibles en démo</p></div>
            {(journey.via ?? []).map((city,index) => <div className="segment transfer-segment" key={city}><h4>Correspondance à {city}</h4><p>{index === 0 ? formatDuration(journey.transfer) : "Arrêt intermédiaire"} · assistance non garantie en mode démo</p></div>)}
            <div className="segment"><h4>{journey.arrive} · {journey.to}</h4><p>Arrivée prévue dans l’inventaire de démonstration</p></div>
          </div>
        </section>
        <section className="panel"><h3>Choisissez votre tarif</h3>
          <div className="fare"><div><b>Essentiel</b><div className="operator">1 bagage · non remboursable</div></div><b><Price value={journey.price}/></b></div>
          <div className="fare selected"><div><b>Flexible</b><div className="operator">2 bagages · échange gratuit</div></div><b><Price value={journey.price+55}/></b></div>
          <div className="fare"><div><b>Premium</b><div className="operator">Siège au choix · remboursable</div></div><b><Price value={journey.price+120}/></b></div>
        </section>
        <RouteMap journey={journey} fallbackFrom={journey.from} fallbackTo={journey.to}/>
        <div className="demo">Les prix, horaires et disponibilités affichés sont des données de démonstration. Vérifiez toujours le site officiel de l’opérateur.</div>
      </div>
      <aside><div className="panel sticky-book"><span className="operator">Prix total · 1 voyageur</span><div className="bigprice"><Price value={journey.price+55}/></div><div className="summaryline"><span>Temps réel total</span><b>{formatDuration(journey.wait+journey.ride+journey.transfer)}</b></div><div className="summaryline"><span>Correspondances</span><b>{journey.transfers}</b></div><div className="summaryline"><span>Échangeable</span><b>{journey.exchangeable ? "Oui" : "Non"}</b></div><Link href={`/passengers?journey=${journey.id}`} className="primary-btn button-link">Continuer →</Link>{operator && operator.officialUrl !== "#" && <a href={operator.officialUrl} target="_blank" rel="noreferrer" className="secondary-btn button-link">Vérifier chez {operator.name} ↗</a>}<Link href={`/ai?journey=${journey.id}`} className="secondary-btn button-link">✦ Demander à SirAI</Link></div></aside>
    </div>
  </main>;
}
