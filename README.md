# SIR Morocco

Prototype hackathon d’une plateforme multimodale marocaine. Il compare train,
autocar, avion et itinéraires combinés en incluant le temps d’attente réel.

## Prérequis

- Node.js LTS
- pnpm

Vérifier l’environnement :

```bash
node --version
pnpm --version
```

## Installation

Depuis le dossier `easyway-travel` :

```bash
pnpm install
```

## Développement

```bash
pnpm dev
```

Le serveur écoute sur toutes les interfaces réseau grâce à
`--hostname 0.0.0.0` :

- ordinateur : `http://localhost:3000`
- téléphone : `http://ADRESSE-IP-DU-PC:3000`

## Accès depuis un téléphone

1. Connecter le téléphone et l’ordinateur au même réseau Wi‑Fi.
2. Lancer `pnpm dev`.
3. Sous Windows, exécuter `ipconfig`.
4. Repérer l’« Adresse IPv4 » de la carte Wi‑Fi active.
5. Ouvrir `http://ADRESSE-IP:3000` dans le navigateur du téléphone.

Sur la machine utilisée lors de cette configuration, l’adresse active est :

```text
http://100.77.161.190:3000
```

Cette adresse peut changer après une reconnexion au Wi‑Fi. La configuration
`allowedDevOrigins` détecte automatiquement les adresses IPv4 locales au
démarrage. Si Windows affiche une demande de pare-feu, autoriser Node.js sur
les réseaux privés uniquement.

## Compilation de production

```bash
pnpm build
```

## Import des donnees de transport

Le site combine 38 trajets de demonstration avec 452 trajets indicatifs
importes depuis le jeu de donnees fourni (train, autocar et vols domestiques).
Pour regenerer les fichiers normalises :

```bash
pnpm import:data -- "CHEMIN_VERS_TRANSPORTATION_DATA" "CHEMIN_VERS_TRAVEL_KNOWLEDGE_BASE"
```

Les resultats sont ecrits dans `src/data/generated`. Ces horaires et tarifs
restent indicatifs : ils doivent etre verifies aupres des operateurs avant
tout achat.

La couche de simulation ajoute 688 options clairement marquees comme non
officielles : 350 autocars, 52 trains, 56 vols, 222 grands taxis et 8 trajets
combines. Elle se
concentre sur Casablanca, Fes, Agadir, Marrakech et Tanger, ainsi que sur les
liaisons regionales de moins de 250 km. Les hypotheses sont definies dans
`src/data/simulatedJourneys.ts`.

Les cartes de resultats utilisent Leaflet et OpenStreetMap. Les autocars et
grands taxis demandent un trace routier a OSRM ; si le service est indisponible,
le site affiche automatiquement un trace approximatif. Les trains utilisent
des points de passage schematiques et les vols un arc indicatif.

SirAI interroge cette base locale ainsi que les 30 documents de connaissances
de voyage via l'API interne `POST /api/ai`. Il classe les trajets selon la
demande et cite les sources locales utilisees.

## Démarrage de production

Exécuter d’abord `pnpm build`, puis :

```bash
pnpm start
```

Le serveur de production écoute également sur `0.0.0.0:3000`.

## Commandes Windows de secours

Si Node.js n’est pas exposé dans le `PATH` du terminal :

```bat
build-easyway.cmd
start-easyway.cmd
stop-easyway.cmd
```

## Démonstration

- Casablanca → Fès : l’autocar arrive avant le train malgré un temps à bord plus long.
- Casablanca → Marrakech tard le soir : trajet de nuit.
- Safi → Errachidia : itinéraire combiné.
- Paiement test : `4242 4242 4242 4242`, `12/30`, `123`.
- Assistant IA : fallback déterministe sans clé externe.
- Changement de langue : français, anglais et arabe (avec mise en page RTL).
- Changement de devise : MAD, EUR et USD avec taux fixes de démonstration.
- Compte utilisateur : inscription, connexion et profil conservés uniquement dans `localStorage`.

## Données et limites du prototype

L’inventaire local couvre plus de 30 villes et des trajets de démonstration
inspirés des réseaux publics d’ONCF, CTM, Supratours, Royal Air Maroc,
Air Arabia Maroc et Ryanair. Les durées et prix sont plausibles, mais ne
constituent jamais une offre commerciale en temps réel.

Les logos servent uniquement à identifier les opérateurs dans le prototype.
SIR n’est affilié à aucun transporteur. Les réservations, le paiement,
les places restantes, les conversions monétaires et les réponses SirAI
restent entièrement simulés.

## Branding

Les couleurs sont centralisées dans `src/styles/tokens.css`. Les chemins du
logo et le nom sont configurés dans `src/config/brand.ts`.

## Avertissement

Toutes les données, réservations et confirmations sont simulées. Aucun prix,
horaire ou billet n’est confirmé par ONCF, CTM ou Royal Air Maroc.
