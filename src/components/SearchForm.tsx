"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { locationNames } from "@/data/locations";
import { useApp } from "./AppProvider";
import { LocationCombobox } from "./LocationCombobox";

export function SearchForm({ compact=false, defaultFrom="Casablanca", defaultTo="Fès" }: { compact?: boolean; defaultFrom?: string; defaultTo?: string }) {
  const router = useRouter();
  const { t, currency, toMad } = useApp();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [priority, setPriority] = useState("recommended");
  const [passengers, setPassengers] = useState(1);
  const [budget, setBudget] = useState("");
  const [direct, setDirect] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams({
      from, to, date, priority,
      passengers:String(passengers),
      ...(budget ? { budget:String(Math.round(toMad(Number(budget)))) } : {}),
      ...(direct ? { direct:"1" } : {}),
    });
    router.push(`/search?${query.toString()}`);
  }

  return (
    <form onSubmit={submit} className={compact ? "compact-search" : "searchbox"}>
      <div className="searchgrid">
        <LocationCombobox label={t("from")} value={from} options={locationNames} onChange={setFrom} onSwap={() => { setFrom(to); setTo(from); }}/>
        <LocationCombobox label={t("to")} value={to} options={locationNames} onChange={setTo}/>
        <div className="field"><label>{t("date")}</label><input aria-label={t("date")} type="date" value={date} onChange={(event) => setDate(event.target.value)}/></div>
        <div className="field"><label>{t("priority")}</label><select aria-label={t("priority")} value={priority} onChange={(event) => setPriority(event.target.value)}><option value="recommended">{t("recommended")}</option><option value="arrival">{t("earliest")}</option><option value="price">{t("cheapest")}</option><option value="comfort">{t("comfortable")}</option></select></div>
        <button className="searchbutton" aria-label={t("search")}>{t("search")} →</button>
      </div>
      {!compact && <div className="searchextras">
        <label className="direct"><input type="checkbox" checked={direct} onChange={(event) => setDirect(event.target.checked)}/> {t("directOnly")}</label>
        <label className="inline-control"><span>👤</span><select aria-label="Voyageurs" value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
        <label className="inline-control"><input aria-label={t("maxPrice")} inputMode="numeric" placeholder={`${t("maxPrice")} (${currency})`} value={budget} onChange={(event) => setBudget(event.target.value.replace(/\D/g,""))}/></label>
        <Link className="ai-link" href="/ai">✦ {t("describeAI")}</Link>
      </div>}
    </form>
  );
}
