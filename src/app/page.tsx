"use client";

import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { Price } from "@/components/Price";
import { useApp } from "@/components/AppProvider";
import { operators } from "@/data/operators";
import { journeys } from "@/data/journeys";
import { Banknote, BrainCircuit, CreditCard, MapPinned, ShieldCheck, Timer, Waypoints } from "lucide-react";

const copy = {
  fr: {
    eyebrow:"Voyage multimodal au Maroc", title:"Tout le Maroc.", accent:"Une seule recherche.",
    intro:"Comparez trains, autocars, vols et itinéraires combinés selon votre heure réelle de départ, votre budget et votre confort.",
    why:"Pourquoi SIR ?", right:"Le bon trajet, vraiment.", rightCopy:"Nous ne comparons pas seulement le temps à bord. SIR calcule l’attente, les correspondances et votre arrivée réelle.",
    popular:"Destinations populaires", next:"Où irez-vous ensuite ?", all:"Voir tous les trajets",
  },
  en: {
    eyebrow:"Multimodal travel across Morocco", title:"All of Morocco.", accent:"One simple search.",
    intro:"Compare trains, coaches, flights and combined journeys by real departure time, budget and comfort.",
    why:"Why SIR?", right:"The right journey, for real.", rightCopy:"We go beyond time on board. SIR includes departure wait, transfers and your real arrival time.",
    popular:"Popular destinations", next:"Where will you go next?", all:"See all journeys",
  },
  ar: {
    eyebrow:"تنقل متعدد الوسائط في المغرب", title:"كل المغرب.", accent:"بحث واحد بسيط.",
    intro:"قارن القطارات والحافلات والطائرات والرحلات المشتركة حسب وقت الانطلاق الفعلي والميزانية والراحة.",
    why:"لماذا SIR؟", right:"الرحلة المناسبة فعلاً.", rightCopy:"نحتسب وقت الانتظار والتحويلات ووقت الوصول الحقيقي، وليس وقت الرحلة فقط.",
    popular:"وجهات شهيرة", next:"إلى أين ستسافر؟", all:"عرض كل الرحلات",
  },
};

