"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findJourneys, formatDuration, type Journey, type Mode } from "@/data/journeys";
import { getOperator } from "@/data/operators";
import { SearchForm } from "./SearchForm";
import { OperatorLogo } from "./OperatorLogo";
import { RouteMap } from "./RouteMap";
import { useApp } from "./AppProvider";
import { Price } from "./Price";

const icons: Record<Mode,string> = { TRAIN:"▰", COACH:"▣", FLIGHT:"✈", GRAND_TAXI:"◆", COMBINED:"⌁" };

export function SearchResults() {
  const params = useSearchParams();
  const { t, formatPrice, locale } = useApp();
  const from = params.get("from") || "Casablanca";
  const to = params.get("to") || "Fès";
  const initialMode = (params.get("mode") as Mode | null) || "ALL";
  const requestedBudget = Number(params.get("budget")) || 1500;
  const [mode, setMode] = useState<string>(initialMode);
  const [sort, setSort] = useState(params.get("priority") || "recommended");
  const [maxPrice, setMaxPrice] = useState(Math.max(100, Math.min(1500, requestedBudget)));
  const [direct, setDirect] = useState(params.get("direct") === "1");
  const [refundable, setRefundable] = useState(false);
  const [mobileView, setMobileView] = useState<"list"|"map">("list");
  const [selectedDay, setSelectedDay] = useState(1);
  const base = useMemo(() => findJourneys(from, to), [from, to]);

  const shown = useMemo(() => {
    const filtered = (mode === "ALL" ? base : base.filter((journey) => journey.mode === mode))
      .filter((journey) => journey.price <= maxPrice && (!direct || journey.transfers === 0) && (!refundable || journey.refundable));
    return [...filtered].sort((a,b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "arrival") return a.arrive.localeCompare(b.arrive);
      if (sort === "duration") return (a.wait+a.ride+a.transfer) - (b.wait+b.ride+b.transfer);
      if (sort === "comfort") return Number(b.comfort.includes("1ère") || b.comfort.includes("Premium")) - Number(a.comfort.includes("1ère") || a.comfort.includes("Premium"));
      return Number(b.tags.includes("Recommended")) - Number(a.tags.includes("Recommended"));
    });
  }, [base, mode, sort, maxPrice, direct, refundable]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = shown.find((journey) => journey.id === selectedId) ?? shown[0];
  const modes: Array<"ALL"|Mode> = ["ALL","TRAIN","COACH","FLIGHT","GRAND_TAXI","COMBINED"];
  const modeLabel = (value: "ALL"|Mode) => value === "ALL" ? t("all") : value === "TRAIN" ? t("train") : value === "COACH" ? t("coach") : value === "FLIGHT" ? t("flight") : value === "GRAND_TAXI" ? t("grandTaxi") : t("combined");

  return (
    <main>
      <section className="pagehero"><div className="container">
        <span className="kicker">SIR Compare</span>
        <h1>{from} → {to}</h1>
        <SearchForm compact defaultFrom={from} defaultTo={to}/>
      </div></section>
      <div className="container">
        <div className="tabs">{modes.map((item) => {
          const subset = item === "ALL" ? base : base.filter((journey) => journey.mode === item);
          const lowest = subset.length ? Math.min(...subset.map((journey) => journey.price)) : null;
          return <button key={item} onClick={() => setMode(item)} className={`tab ${mode === item ? "active" : ""}`}>{modeLabel(item)}<small>{lowest ? `${t("fromPrice")} ${formatPrice(lowest)}` : "—"}</small></button>;
        })}</div>
        <div className="date-strip">
          {["Hier","Aujourd’hui","Demain","Mar. 29","Mer. 30"].map((label,index) => <button type="button" onClick={() => setSelectedDay(index)} className={index === selectedDay ? "selected" : ""} key={label} aria-pressed={index === selectedDay}><b>{label}</b><span>{base.length && index > 0 ? formatPrice(Math.min(...base.map((journey) => journey.price)) + index * 5) : "—"}</span></button>)}
        </div>
        <div className="demo"><b>Données de démonstration et données collectées indicatives</b> — {t("demoWarning")}</div>
        <div className="filters">
          <label><span>{t("maxPrice")}</span><input type="range" min="100" max="1500" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))}/><b>{formatPrice(maxPrice)}</b></label>
          <label className="checkfilter"><input type="checkbox" checked={direct} onChange={(event) => setDirect(event.target.checked)}/> {t("directOnly")}</label>
          <label className="checkfilter"><input type="checkbox" checked={refundable} onChange={(event) => setRefundable(event.target.checked)}/> {t("refundable")}</label>
          <button type="button" onClick={() => { setMaxPrice(1500); setDirect(false); setRefundable(false); setMode("ALL"); }}>{t("reset")}</button>
        </div>
        <div className="view-toggle" aria-label="Affichage des résultats">
          <button type="button" className={mobileView === "list" ? "active" : ""} onClick={() => setMobileView("list")}>☷ {t("results")}</button>
          <button type="button" className={mobileView === "map" ? "active" : ""} onClick={() => setMobileView("map")}>⌖ {t("map")}</button>
        </div>
        <div className={`results-layout ${mobileView === "map" ? "map-view" : "list-view"}`}>
          <div>
            <div className="results-toolbar">
              <div><b>{shown.length} {t("found")}</b><div className="toolbar-note">{t("waitingIncluded")}</div></div>
              <select className="sort" value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t("priority")}><option value="recommended">{t("recommended")}</option><option value="arrival">{t("earliest")}</option><option value="price">{t("cheapest")}</option><option value="duration">{t("totalTime")}</option><option value="comfort">{t("comfortable")}</option></select>
            </div>
            {shown.length ? shown.map((journey,index) => {
              const operator = getOperator(journey.operator.split(" + ")[0]);
              return (
                <article className={`result-card ${selected?.id === journey.id ? "selected-card" : ""}`} key={journey.id} onMouseEnter={() => setSelectedId(journey.id)} onFocus={() => setSelectedId(journey.id)}>
                  <div className="badges">{journey.tags.slice(0,index ? 1 : 2).map((tag,tagIndex) => <span key={tag} className={`badge ${tagIndex ? "red" : ""}`}>{tag}</span>)}</div>
                  <div className="result-main">
                    <div className="operator-block"><OperatorLogo operator={journey.operator}/><div><b>{journey.operator}</b><div className="operator">{journey.service} · {icons[journey.mode]}</div></div></div>
                    <div><div className="duration">{formatDuration(journey.ride)} à bord</div><div className="timeline-row"><div><div className="time">{journey.depart}</div><div className="station">{journey.from}</div></div><div className="line"></div><div><div className="time">{journey.arrive}</div><div className="station">{journey.to}</div></div></div></div>
                    <div className="result-price"><span>{t("fromPrice")}</span><br/><Price value={journey.price} className="price-strong"/></div>
                  </div>
                  <div className="result-meta"><span>◷ {t("wait")} {formatDuration(journey.wait)}</span><span>⌁ {t("totalTime")} {formatDuration(journey.wait+journey.ride+journey.transfer)}</span><span>{journey.transfers ? `${journey.transfers} correspondance` : t("direct")}</span><span>✦ {journey.comfort}</span><span>{journey.seats} {t("seats")}</span>{journey.source === "COLLECTED" && journey.sourceUpdatedAt && <span className="source-stamp">Source collectée · {new Date(journey.sourceUpdatedAt).toLocaleDateString(locale)}</span>}{journey.source === "SIMULATED" && <span className="source-stamp simulated">Simulation SIR · non officielle</span>}</div>
                  {index === 0 && <p className="recommendation"><b>{t("why")}</b> {journey.tags.includes("Earliest arrival") ? "Ce départ réduit fortement votre attente et vous fait arriver avant les autres options." : "Cette option offre le meilleur équilibre entre prix, durée réelle et confort."}</p>}
                  <div className="cardactions">
                    {operator && operator.officialUrl !== "#" ? <a className="official" href={operator.officialUrl} target="_blank" rel="noreferrer">{t("verifyOperator")} ↗</a> : <span className="operator demo-operator">{t("demoData")}</span>}
                    <Link className="detailsbtn" href={`/journey/${journey.id}`}>{t("viewJourney")} →</Link>
                  </div>
                </article>
              );
            }) : <div className="panel empty-state"><div className="empty-icon">⌁</div><h3>{t("noResults")}</h3><p>{t("noResultsHelp")}</p><Link className="detailsbtn" href="/ai">✦ {t("aiPlanner")}</Link></div>}
          </div>
          <RouteMap journey={selected} fallbackFrom={from} fallbackTo={to}/>
        </div>
      </div>
    </main>
  );
}
