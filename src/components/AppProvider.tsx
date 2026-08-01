"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "fr" | "en" | "ar";
export type Currency = "MAD" | "EUR" | "USD";

const messages = {
  fr: {
    trains:"Trains", coaches:"Autocars", flights:"Vols", aiPlanner:"Planificateur IA",
    bookings:"Mes réservations", signIn:"Se connecter", profile:"Mon profil",
    from:"Départ", to:"Destination", date:"Date de départ", available:"Disponible dès",
    priority:"Priorité", recommended:"Recommandé", earliest:"Arrivée au plus tôt",
    cheapest:"Moins cher", comfortable:"Plus confortable", search:"Rechercher",
    directOnly:"Trajets directs uniquement", flexibleBudget:"Budget flexible",
    describeAI:"Décrivez votre voyage à l’IA", all:"Tous", train:"Train", coach:"Autocar",
    flight:"Vol", grandTaxi:"Grand taxi", combined:"Combiné", demoData:"Données de démonstration",
    demoWarning:"Vérifiez les horaires, la disponibilité et les prix auprès de l’opérateur.",
    maxPrice:"Prix maximum", refundable:"Remboursable", reset:"Réinitialiser",
    found:"trajets trouvés", waitingIncluded:"Temps d’attente inclus dans le classement",
    totalTime:"Temps réel", wait:"Attente", direct:"Direct", seats:"places démo",
    fromPrice:"à partir de", viewJourney:"Voir le trajet", verifyOperator:"Vérifier chez l’opérateur",
    noResults:"Aucun trajet correspondant", noResultsHelp:"Essayez une autre liaison ou retirez un filtre.",
    why:"Pourquoi ce trajet ?", selectedJourney:"Trajet sélectionné", mapCredit:"Fond cartographique © OpenStreetMap",
    createAccount:"Créer un compte", send:"Envoyer", language:"Langue", currency:"Devise", results:"Liste", map:"Carte",
  },
  en: {
    trains:"Trains", coaches:"Coaches", flights:"Flights", aiPlanner:"AI Planner",
    bookings:"My bookings", signIn:"Sign in", profile:"My profile",
    from:"From", to:"To", date:"Departure date", available:"Available from",
    priority:"Priority", recommended:"Recommended", earliest:"Earliest arrival",
    cheapest:"Cheapest", comfortable:"Most comfortable", search:"Search",
    directOnly:"Direct journeys only", flexibleBudget:"Flexible budget",
    describeAI:"Describe your trip to AI", all:"All", train:"Train", coach:"Coach",
    flight:"Flight", grandTaxi:"Grand taxi", combined:"Combined", demoData:"Demo data",
    demoWarning:"Verify schedules, availability and prices with the operator.",
    maxPrice:"Maximum price", refundable:"Refundable", reset:"Reset",
    found:"journeys found", waitingIncluded:"Waiting time is included in the ranking",
    totalTime:"Real total", wait:"Wait", direct:"Direct", seats:"demo seats",
    fromPrice:"from", viewJourney:"View journey", verifyOperator:"Check with operator",
    noResults:"No matching journey", noResultsHelp:"Try another route or remove a filter.",
    why:"Why this journey?", selectedJourney:"Selected journey", mapCredit:"Map © OpenStreetMap",
    createAccount:"Create account", send:"Send", language:"Language", currency:"Currency", results:"List", map:"Map",
  },
  ar: {
    trains:"القطارات", coaches:"الحافلات", flights:"الرحلات الجوية", aiPlanner:"مخطط الرحلات الذكي",
    bookings:"حجوزاتي", signIn:"تسجيل الدخول", profile:"ملفي",
    from:"من", to:"إلى", date:"تاريخ المغادرة", available:"متاح من",
    priority:"الأولوية", recommended:"موصى به", earliest:"الوصول الأسرع",
    cheapest:"الأرخص", comfortable:"الأكثر راحة", search:"بحث",
    directOnly:"رحلات مباشرة فقط", flexibleBudget:"ميزانية مرنة",
    describeAI:"صف رحلتك للمساعد", all:"الكل", train:"قطار", coach:"حافلة",
    flight:"طائرة", grandTaxi:"طاكسي كبير", combined:"رحلة مشتركة", demoData:"بيانات تجريبية",
    demoWarning:"تحقق من المواعيد والأسعار والتوفر لدى الناقل.",
    maxPrice:"السعر الأقصى", refundable:"قابل للاسترداد", reset:"إعادة الضبط",
    found:"رحلات متاحة", waitingIncluded:"يتم احتساب وقت الانتظار في الترتيب",
    totalTime:"الوقت الإجمالي", wait:"الانتظار", direct:"مباشر", seats:"مقاعد تجريبية",
    fromPrice:"ابتداءً من", viewJourney:"عرض الرحلة", verifyOperator:"تحقق لدى الناقل",
    noResults:"لا توجد رحلة مطابقة", noResultsHelp:"جرّب مساراً آخر أو أزل أحد المرشحات.",
    why:"لماذا هذه الرحلة؟", selectedJourney:"الرحلة المختارة", mapCredit:"الخريطة © OpenStreetMap",
    createAccount:"إنشاء حساب", send:"إرسال", language:"اللغة", currency:"العملة", results:"القائمة", map:"الخريطة",
  },
} as const;

type MessageKey = keyof typeof messages.fr;

type AppContextValue = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  t: (key: MessageKey) => string;
  formatPrice: (madPrice: number) => string;
  toMad: (value: number) => number;
};

const AppContext = createContext<AppContextValue | null>(null);

const rates: Record<Currency, number> = { MAD:1, EUR:0.092, USD:0.10 };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [currency, setCurrency] = useState<Currency>("MAD");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem("easyway-locale") as Locale | null;
    const savedCurrency = localStorage.getItem("easyway-currency") as Currency | null;
    if (savedLocale && ["fr","en","ar"].includes(savedLocale)) setLocale(savedLocale);
    if (savedCurrency && ["MAD","EUR","USD"].includes(savedCurrency)) setCurrency(savedCurrency);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("easyway-locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, initialized]);

  useEffect(() => {
    if (initialized) localStorage.setItem("easyway-currency", currency);
  }, [currency, initialized]);

  const value = useMemo<AppContextValue>(() => ({
    locale,
    currency,
    setLocale,
    setCurrency,
    t: (key) => messages[locale][key],
    toMad: (value) => value / rates[currency],
    formatPrice: (madPrice) => new Intl.NumberFormat(
      locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-MA",
      { style:"currency", currency, maximumFractionDigits:currency === "MAD" ? 0 : 2 }
    ).format(madPrice * rates[currency]),
  }), [locale, currency]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
