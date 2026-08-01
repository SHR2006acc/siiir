"use client";

import { useState } from "react";
import { useApp } from "./AppProvider";

export function BookingActions() {
  const { formatPrice } = useApp();
  const [status,setStatus] = useState("CONFIRMED_DEMO");
  const [editing,setEditing] = useState(false);
  const [message,setMessage] = useState("");
  return <div className="booking-actions">
    {message && <div className="form-success" role="status">{message}</div>}
    {editing && <div className="panel inline-edit"><h3>Modifier les options</h3><label>Siège <select><option>Fenêtre</option><option>Couloir</option><option>Aucune préférence</option></select></label><label>Bagage <select><option>1 bagage</option><option>2 bagages (+{formatPrice(55)})</option></select></label><button className="detailsbtn" onClick={() => { setEditing(false); setMessage("Modification enregistrée en mode démonstration."); }}>Enregistrer</button></div>}
    <button className="secondary-btn" onClick={() => setEditing(!editing)} disabled={status !== "CONFIRMED_DEMO"}>{editing ? "Fermer" : "Modifier la réservation (simulation)"}</button>
    <button className="secondary-btn danger-outline" disabled={status !== "CONFIRMED_DEMO"} onClick={() => { if (window.confirm("Annuler cette réservation de démonstration ?")) { setStatus("CANCELLED_DEMO"); setMessage("Réservation annulée. Remboursement simulé : aucun mouvement bancaire réel."); } }}>{status === "CANCELLED_DEMO" ? "Réservation annulée" : "Annuler (simulation)"}</button>
    <button className="secondary-btn" onClick={() => window.print()}>Télécharger / imprimer le billet</button>
  </div>;
}
