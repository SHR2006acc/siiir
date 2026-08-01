import { QRCodeSVG } from "qrcode.react";
import { BookingActions } from "@/components/BookingActions";

export default async function Booking({params}:{params:Promise<{bookingId:string}>}) {
  const {bookingId}=await params;
  return <main className="form-page"><div className="container" style={{maxWidth:800}}><div className="form-card"><div className="ticket-head"><div><span className="badge">Confirmé · démo</span><h1>Casablanca → Fès</h1><p>Référence <b>{bookingId}</b></p></div><QRCodeSVG value={bookingId} size={110}/></div><hr/><div className="summaryline"><span>Voyageur</span><b>Yasmine El Amrani</b></div><div className="summaryline"><span>Opérateur</span><b>CTM</b></div><div className="summaryline"><span>Départ</span><b>11:00 · Casablanca</b></div><div className="summaryline"><span>Arrivée</span><b>15:40 · Fès</b></div><div className="summaryline"><span>Paiement</span><b>Approuvé (démo)</b></div><div className="demo">Ce document n’est pas un titre de transport réel.</div><BookingActions/></div></div></main>;
}
