"use client";
import { useRouter,useSearchParams } from "next/navigation";
import { Suspense,useState } from "react";
import { journeys } from "@/data/journeys";
import { Price } from "./Price";
import { OperatorLogo } from "./OperatorLogo";

function Summary({id}:{id:string}) {
  const journey=journeys.find((item)=>item.id===id)||journeys[0];
  return <aside className="form-card"><OperatorLogo operator={journey.operator}/><span className="badge">Votre trajet</span><h3>{journey.from} → {journey.to}</h3><div className="summaryline"><span>{journey.depart} — {journey.arrive}</span><b>{journey.operator}</b></div><div className="summaryline"><span>Tarif Flexible</span><b><Price value={journey.price+55}/></b></div><div className="demo">Réservation de démonstration uniquement.</div></aside>;
}
function PassengerInner() {
  const router=useRouter(),params=useSearchParams(),id=params.get("journey")||journeys[0].id;
  return <main className="form-page"><div className="container form-layout"><form className="form-card" onSubmit={(event)=>{event.preventDefault();router.push(`/checkout?journey=${id}`)}}><span className="kicker">Étape 1 sur 2</span><h1>Qui voyage ?</h1><div className="formgrid"><div className="inputgroup"><label>Prénom</label><input required placeholder="Yasmine"/></div><div className="inputgroup"><label>Nom</label><input required placeholder="El Amrani"/></div><div className="inputgroup"><label>E-mail</label><input required type="email" placeholder="yasmine@email.com"/></div><div className="inputgroup"><label>Téléphone</label><input required type="tel" placeholder="+212 6 00 00 00 00"/></div><div className="inputgroup"><label>Date de naissance</label><input required type="date"/></div><div className="inputgroup"><label>Nationalité</label><select><option>Marocaine</option><option>Autre</option></select></div><div className="inputgroup"><label>Bagage</label><select><option>1 bagage standard</option><option>2 bagages</option></select></div><div className="inputgroup"><label>Préférence de siège</label><select><option>Fenêtre</option><option>Couloir</option><option>Aucune</option></select></div></div><label className="checkbox"><input required type="checkbox"/> Je confirme qu’il s’agit d’une démonstration hackathon. Aucune réservation réelle ne sera créée auprès d’un opérateur.</label><button className="primary-btn">Continuer vers le paiement démo →</button></form><Summary id={id}/></div></main>;
}
export function PassengerForm(){return <Suspense><PassengerInner/></Suspense>}
function CheckoutInner() {
  const router=useRouter(),params=useSearchParams(),id=params.get("journey")||journeys[0].id;
  const [busy,setBusy]=useState(false);
  function done(event:React.FormEvent) {
    event.preventDefault();setBusy(true);
    setTimeout(()=>{const ref=`MA-DEMO-${Math.random().toString(36).slice(2,8).toUpperCase()}`;localStorage.setItem(ref,JSON.stringify({ref,email:"yasmine@email.com",journey:id,status:"CONFIRMED_DEMO"}));router.push(`/confirmation/${ref}?journey=${id}`)},1000);
  }
  return <main className="form-page"><div className="container form-layout"><form className="form-card" onSubmit={done}><span className="kicker">Étape 2 sur 2</span><h1>Paiement de démonstration</h1><div className="demo"><b>Aucun argent ne sera débité</b> et les données de carte ne seront jamais stockées.</div><div className="formgrid" style={{marginTop:20}}><div className="inputgroup full"><label>Nom sur la carte</label><input required placeholder="YASMINE EL AMRANI"/></div><div className="inputgroup full"><label>Numéro de carte test</label><input required defaultValue="4242 4242 4242 4242"/></div><div className="inputgroup"><label>Expiration</label><input required defaultValue="12/30"/></div><div className="inputgroup"><label>CVV</label><input required defaultValue="123"/></div><div className="inputgroup full"><label>Pays de facturation</label><select><option>Maroc</option></select></div></div><button disabled={busy} className="primary-btn">{busy?"Traitement sécurisé…":"Confirmer le paiement démo"}</button></form><Summary id={id}/></div></main>;
}
export function CheckoutForm(){return <Suspense><CheckoutInner/></Suspense>}