export default function Home() {
  const { locale, t } = useApp();
  const c = copy[locale];
  return <main>
    <section className="hero"><div className="container hero-content">
      <span className="eyebrow">✦ {c.eyebrow}</span>
      <h1>{c.title}<br/><em>{c.accent}</em></h1>
      <p className="hero-copy">{c.intro}</p>
      <SearchForm/>
      <div className="trust"><span>✓ <b>{t("demoData")}</b></span><span>✓ <b>{t("waitingIncluded")}</b></span><span>✓ <b>Réservation 100 % simulée</b></span></div>
    </div></section>
    <section className="section"><div className="container">
      <div className="section-head"><div><span className="kicker">{c.why}</span><h2>{c.right}</h2></div><p>{c.rightCopy}</p></div>
      <div className="benefits">
        <div className="benefit"><div className="icon"><Waypoints aria-hidden="true"/></div><h3>{t("all")} modes</h3><p>ONCF, CTM, Supratours, compagnies aériennes et itinéraires combinés.</p></div>
        <div className="benefit"><div className="icon"><Timer aria-hidden="true"/></div><h3>{t("totalTime")}</h3><p>Le classement tient compte de l’attente avant le départ et des correspondances.</p></div>
        <div className="benefit"><div className="icon"><MapPinned aria-hidden="true"/></div><h3>{journeys.length} options indicatives</h3><p>Des grandes métropoles aux villes du Rif, de l’Atlas et du Sahara.</p></div>
        <div className="benefit"><div className="icon"><BrainCircuit aria-hidden="true"/></div><h3>SirAI local</h3><p>Une réponse utile même sans clé API ni connexion à un modèle externe.</p></div>
      </div>
      <div className="operator-band"><span>Opérateurs représentés dans la démo</span><div>{operators.filter((operator) => !operator.isDemo || operator.logo !== "/operators/demo-coach.svg").map((operator) => operator.officialUrl === "#" ? <span key={`${operator.id}-${operator.name}`} title={`${operator.name} · simulation`}><img src={operator.logo} alt={operator.name}/></span> : <a key={`${operator.id}-${operator.name}`} href={operator.officialUrl} target="_blank" rel="noreferrer" title={operator.name}><img src={operator.logo} alt={operator.name}/></a>)}</div><small>Logos fournis à des fins d’identification dans ce prototype. SIR n’est affilié à aucun opérateur.</small></div>
    </div></section>
    <section className="transport-showcase"><div className="container"><div className="showcase-intro"><span className="kicker">Une plateforme, tous les horizons</span><h2>Du rail au ciel, sans perdre le fil.</h2></div><div className="showcase-grid"><Link href="/search?mode=TRAIN" className="showcase-card train-photo"><span>01 · ONCF</span><h3>Le Maroc sur les rails</h3><p>Al Boraq, TNR et Al Atlas réunis dans la comparaison.</p></Link><Link href="/search?mode=COACH" className="showcase-card coach-photo"><span>02 · Autocars</span><h3>Atteindre chaque région</h3><p>Grandes lignes, STCR, Nejme Chamal et correspondances simulées.</p></Link><Link href="/search?mode=FLIGHT" className="showcase-card flight-photo"><span>03 · Vols domestiques</span><h3>Rapprocher le Nord et le Sud</h3><p>Comparez le temps total, pas seulement le temps de vol.</p></Link><Link href="/search?mode=GRAND_TAXI" className="showcase-card taxi-photo"><span>04 · Grands taxis</span><h3>Relier les villes proches</h3><p>Des taxis collectifs simulés uniquement pour les liaisons de moins de 250 km.</p></Link></div></div></section>
    <section className="app-download"><div className="container app-download-grid">
      <div className="app-download-copy">
        <span className="kicker">SIR dans votre poche</span>
        <h2>Téléchargez bientôt l’app SIR.<br/><em>Voyagez intelligemment.</em></h2>
        <p>Préparez vos trajets, comparez trains, autocars et vols, puis retrouvez vos voyages depuis une seule application pensée pour le Maroc.</p>
        <div className="store-badges" aria-label="Applications bientôt disponibles">
          <span className="store-badge-image"><img src="/stores/google-play.png" alt="Google Play"/><small>Bientôt disponible</small></span>
          <span className="store-badge-image"><img src="/stores/app-store.png" alt="App Store"/><small>Bientôt disponible</small></span>
          <span className="store-badge-image"><img src="/stores/app-gallery.png" alt="Huawei AppGallery"/><small>Bientôt disponible</small></span>
        </div>
        <div className="payment-methods"><span><CreditCard aria-hidden="true"/><b>Carte bancaire</b></span><span><ShieldCheck aria-hidden="true"/><b>CMI sécurisé</b></span><span><Banknote aria-hidden="true"/><b>Paiement simulé</b></span></div>
        <small className="app-note">Les applications mobiles sont en préparation. Aucun téléchargement n’est encore proposé.</small>
      </div>
      <div className="app-promo-visual"><img src="/home/sir-app-preview.png" alt="Aperçu de la future application mobile SIR"/></div>
    </div></section>
    <section className="section routes"><div className="container">
      <div className="section-head"><div><span className="kicker">{c.popular}</span><h2>{c.next}</h2></div><Link href="/search">{c.all} →</Link></div>
      <div className="routegrid">
        <Link href="/search?from=Casablanca&to=Marrakech" className="routecard destination-marrakech"><span className="pricepill"><Price value={105}/></span><small>Casablanca →</small><h3>Marrakech</h3></Link>
        <Link href="/search?from=Rabat&to=Casablanca" className="routecard destination-casablanca"><small>Rabat →</small><h3>Casablanca</h3></Link>
        <Link href="/search?from=Errachidia&to=Merzouga" className="routecard destination-merzouga"><small>Errachidia →</small><h3>Merzouga</h3></Link>
        <Link href="/search?from=Casablanca&to=Fès" className="routecard destination-fes"><span className="pricepill"><Price value={132}/></span><small>Casablanca →</small><h3>Fès</h3></Link>
        <Link href="/search?from=Tanger&to=Chefchaouen" className="routecard destination-chefchaouen"><small>Tanger →</small><h3>Chefchaouen</h3></Link>
        <Link href="/search?from=Casablanca&to=Dakhla" className="routecard destination-dakhla"><span className="pricepill"><Price value={1054}/></span><small>Casablanca →</small><h3>Dakhla</h3></Link>
      </div>
    </div>
    </section>
  </main>;
}
