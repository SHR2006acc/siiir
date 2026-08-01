"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Gift, Phone, X } from "lucide-react";
import { brand } from "@/config/brand";
import { type Currency, type Locale, useApp } from "./AppProvider";

export function Header() {
  const { locale, currency, setLocale, setCurrency, t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [referralOpen, setReferralOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refreshUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem("easyway-user") || "null");
        setUserName(user?.firstName || "");
      } catch {
        setUserName("");
      }
    };
    refreshUser();
    window.addEventListener("easyway-auth", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("easyway-auth", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  useEffect(() => {
    if (!referralOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setReferralOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [referralOpen]);

  async function copyReferralLink() {
    await navigator.clipboard.writeText("https://sir.ma/inviter");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo" aria-label="SIR accueil">
          <img src={brand.logoPath} alt="SIR" />
        </Link>
        <nav className={`navlinks ${menuOpen ? "open" : ""}`}>
          <Link href="/search?mode=TRAIN" onClick={() => setMenuOpen(false)}>{t("trains")}</Link>
          <Link href="/search?mode=COACH" onClick={() => setMenuOpen(false)}>{t("coaches")}</Link>
          <Link href="/search?mode=FLIGHT" onClick={() => setMenuOpen(false)}>{t("flights")}</Link>
          <Link href="/search?mode=GRAND_TAXI" onClick={() => setMenuOpen(false)}>{t("grandTaxi")}</Link>
          <Link href="/ai" onClick={() => setMenuOpen(false)}>{t("aiPlanner")}</Link>
          <Link href="/bookings" className="mobile-only" onClick={() => setMenuOpen(false)}>{t("bookings")}</Link>
        </nav>
        <div className="navtools">
          <Link className="toolbtn bookings-link" href="/bookings">{t("bookings")}</Link>
          <label className="select-tool" aria-label={t("currency")}>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
              <option value="MAD">MAD</option><option value="EUR">EUR</option><option value="USD">USD</option>
            </select>
          </label>
          <label className="select-tool" aria-label={t("language")}>
            <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
              <option value="fr">FR</option><option value="en">EN</option><option value="ar">AR</option>
            </select>
          </label>
          <button className="referral-trigger" type="button" onClick={() => setReferralOpen(true)}><Gift aria-hidden="true"/><span>Inviter & gagner</span></button>
          <Link className="signin" href={userName ? "/profile" : "/sign-in"}>{userName ? `${userName} · ${t("profile")}` : t("signIn")}</Link>
          <button className="mobile-menu" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>
      {referralOpen && <div className="referral-backdrop" onMouseDown={() => setReferralOpen(false)}>
        <section className="referral-modal" role="dialog" aria-modal="true" aria-labelledby="referral-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="referral-close" type="button" aria-label="Fermer" onClick={() => setReferralOpen(false)}><X aria-hidden="true"/></button>
          <div className="referral-gift"><Gift aria-hidden="true"/></div>
          <span className="kicker">Programme de parrainage SIR</span>
          <h2 id="referral-title">Invitez vos amis et gagnez</h2>
          <p>Offrez à vos amis une réduction de <b>20 MAD</b> sur leur première réservation simulée et recevez une récompense de <b>20 MAD</b>. Jusqu’à 10 invitations.</p>
          <div className="referral-copy"><input aria-label="Lien de parrainage" value="https://sir.ma/inviter" readOnly/><button type="button" onClick={copyReferralLink}><Copy aria-hidden="true"/>{copied ? "Lien copié !" : "Copier le lien"}</button></div>
          <small>Fonction marketing de démonstration : aucune récompense financière réelle n’est créée.</small>
        </section>
      </div>}
    </header>
  );
}

export function Footer() {
  const { t, setLocale } = useApp();
  return (
    <footer className="footer"><div className="container">
      <div className="footgrid">
        <div><Link href="/" className="logo"><img src={brand.logoPath} alt="SIR" /></Link><p style={{maxWidth:350,lineHeight:1.6,fontSize:14}}>Une plateforme nationale moderne pour comparer les transports interurbains au Maroc.</p></div>
        <div><h4>Explorer</h4><Link href="/search">{t("search")}</Link><Link href="/ai">{t("aiPlanner")}</Link><Link href="/bookings">{t("bookings")}</Link></div>
        <div><h4>SIR</h4><Link href="/about">Notre mission</Link><Link href="/help">Centre d’aide</Link><Link href="/sign-up">{t("createAccount")}</Link></div>
        <div><h4>Contactez-nous</h4><a className="footer-phone" href="tel:+212611424571"><Phone aria-hidden="true"/> 06 11 42 45 71</a><p className="contact-note">Une question sur votre trajet ou sur le prototype SIR ? Notre ligne de contact est à votre disposition.</p><img className="social-networks" src="/branding/social-networks.png" alt="Réseaux sociaux SIR"/></div>
      </div>
      <div className="footer-languages"><strong>{t("language")}</strong><button onClick={() => setLocale("fr")}>Français</button><button onClick={() => setLocale("en")}>English</button><button onClick={() => setLocale("ar")}>العربية</button></div>
      <div className="copyright"><span>© 2026 SIR Morocco · Prototype hackathon · Built by Mohammed Hsiny.</span><span>{t("demoWarning")}</span></div>
    </div></footer>
  );
}

export function AiFab() {
  const { t } = useApp();
  return <Link href="/ai" className="ai-fab">✦ {t("aiPlanner")}</Link>;
}
