"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";

type DemoUser = { firstName:string; lastName:string; email:string; city:string; preferredMode:string };

export function SignUpForm() {
  const router = useRouter();
  const { locale } = useApp();
  const [error, setError] = useState("");
  const title = locale === "ar" ? "إنشاء حساب" : locale === "en" ? "Create your account" : "Créer votre compte";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (password !== data.get("confirm")) return setError("Les mots de passe ne correspondent pas.");
    const user: DemoUser = {
      firstName:String(data.get("firstName")),
      lastName:String(data.get("lastName")),
      email:String(data.get("email")),
      city:String(data.get("city")),
      preferredMode:String(data.get("preferredMode")),
    };
    localStorage.setItem("easyway-user", JSON.stringify(user));
    window.dispatchEvent(new Event("easyway-auth"));
    router.push("/profile?welcome=1");
  }

  return <AuthShell asideTitle="Votre Maroc, à votre façon." asideCopy="Sauvegardez vos préférences, retrouvez vos billets démo et préparez plus vite vos prochains trajets.">
    <form className="auth-card" onSubmit={submit}>
      <span className="kicker">SIR ID · Démonstration</span><h1>{title}</h1>
      <p className="form-intro">Aucune donnée n’est envoyée à un serveur. Ce profil reste uniquement dans votre navigateur.</p>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="formgrid">
        <div className="inputgroup"><label>Prénom</label><input name="firstName" required autoComplete="given-name"/></div>
        <div className="inputgroup"><label>Nom</label><input name="lastName" required autoComplete="family-name"/></div>
        <div className="inputgroup full"><label>E-mail</label><input name="email" type="email" required autoComplete="email"/></div>
        <div className="inputgroup"><label>Ville</label><select name="city"><option>Casablanca</option><option>Rabat</option><option>Fès</option><option>Marrakech</option><option>Agadir</option><option>Tanger</option></select></div>
        <div className="inputgroup"><label>Mode préféré</label><select name="preferredMode"><option>Train</option><option>Autocar</option><option>Vol</option><option>Meilleure option</option></select></div>
        <div className="inputgroup"><label>Mot de passe démo</label><input name="password" type="password" minLength={8} required autoComplete="new-password"/></div>
        <div className="inputgroup"><label>Confirmer</label><input name="confirm" type="password" minLength={8} required autoComplete="new-password"/></div>
      </div>
      <label className="checkbox"><input type="checkbox" required/> J’accepte que ce profil fictif soit conservé localement pour la démonstration.</label>
      <button className="primary-btn">Créer mon compte →</button>
      <p className="auth-switch">Déjà membre ? <Link href="/sign-in">Se connecter</Link></p>
    </form>
  </AuthShell>;
}

export function SignInForm() {
  const router = useRouter();
  const [error,setError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const saved = localStorage.getItem("easyway-user");
    if (!saved) {
      localStorage.setItem("easyway-user", JSON.stringify({firstName:"Yasmine",lastName:"El Amrani",email,city:"Casablanca",preferredMode:"Train"}));
    }
    if (!email.includes("@")) return setError("Saisissez une adresse e-mail valide.");
    window.dispatchEvent(new Event("easyway-auth"));
    router.push("/profile");
  }
  return <AuthShell asideTitle="Heureux de vous revoir." asideCopy="Retrouvez vos voyages, vos préférences et vos recommandations personnalisées.">
    <form className="auth-card" onSubmit={submit}>
      <span className="kicker">SIR ID · Démonstration</span><h1>Se connecter</h1>
      <p className="form-intro">Utilisez n’importe quelle adresse e-mail valide et le mot de passe démo de votre choix.</p>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="inputgroup"><label>E-mail</label><input name="email" type="email" required autoComplete="email" placeholder="vous@email.com"/></div>
      <div className="inputgroup auth-gap"><label>Mot de passe</label><input name="password" type="password" required minLength={4} autoComplete="current-password" defaultValue="demo2026"/></div>
      <button className="primary-btn">Se connecter →</button>
      <p className="auth-switch">Pas encore de compte ? <Link href="/sign-up">Créer un compte</Link></p>
    </form>
  </AuthShell>;
}

function AuthShell({ children, asideTitle, asideCopy }: { children:React.ReactNode; asideTitle:string; asideCopy:string }) {
  return <main className="auth-page"><div className="container auth-layout"><aside className="auth-visual"><span className="eyebrow">✦ SIR Morocco</span><h2>{asideTitle}</h2><p>{asideCopy}</p><div className="auth-stats"><div><strong>1 100+</strong><span>options indicatives</span></div><div><strong>80+</strong><span>villes</span></div><div><strong>5</strong><span>modes</span></div></div></aside>{children}</div></main>;
}

export function ProfilePanel() {
  const router = useRouter();
  const { currency, locale } = useApp();
  const [user,setUser] = useState<DemoUser | null>(null);
  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("easyway-user") || "null")); } catch { setUser(null); }
  }, []);
  if (!user) return <main className="form-page"><div className="container form-card"><h1>Profil non connecté</h1><p>Connectez-vous pour afficher le profil de démonstration.</p><Link className="detailsbtn" href="/sign-in">Se connecter</Link></div></main>;
  return <main className="form-page"><div className="container profile-grid">
    <aside className="profile-card"><div className="avatar">{user.firstName[0]}{user.lastName[0]}</div><h1>{user.firstName} {user.lastName}</h1><p>{user.email}</p><span className="badge">Profil démo</span><button className="secondary-btn" onClick={() => { localStorage.removeItem("easyway-user"); window.dispatchEvent(new Event("easyway-auth")); router.push("/"); }}>Se déconnecter</button></aside>
    <div><section className="panel"><span className="kicker">Préférences</span><h2>Votre expérience SIR</h2><div className="profile-info"><div><span>Ville de départ</span><b>{user.city}</b></div><div><span>Mode préféré</span><b>{user.preferredMode}</b></div><div><span>Devise</span><b>{currency}</b></div><div><span>Langue</span><b>{locale === "fr" ? "Français" : locale === "en" ? "English" : "العربية"}</b></div></div></section><section className="panel"><h3>Votre prochain voyage</h3><p>Aucun voyage réel n’est réservé. Découvrez les offres de démonstration depuis {user.city}.</p><Link className="detailsbtn" href={`/search?from=${encodeURIComponent(user.city)}&to=Marrakech`}>Explorer les trajets →</Link></section></div>
  </div></main>;
}
