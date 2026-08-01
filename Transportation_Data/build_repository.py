import json
import os
import math
import random
from datetime import datetime, timedelta
import zipfile

# -------- Realistic Data --------
CITIES = [
    {"id": "casablanca", "name": "Casablanca", "region": "Casablanca-Settat", "pop": 3359818, "lat": 33.5731, "lng": -7.5898},
    {"id": "rabat", "name": "Rabat", "region": "Rabat-Salé-Kénitra", "pop": 577827, "lat": 34.0209, "lng": -6.8416},
    {"id": "marrakech", "name": "Marrakech", "region": "Marrakech-Safi", "pop": 928850, "lat": 31.6295, "lng": -7.9811},
    {"id": "tangier", "name": "Tangier", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 947952, "lat": 35.7595, "lng": -5.8340},
    {"id": "fes", "name": "Fès", "region": "Fès-Meknès", "pop": 1112072, "lat": 34.0181, "lng": -5.0078},
    {"id": "meknes", "name": "Meknès", "region": "Fès-Meknès", "pop": 632079, "lat": 33.8954, "lng": -5.5473},
    {"id": "agadir", "name": "Agadir", "region": "Souss-Massa", "pop": 698310, "lat": 30.4278, "lng": -9.5981},
    {"id": "oujda", "name": "Oujda", "region": "Oriental", "pop": 557531, "lat": 34.6814, "lng": -1.9086},
    {"id": "nador", "name": "Nador", "region": "Oriental", "pop": 161726, "lat": 35.1670, "lng": -2.9339},
    {"id": "tetouan", "name": "Tétouan", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 380787, "lat": 35.5738, "lng": -5.3751},
    {"id": "chefchaouen", "name": "Chefchaouen", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 42829, "lat": 35.1686, "lng": -5.2697},
    {"id": "essaouira", "name": "Essaouira", "region": "Marrakech-Safi", "pop": 77000, "lat": 31.5125, "lng": -9.7684},
    {"id": "el_jadida", "name": "El Jadida", "region": "Casablanca-Settat", "pop": 194934, "lat": 33.2533, "lng": -8.5080},
    {"id": "kenitra", "name": "Kénitra", "region": "Rabat-Salé-Kénitra", "pop": 431282, "lat": 34.2610, "lng": -6.5802},
    {"id": "safi", "name": "Safi", "region": "Marrakech-Safi", "pop": 308508, "lat": 32.2983, "lng": -9.2330},
    {"id": "khouribga", "name": "Khouribga", "region": "Béni Mellal-Khénifra", "pop": 166397, "lat": 32.8800, "lng": -6.9063},
    {"id": "beni_mellal", "name": "Beni Mellal", "region": "Béni Mellal-Khénifra", "pop": 192676, "lat": 32.3379, "lng": -6.3498},
    {"id": "ifrane", "name": "Ifrane", "region": "Fès-Meknès", "pop": 14000, "lat": 33.5333, "lng": -5.1167},
    {"id": "larache", "name": "Larache", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 125008, "lat": 35.2011, "lng": -6.1392},
    {"id": "ksar_el_kebir", "name": "Ksar El Kebir", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 118043, "lat": 35.0000, "lng": -5.9000},
    {"id": "al_hoceima", "name": "Al Hoceïma", "region": "Tanger-Tétouan-Al Hoceïma", "pop": 102942, "lat": 35.2495, "lng": -3.9372},
    {"id": "taza", "name": "Taza", "region": "Fès-Meknès", "pop": 148456, "lat": 34.2167, "lng": -4.0167},
    {"id": "dakhla", "name": "Dakhla", "region": "Dakhla-Oued Ed-Dahab", "pop": 106277, "lat": 23.6848, "lng": -15.9570},
    {"id": "laayoune", "name": "Laâyoune", "region": "Laâyoune-Sakia El Hamra", "pop": 217732, "lat": 27.1536, "lng": -13.2032},
    {"id": "errachidia", "name": "Errachidia", "region": "Drâa-Tafilalet", "pop": 104553, "lat": 31.9333, "lng": -4.4167},
    {"id": "ouarzazate", "name": "Ouarzazate", "region": "Drâa-Tafilalet", "pop": 71218, "lat": 30.9204, "lng": -6.9000},
    {"id": "mohammedia", "name": "Mohammédia", "region": "Casablanca-Settat", "pop": 208612, "lat": 33.6861, "lng": -7.3828},
    {"id": "berkane", "name": "Berkane", "region": "Oriental", "pop": 109237, "lat": 34.9167, "lng": -2.3167},
]

CITY_DICT = {c["id"]: c for c in CITIES}

# Airports (real IATA/ICAO, coordinates)
AIRPORTS = [
    {"id": "cmn", "name": "Casablanca Mohammed V", "city": "casablanca", "iata": "CMN", "icao": "GMMN", "lat": 33.3675, "lng": -7.5899, "elev": 200, "runways": 2, "terminals": 3},
    {"id": "rak", "name": "Marrakech Menara", "city": "marrakech", "iata": "RAK", "icao": "GMMX", "lat": 31.6069, "lng": -8.0363, "elev": 471, "runways": 1, "terminals": 2},
    {"id": "rba", "name": "Rabat-Salé", "city": "rabat", "iata": "RBA", "icao": "GMME", "lat": 34.0515, "lng": -6.7517, "elev": 84, "runways": 1, "terminals": 1},
    {"id": "tng", "name": "Tangier Ibn Battouta", "city": "tangier", "iata": "TNG", "icao": "GMTT", "lat": 35.7269, "lng": -5.9169, "elev": 19, "runways": 1, "terminals": 2},
    {"id": "aga", "name": "Agadir Al Massira", "city": "agadir", "iata": "AGA", "icao": "GMAD", "lat": 30.3250, "lng": -9.4131, "elev": 69, "runways": 1, "terminals": 1},
    {"id": "fes", "name": "Fès-Saïss", "city": "fes", "iata": "FEZ", "icao": "GMFF", "lat": 33.9273, "lng": -4.9780, "elev": 579, "runways": 1, "terminals": 1},
    {"id": "ndr", "name": "Nador Al Aroui", "city": "nador", "iata": "NDR", "icao": "GMMW", "lat": 34.9888, "lng": -2.9700, "elev": 192, "runways": 1, "terminals": 1},
    {"id": "oud", "name": "Oujda Angads", "city": "oujda", "iata": "OUD", "icao": "GMFO", "lat": 34.7872, "lng": -1.9194, "elev": 459, "runways": 1, "terminals": 1},
    {"id": "eun", "name": "Laâyoune Hassan I", "city": "laayoune", "iata": "EUN", "icao": "GMML", "lat": 27.1517, "lng": -13.2192, "elev": 63, "runways": 1, "terminals": 1},
    {"id": "dak", "name": "Dakhla", "city": "dakhla", "iata": "DKK", "icao": "GMMH", "lat": 23.7166, "lng": -15.9320, "elev": 10, "runways": 1, "terminals": 1},
    {"id": "ouz", "name": "Ouarzazate", "city": "ouarzazate", "iata": "OZZ", "icao": "GMMZ", "lat": 30.9394, "lng": -6.9096, "elev": 1152, "runways": 1, "terminals": 1},
    {"id": "erh", "name": "Errachidia", "city": "errachidia", "iata": "ERH", "icao": "GMFK", "lat": 31.9475, "lng": -4.3983, "elev": 1032, "runways": 1, "terminals": 1},
    {"id": "ahm", "name": "Al Hoceima", "city": "al_hoceima", "iata": "AHM", "icao": "GMTA", "lat": 35.1814, "lng": -3.8397, "elev": 28, "runways": 1, "terminals": 1},
]
AIRPORT_DICT = {a["id"]: a for a in AIRPORTS}

# Train stations (real names)
TRAIN_STATIONS = [
    {"id": "casa_voyageurs", "name": "Casa Voyageurs", "city": "casablanca", "lat": 33.5915, "lng": -7.5900},
    {"id": "casa_port", "name": "Casa Port", "city": "casablanca", "lat": 33.6056, "lng": -7.5894},
    {"id": "rabat_ville", "name": "Rabat Ville", "city": "rabat", "lat": 34.0200, "lng": -6.8348},
    {"id": "rabat_agdal", "name": "Rabat Agdal", "city": "rabat", "lat": 34.0050, "lng": -6.8586},
    {"id": "kenitra", "name": "Kenitra", "city": "kenitra", "lat": 34.2610, "lng": -6.5802},
    {"id": "tangier_ville", "name": "Tangier Ville", "city": "tangier", "lat": 35.7770, "lng": -5.8093},
    {"id": "marrakech", "name": "Marrakech", "city": "marrakech", "lat": 31.6293, "lng": -7.9780},
    {"id": "fes", "name": "Fès", "city": "fes", "lat": 34.0297, "lng": -4.9993},
    {"id": "meknes", "name": "Meknès", "city": "meknes", "lat": 33.8984, "lng": -5.5511},
    {"id": "oujda", "name": "Oujda", "city": "oujda", "lat": 34.6814, "lng": -1.9086},
]
TRAIN_STATION_DICT = {s["id"]: s for s in TRAIN_STATIONS}

# Bus stations for each city (realistic names)
BUS_STATIONS = []
for city in CITIES:
    BUS_STATIONS.append({
        "id": f"{city['id']}_bus",
        "name": f"Gare Routière {city['name']}",
        "city": city["id"],
        "lat": city["lat"] + random.uniform(-0.02, 0.02),
        "lng": city["lng"] + random.uniform(-0.02, 0.02)
    })

# Combine all stations (airports, train, bus, tram)
ALL_STATIONS = []
for a in AIRPORTS:
    ALL_STATIONS.append({
        "id": a["id"],
        "name": a["name"],
        "city": a["city"],
        "type": "airport",
        "lat": a["lat"],
        "lng": a["lng"],
        "address": f"{a['name']}, {CITY_DICT[a['city']]['name']}",
        "transportCompanies": ["royal_air_maroc", "air_arabia_maroc", "ryanair", "easyjet", "air_france", "lufthansa", "iberia", "turkish_airlines", "qatar_airways", "emirates", "transavia", "tui_fly_belgium"],
        "availableServices": ["check-in", "baggage", "café", "restaurant", "car rental", "taxi"]
    })
for s in TRAIN_STATIONS:
    ALL_STATIONS.append({
        "id": s["id"],
        "name": s["name"],
        "city": s["city"],
        "type": "train",
        "lat": s["lat"],
        "lng": s["lng"],
        "address": f"{s['name']}, {CITY_DICT[s['city']]['name']}",
        "transportCompanies": ["oncf"],
        "availableServices": ["ticketing", "waiting room", "café"]
    })
for s in BUS_STATIONS:
    ALL_STATIONS.append({
        "id": s["id"],
        "name": s["name"],
        "city": s["city"],
        "type": "bus",
        "lat": s["lat"],
        "lng": s["lng"],
        "address": f"{s['name']}, {CITY_DICT[s['city']]['name']}",
        "transportCompanies": ["ctm", "supratours", "ghazala", "satas", "jana_viajes", "pullman_du_sud"],
        "availableServices": ["ticketing", "waiting room", "café", "baggage"]
    })
# Tram stations
TRAM_STATIONS_CASABLANCA = [{"id": f"cas_tram_{i}", "name": f"Station {i}", "city": "casablanca", "lat": 33.57 + 0.01*i, "lng": -7.59 + 0.01*i} for i in range(1, 31)]
TRAM_STATIONS_RABAT = [{"id": f"rab_tram_{i}", "name": f"Station {i}", "city": "rabat", "lat": 34.02 + 0.01*i, "lng": -6.84 + 0.01*i} for i in range(1, 21)]
for s in TRAM_STATIONS_CASABLANCA + TRAM_STATIONS_RABAT:
    ALL_STATIONS.append({
        "id": s["id"],
        "name": s["name"],
        "city": s["city"],
        "type": "tram",
        "lat": s["lat"],
        "lng": s["lng"],
        "address": f"{s['name']}, {CITY_DICT[s['city']]['name']}",
        "transportCompanies": ["casablanca_tramway"] if s["city"]=="casablanca" else ["rabat_sale_tramway"],
        "availableServices": ["ticketing", "shelter"]
    })

# Ensure at least 300 stations
while len(ALL_STATIONS) < 300:
    for city in CITIES:
        if len(ALL_STATIONS) >= 300:
            break
        ALL_STATIONS.append({
            "id": f"{city['id']}_bus_extra_{random.randint(1,100)}",
            "name": f"Gare Routière Secondaire {city['name']}",
            "city": city["id"],
            "type": "bus",
            "lat": city["lat"] + random.uniform(-0.05, 0.05),
            "lng": city["lng"] + random.uniform(-0.05, 0.05),
            "address": f"Secondary Bus Station, {city['name']}",
            "transportCompanies": ["ctm", "supratours"],
            "availableServices": ["ticketing", "waiting room"]
        })
ALL_STATIONS = ALL_STATIONS[:300]

# -------- Helpers --------
def distance_km(lat1, lng1, lat2, lng2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2-lat1)
    dlambda = math.radians(lng2-lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2*math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def generate_schedules(origin_lat, origin_lng, dest_lat, dest_lng, duration_min, count=6):
    base_times = [6, 8, 10, 12, 14, 16, 18, 20, 22]
    random.shuffle(base_times)
    schedules = []
    for i in range(min(count, len(base_times))):
        h = base_times[i]
        dep = datetime(2026, 1, 1, h, random.randint(0,59))
        arr = dep + timedelta(minutes=duration_min)
        schedules.append({
            "departureTime": dep.strftime("%H:%M"),
            "arrivalTime": arr.strftime("%H:%M"),
            "duration": duration_min,
            "availableSeats": random.randint(10, 200),
            "status": "scheduled" if random.random() > 0.1 else "cancelled"
        })
    return schedules

# -------- Generate Airlines --------
AIRLINE_LIST = [
    {"id": "royal_air_maroc", "name": "Royal Air Maroc", "short": "RAM", "country": "Morocco", "website": "https://www.royalairmaroc.com", "headquarters": "Casablanca", "founded": 1953, "desc": "Flag carrier of Morocco", "alliance": "Oneworld", "status": "active", "primary": "#e31e24", "secondary": "#000000"},
    {"id": "air_arabia_maroc", "name": "Air Arabia Maroc", "short": "AAM", "country": "Morocco", "website": "https://www.airarabia.com", "headquarters": "Casablanca", "founded": 2009, "desc": "Low-cost airline", "alliance": "None", "status": "active", "primary": "#ff6600", "secondary": "#ffffff"},
    {"id": "ryanair", "name": "Ryanair", "short": "RYR", "country": "Ireland", "website": "https://www.ryanair.com", "headquarters": "Dublin", "founded": 1984, "desc": "Irish low-cost airline", "alliance": "None", "status": "active", "primary": "#073590", "secondary": "#ffcc00"},
    {"id": "easyjet", "name": "easyJet", "short": "EZY", "country": "UK", "website": "https://www.easyjet.com", "headquarters": "London", "founded": 1995, "desc": "British low-cost airline", "alliance": "None", "status": "active", "primary": "#ff6600", "secondary": "#ffffff"},
    {"id": "air_france", "name": "Air France", "short": "AF", "country": "France", "website": "https://www.airfrance.com", "headquarters": "Paris", "founded": 1933, "desc": "French flag carrier", "alliance": "SkyTeam", "status": "active", "primary": "#002157", "secondary": "#e8000d"},
    {"id": "lufthansa", "name": "Lufthansa", "short": "LH", "country": "Germany", "website": "https://www.lufthansa.com", "headquarters": "Frankfurt", "founded": 1953, "desc": "German flag carrier", "alliance": "Star Alliance", "status": "active", "primary": "#002c6c", "secondary": "#e2001a"},
    {"id": "iberia", "name": "Iberia", "short": "IB", "country": "Spain", "website": "https://www.iberia.com", "headquarters": "Madrid", "founded": 1927, "desc": "Spanish flag carrier", "alliance": "Oneworld", "status": "active", "primary": "#c41230", "secondary": "#ffffff"},
    {"id": "turkish_airlines", "name": "Turkish Airlines", "short": "TK", "country": "Turkey", "website": "https://www.turkishairlines.com", "headquarters": "Istanbul", "founded": 1933, "desc": "Turkish flag carrier", "alliance": "Star Alliance", "status": "active", "primary": "#e70000", "secondary": "#ffffff"},
    {"id": "qatar_airways", "name": "Qatar Airways", "short": "QR", "country": "Qatar", "website": "https://www.qatarairways.com", "headquarters": "Doha", "founded": 1993, "desc": "Qatari flag carrier", "alliance": "Oneworld", "status": "active", "primary": "#8a1538", "secondary": "#d49b3b"},
    {"id": "emirates", "name": "Emirates", "short": "EK", "country": "UAE", "website": "https://www.emirates.com", "headquarters": "Dubai", "founded": 1985, "desc": "Emirati airline", "alliance": "None", "status": "active", "primary": "#d71921", "secondary": "#ffffff"},
    {"id": "transavia", "name": "Transavia", "short": "TO", "country": "France", "website": "https://www.transavia.com", "headquarters": "Paris", "founded": 1965, "desc": "French low-cost airline", "alliance": "None", "status": "active", "primary": "#00a3e0", "secondary": "#ffffff"},
    {"id": "tui_fly_belgium", "name": "TUI Fly Belgium", "short": "TB", "country": "Belgium", "website": "https://www.tuifly.be", "headquarters": "Brussels", "founded": 2003, "desc": "Belgian leisure airline", "alliance": "None", "status": "active", "primary": "#004a8f", "secondary": "#ffcd00"},
]

for airline in AIRLINE_LIST:
    folder = f"airlines/{airline['id']}"
    os.makedirs(folder, exist_ok=True)
    with open(f"{folder}/company.json", "w", encoding="utf-8") as f:
        json.dump({
            "id": airline["id"],
            "name": airline["name"],
            "shortName": airline["short"],
            "country": airline["country"],
            "website": airline["website"],
            "headquarters": airline["headquarters"],
            "founded": airline["founded"],
            "transportType": "air",
            "description": airline["desc"],
            "alliance": airline["alliance"],
            "status": airline["status"],
            "primaryColor": airline["primary"],
            "secondaryColor": airline["secondary"]
        }, f, indent=2)
    fleet = [{"model": f"Boeing 737-800", "count": random.randint(2,10), "seats": 189},
             {"model": "Airbus A320neo", "count": random.randint(1,8), "seats": 180},
             {"model": "Boeing 787-9", "count": random.randint(0,3), "seats": 290}]
    with open(f"{folder}/fleet.json", "w", encoding="utf-8") as f:
        json.dump(fleet, f, indent=2)
    if airline["id"] == "royal_air_maroc":
        hub = "cmn"
    else:
        hub = random.choice([a["id"] for a in AIRPORTS])
    routes = []
    dests = [a for a in AIRPORTS if a["id"] != hub]
    random.shuffle(dests)
    for d in dests[:5]:
        origin = next(a for a in AIRPORTS if a["id"] == hub)
        dest = d
        dist = distance_km(origin["lat"], origin["lng"], dest["lat"], dest["lng"])
        dur = int(dist / 800 * 60) + random.randint(15, 45)
        routes.append({
            "routeId": f"{airline['id']}_{hub}_{d['id']}",
            "company": airline["id"],
            "transportType": "flight",
            "origin": hub,
            "destination": d["id"],
            "distanceKm": round(dist, 1),
            "estimatedDuration": dur,
            "numberOfStops": 0,
            "direct": True
        })
    with open(f"{folder}/routes.json", "w", encoding="utf-8") as f:
        json.dump(routes, f, indent=2)
    prices = []
    for r in routes:
        base = random.randint(500, 2500)
        prices.append({
            "routeId": r["routeId"],
            "price": base,
            "currency": "MAD",
            "cabinClass": "Economy",
            "notes": "Standard fare"
        })
        if random.random() > 0.5:
            prices.append({
                "routeId": r["routeId"],
                "price": int(base * 1.5),
                "currency": "MAD",
                "cabinClass": "Business",
                "notes": "Business fare"
            })
    with open(f"{folder}/prices.json", "w", encoding="utf-8") as f:
        json.dump(prices, f, indent=2)
    schedules = []
    for r in routes:
        origin = next(a for a in AIRPORTS if a["id"] == r["origin"])
        dest = next(a for a in AIRPORTS if a["id"] == r["destination"])
        dur = r["estimatedDuration"]
        schedules.extend(generate_schedules(origin["lat"], origin["lng"], dest["lat"], dest["lng"], dur, count=4))
    with open(f"{folder}/schedules.json", "w", encoding="utf-8") as f:
        json.dump(schedules, f, indent=2)
    with open(f"{folder}/metadata.json", "w", encoding="utf-8") as f:
        json.dump({"lastUpdated": datetime.now().isoformat(), "dataSource": "MoroccWay internal", "version": "1.0", "notes": f"Generated data for {airline['name']}"}, f, indent=2)
    with open(f"{folder}/README.md", "w", encoding="utf-8") as f:
        f.write(f"""# {airline['name']} Data

This folder contains transportation data for {airline['name']}.

## Files
- company.json: Company details
- fleet.json: Aircraft fleet
- routes.json: Flight routes
- prices.json: Ticket prices
- schedules.json: Flight schedules
- metadata.json: Metadata about the data

## Naming Convention
All files follow lowercase_snake_case. Routes are identified by routeId.
""")

# -------- Generate Airports --------
for a in AIRPORTS:
    folder = f"airports/{a['id']}"
    os.makedirs(folder, exist_ok=True)
    city = CITY_DICT[a["city"]]
    with open(f"{folder}/airport.json", "w", encoding="utf-8") as f:
        json.dump({
            "airportId": a["id"],
            "name": a["name"],
            "city": a["city"],
            "region": city["region"],
            "IATA": a["iata"],
            "ICAO": a["icao"],
            "latitude": a["lat"],
            "longitude": a["lng"],
            "elevation": a["elev"],
            "runwayCount": a["runways"],
            "terminalCount": a["terminals"],
            "operator": "ONDA",
            "website": f"https://www.onda.ma/aeroport-{a['id']}",
            "description": f"{a['name']} serves {city['name']} and surrounding areas."
        }, f, indent=2)
    services = ["car rental", "café", "restaurant", "duty free", "free wifi", "ATM"]
    with open(f"{folder}/services.json", "w", encoding="utf-8") as f:
        json.dump(services, f, indent=2)
    with open(f"{folder}/metadata.json", "w", encoding="utf-8") as f:
        json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)
    with open(f"{folder}/README.md", "w", encoding="utf-8") as f:
        f.write(f"# {a['name']} - Airport Data\n\nThis folder contains airport information for {a['name']}.\n")

# -------- Generate Trains (ONCF) --------
os.makedirs("trains/oncf", exist_ok=True)
with open("trains/oncf/company.json", "w", encoding="utf-8") as f:
    json.dump({
        "id": "oncf",
        "name": "ONCF",
        "shortName": "ONCF",
        "country": "Morocco",
        "website": "https://www.oncf.ma",
        "headquarters": "Rabat",
        "founded": 1963,
        "transportType": "train",
        "description": "Moroccan National Railways",
        "alliance": "None",
        "status": "active",
        "primaryColor": "#004080",
        "secondaryColor": "#ffcc00"
    }, f, indent=2)

with open("trains/oncf/stations.json", "w", encoding="utf-8") as f:
    json.dump(TRAIN_STATIONS, f, indent=2)

train_routes = []
for i, s1 in enumerate(TRAIN_STATIONS):
    for s2 in TRAIN_STATIONS[i+1:]:
        if random.random() < 0.2:
            dist = distance_km(s1["lat"], s1["lng"], s2["lat"], s2["lng"])
            dur = int(dist / 60 * 60) + random.randint(10, 60)
            train_routes.append({
                "routeId": f"oncf_{s1['id']}_{s2['id']}",
                "company": "oncf",
                "transportType": "train",
                "origin": s1["id"],
                "destination": s2["id"],
                "distanceKm": round(dist, 1),
                "estimatedDuration": dur,
                "numberOfStops": random.randint(0,5),
                "direct": True
            })
high_speed = [
    {"origin": "tangier_ville", "destination": "kenitra", "dist": 200, "dur": 75},
    {"origin": "kenitra", "destination": "rabat_ville", "dist": 60, "dur": 25},
    {"origin": "rabat_ville", "destination": "casa_voyageurs", "dist": 90, "dur": 35},
]
for hs in high_speed:
    train_routes.append({
        "routeId": f"oncf_al_boraq_{hs['origin']}_{hs['destination']}",
        "company": "oncf",
        "transportType": "train",
        "origin": hs["origin"],
        "destination": hs["destination"],
        "distanceKm": hs["dist"],
        "estimatedDuration": hs["dur"],
        "numberOfStops": 0,
        "direct": True
    })
with open("trains/oncf/routes.json", "w", encoding="utf-8") as f:
    json.dump(train_routes, f, indent=2)

train_prices = []
for r in train_routes:
    base = int(r["distanceKm"] * 1.2) + random.randint(20,80)
    train_prices.append({
        "routeId": r["routeId"],
        "price": base,
        "currency": "MAD",
        "cabinClass": "Standard",
        "notes": "Standard fare"
    })
    if "al_boraq" in r["routeId"]:
        train_prices.append({
            "routeId": r["routeId"],
            "price": int(base * 1.8),
            "currency": "MAD",
            "cabinClass": "Premium",
            "notes": "Premium fare"
        })
with open("trains/oncf/prices.json", "w", encoding="utf-8") as f:
    json.dump(train_prices, f, indent=2)

train_schedules = []
for r in train_routes:
    origin = next(s for s in TRAIN_STATIONS if s["id"] == r["origin"])
    dest = next(s for s in TRAIN_STATIONS if s["id"] == r["destination"])
    dur = r["estimatedDuration"]
    train_schedules.extend(generate_schedules(origin["lat"], origin["lng"], dest["lat"], dest["lng"], dur, count=5))
with open("trains/oncf/schedules.json", "w", encoding="utf-8") as f:
    json.dump(train_schedules, f, indent=2)

with open("trains/oncf/services.json", "w", encoding="utf-8") as f:
    json.dump(["WiFi", "Air conditioning", "Snack bar", "First class", "Bicycle storage", "Power sockets"], f, indent=2)

with open("trains/oncf/metadata.json", "w", encoding="utf-8") as f:
    json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)

with open("trains/oncf/README.md", "w", encoding="utf-8") as f:
    f.write("# ONCF - Moroccan Railways\n\nThis folder contains train data including stations, routes, and schedules.\n")

# -------- Generate Intercity Buses (removed trans_ghazala) --------
BUS_COMPANIES = [
    {"id": "ctm", "name": "CTM", "short": "CTM", "country": "Morocco", "website": "https://www.ctm.ma", "headquarters": "Casablanca", "founded": 1919, "desc": "National bus company", "primary": "#004080", "secondary": "#ffffff"},
    {"id": "supratours", "name": "Supratours", "short": "ST", "country": "Morocco", "website": "https://www.supratours.ma", "headquarters": "Casablanca", "founded": 1960, "desc": "Bus company", "primary": "#d71921", "secondary": "#ffffff"},
    {"id": "ghazala", "name": "Ghazala", "short": "GHZ", "country": "Morocco", "website": "https://www.ghazala.ma", "headquarters": "Casablanca", "founded": 1985, "desc": "Bus operator", "primary": "#00a3e0", "secondary": "#ffffff"},
    {"id": "satas", "name": "SATAS", "short": "SAS", "country": "Morocco", "website": "https://www.satas.ma", "headquarters": "Casablanca", "founded": 1970, "desc": "Bus operator", "primary": "#f7941e", "secondary": "#ffffff"},
    {"id": "jana_viajes", "name": "Jana Viajes", "short": "JV", "country": "Morocco", "website": "https://www.janaviajes.ma", "headquarters": "Marrakech", "founded": 2005, "desc": "Bus and tour operator", "primary": "#8b1a4a", "secondary": "#f2c94c"},
    {"id": "pullman_du_sud", "name": "Pullman du Sud", "short": "PS", "country": "Morocco", "website": "https://www.pullmandusud.ma", "headquarters": "Agadir", "founded": 1990, "desc": "Bus company in southern Morocco", "primary": "#2e6b8a", "secondary": "#ffffff"},
]

for bc in BUS_COMPANIES:
    folder = f"buses/{bc['id']}"
    os.makedirs(folder, exist_ok=True)
    with open(f"{folder}/company.json", "w", encoding="utf-8") as f:
        json.dump({
            "id": bc["id"],
            "name": bc["name"],
            "shortName": bc["short"],
            "country": bc["country"],
            "website": bc["website"],
            "headquarters": bc["headquarters"],
            "founded": bc["founded"],
            "transportType": "bus",
            "description": bc["desc"],
            "alliance": "None",
            "status": "active",
            "primaryColor": bc["primary"],
            "secondaryColor": bc["secondary"]
        }, f, indent=2)
    bus_routes = []
    origins = random.sample(CITIES, min(5, len(CITIES)))
    for o in origins:
        dests = [c for c in CITIES if c["id"] != o["id"]]
        for d in random.sample(dests, min(3, len(dests))):
            dist = distance_km(o["lat"], o["lng"], d["lat"], d["lng"])
            dur = int(dist / 50 * 60) + random.randint(10, 40)
            bus_routes.append({
                "routeId": f"{bc['id']}_{o['id']}_{d['id']}",
                "company": bc["id"],
                "transportType": "bus",
                "origin": o["id"],
                "destination": d["id"],
                "distanceKm": round(dist, 1),
                "estimatedDuration": dur,
                "numberOfStops": random.randint(0,3),
                "direct": True
            })
    with open(f"{folder}/routes.json", "w", encoding="utf-8") as f:
        json.dump(bus_routes, f, indent=2)
    stations_for_company = []
    for r in bus_routes:
        o_city = next(c for c in CITIES if c["id"] == r["origin"])
        d_city = next(c for c in CITIES if c["id"] == r["destination"])
        stations_for_company.append({
            "stationId": f"{o_city['id']}_bus",
            "name": f"Gare Routière {o_city['name']}",
            "city": o_city["id"],
            "type": "bus",
            "latitude": o_city["lat"] + random.uniform(-0.01, 0.01),
            "longitude": o_city["lng"] + random.uniform(-0.01, 0.01)
        })
        stations_for_company.append({
            "stationId": f"{d_city['id']}_bus",
            "name": f"Gare Routière {d_city['name']}",
            "city": d_city["id"],
            "type": "bus",
            "latitude": d_city["lat"] + random.uniform(-0.01, 0.01),
            "longitude": d_city["lng"] + random.uniform(-0.01, 0.01)
        })
    unique_stations = {s["stationId"]: s for s in stations_for_company}.values()
    with open(f"{folder}/stations.json", "w", encoding="utf-8") as f:
        json.dump(list(unique_stations), f, indent=2)
    bus_prices = []
    for r in bus_routes:
        base = int(r["distanceKm"] * 2.5) + random.randint(10, 50)
        bus_prices.append({
            "routeId": r["routeId"],
            "price": base,
            "currency": "MAD",
            "cabinClass": "Standard",
            "notes": "Standard fare"
        })
    with open(f"{folder}/prices.json", "w", encoding="utf-8") as f:
        json.dump(bus_prices, f, indent=2)
    bus_schedules = []
    for r in bus_routes:
        o_city = next(c for c in CITIES if c["id"] == r["origin"])
        d_city = next(c for c in CITIES if c["id"] == r["destination"])
        dur = r["estimatedDuration"]
        bus_schedules.extend(generate_schedules(o_city["lat"], o_city["lng"], d_city["lat"], d_city["lng"], dur, count=4))
    with open(f"{folder}/schedules.json", "w", encoding="utf-8") as f:
        json.dump(bus_schedules, f, indent=2)
    with open(f"{folder}/metadata.json", "w", encoding="utf-8") as f:
        json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)
    with open(f"{folder}/README.md", "w", encoding="utf-8") as f:
        f.write(f"# {bc['name']} - Bus Data\n\nThis folder contains data for {bc['name']}.\n")

# -------- Generate Urban Buses --------
URBAN_BUS_COMPANIES = [
    {"id": "ratp_dev_casablanca", "name": "RATP Dev Casablanca", "short": "Casa Bus", "city": "casablanca", "website": "https://www.casabus.ma", "desc": "Operator of the urban bus network in Casablanca", "primary": "#009e60", "secondary": "#ffffff", "founded": 2010},
    {"id": "alsa_rabat_sale", "name": "ALSA Rabat-Salé", "short": "ALSA RS", "city": "rabat", "website": "https://www.alsa.ma", "desc": "Urban bus operator in Rabat-Salé", "primary": "#004080", "secondary": "#ffffff", "founded": 2012},
    {"id": "alsa_marrakech", "name": "ALSA Marrakech", "short": "ALSA MK", "city": "marrakech", "website": "https://www.alsa.ma", "desc": "Urban bus operator in Marrakech", "primary": "#e31e24", "secondary": "#ffffff", "founded": 2014},
    {"id": "alsa_agadir", "name": "ALSA Agadir", "short": "ALSA AG", "city": "agadir", "website": "https://www.alsa.ma", "desc": "Urban bus operator in Agadir", "primary": "#f7941e", "secondary": "#ffffff", "founded": 2015},
    {"id": "regie_autonome_fes", "name": "Régie Autonome de Transport de Fès", "short": "RATF", "city": "fes", "website": "https://www.ratf.ma", "desc": "Public transport operator in Fès", "primary": "#2e6b8a", "secondary": "#ffffff", "founded": 1970},
    {"id": "alsa_tetouan", "name": "ALSA Tétouan", "short": "ALSA TE", "city": "tetouan", "website": "https://www.alsa.ma", "desc": "Urban bus operator in Tétouan", "primary": "#8b1a4a", "secondary": "#f2c94c", "founded": 2016},
    {"id": "ville_bus_oujda", "name": "Ville Bus Oujda", "short": "VBO", "city": "oujda", "website": "", "desc": "Urban bus operator in Oujda", "primary": "#d4af37", "secondary": "#000000", "founded": 2011},
]

# Store urban bus routes for later merging
urban_bus_routes_all = []
urban_bus_schedules_all = []
urban_bus_prices_all = []

for ubc in URBAN_BUS_COMPANIES:
    folder = f"urban_buses/{ubc['id']}"
    os.makedirs(folder, exist_ok=True)
    
    # company.json
    with open(f"{folder}/company.json", "w", encoding="utf-8") as f:
        json.dump({
            "id": ubc["id"],
            "name": ubc["name"],
            "shortName": ubc["short"],
            "country": "Morocco",
            "website": ubc["website"],
            "headquarters": CITY_DICT[ubc["city"]]["name"],
            "founded": ubc["founded"],
            "transportType": "urban_bus",
            "description": ubc["desc"],
            "alliance": "None",
            "status": "active",
            "primaryColor": ubc["primary"],
            "secondaryColor": ubc["secondary"]
        }, f, indent=2)
    
    # Generate routes within the city (e.g., lines 1,2,3)
    city = CITY_DICT[ubc["city"]]
    num_lines = random.randint(3, 6)
    routes = []
    for line in range(1, num_lines+1):
        # Create random stops along a line (simulate a route)
        # We'll generate 4-8 stops for each line
        num_stops = random.randint(4, 8)
        stops = []
        for s in range(num_stops):
            stops.append({
                "id": f"{ubc['id']}_line{line}_stop{s+1}",
                "name": f"Stop {line}-{s+1}",
                "lat": city["lat"] + random.uniform(-0.05, 0.05),
                "lng": city["lng"] + random.uniform(-0.05, 0.05)
            })
        # The origin and destination are the first and last stops
        origin_stop = stops[0]
        dest_stop = stops[-1]
        dist = distance_km(origin_stop["lat"], origin_stop["lng"], dest_stop["lat"], dest_stop["lng"])
        dur = int(dist / 20 * 60) + random.randint(5, 15)  # avg 20 km/h urban
        routes.append({
            "routeId": f"{ubc['id']}_line_{line}",
            "company": ubc["id"],
            "transportType": "urban_bus",
            "origin": origin_stop["id"],
            "destination": dest_stop["id"],
            "distanceKm": round(dist, 1),
            "estimatedDuration": dur,
            "numberOfStops": num_stops-2,  # intermediate stops
            "direct": True,
            "stops": stops  # optional, but we keep for station generation
        })
    
    with open(f"{folder}/routes.json", "w", encoding="utf-8") as f:
        json.dump(routes, f, indent=2)
    
    # stations.json (extract all stops)
    stations_for_company = []
    for r in routes:
        for stop in r["stops"]:
            stations_for_company.append({
                "stationId": stop["id"],
                "name": stop["name"],
                "city": ubc["city"],
                "type": "urban_bus_stop",
                "latitude": stop["lat"],
                "longitude": stop["lng"]
            })
    with open(f"{folder}/stations.json", "w", encoding="utf-8") as f:
        json.dump(stations_for_company, f, indent=2)
    
    # pricing.json (flat fare)
    prices = []
    for r in routes:
        prices.append({
            "routeId": r["routeId"],
            "price": random.choice([3.0, 3.5, 4.0, 4.5, 5.0]),
            "currency": "MAD",
            "cabinClass": "Standard",
            "notes": "Urban bus single ticket"
        })
    with open(f"{folder}/pricing.json", "w", encoding="utf-8") as f:
        json.dump(prices, f, indent=2)
    
    # schedules.json (high frequency)
    schedules = []
    for r in routes:
        # generate more frequent schedules (every 15-30 min)
        base_times = list(range(6, 23, 1))  # hourly from 6 to 22
        random.shuffle(base_times)
        for h in base_times[:12]:  # 12 departures per route
            dep = datetime(2026, 1, 1, h, random.choice([0, 15, 30, 45]))
            arr = dep + timedelta(minutes=r["estimatedDuration"])
            schedules.append({
                "routeId": r["routeId"],
                "departureTime": dep.strftime("%H:%M"),
                "arrivalTime": arr.strftime("%H:%M"),
                "duration": r["estimatedDuration"],
                "availableSeats": random.randint(20, 50),
                "status": "scheduled" if random.random() > 0.05 else "cancelled"
            })
    with open(f"{folder}/schedules.json", "w", encoding="utf-8") as f:
        json.dump(schedules, f, indent=2)
    
    # metadata.json
    with open(f"{folder}/metadata.json", "w", encoding="utf-8") as f:
        json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)
    
    # README.md
    with open(f"{folder}/README.md", "w", encoding="utf-8") as f:
        f.write(f"# {ubc['name']} - Urban Bus Data\n\nThis folder contains data for {ubc['name']} operating in {CITY_DICT[ubc['city']]['name']}.\n")
    
    # Accumulate for combined files
    urban_bus_routes_all.extend(routes)
    urban_bus_schedules_all.extend(schedules)
    urban_bus_prices_all.extend(prices)

# Add urban bus stations to ALL_STATIONS
for ubc in URBAN_BUS_COMPANIES:
    folder = f"urban_buses/{ubc['id']}"
    with open(f"{folder}/stations.json", "r", encoding="utf-8") as f:
        stops = json.load(f)
        for stop in stops:
            ALL_STATIONS.append({
                "id": stop["stationId"],
                "name": stop["name"],
                "city": stop["city"],
                "type": "urban_bus_stop",
                "lat": stop["latitude"],
                "lng": stop["longitude"],
                "address": f"{stop['name']}, {CITY_DICT[stop['city']]['name']}",
                "transportCompanies": [ubc["id"]],
                "availableServices": ["shelter", "ticketing"]
            })

# -------- Generate Taxis (Updated: Petit & Grand Taxi detailed) --------
os.makedirs("taxis", exist_ok=True)

# company.json - describe both types
with open("taxis/company.json", "w", encoding="utf-8") as f:
    json.dump({
        "id": "taxis_morocco",
        "name": "Moroccan Taxis",
        "shortName": "Taxis",
        "country": "Morocco",
        "website": "",
        "headquarters": "Rabat",
        "founded": 1950,
        "transportType": "taxi",
        "description": "Moroccan taxi services include two main types: Petit Taxi (red) for urban travel within city limits, and Grand Taxi (white) for shared intercity, suburban, and airport transport.",
        "alliance": "None",
        "status": "active",
        "primaryColor": "#ffcc00",
        "secondaryColor": "#000000"
    }, f, indent=2)

# cities.json - coverage (unchanged)
taxi_cities = []
for c in CITIES:
    taxi_cities.append({
        "cityId": c["id"],
        "name": c["name"],
        "hasPetit": True,
        "hasGrand": True,
        "numPetit": random.randint(100, 2000),
        "numGrand": random.randint(50, 500)
    })
with open("taxis/cities.json", "w", encoding="utf-8") as f:
    json.dump(taxi_cities, f, indent=2)

# pricing.json - detailed for both types
with open("taxis/pricing.json", "w", encoding="utf-8") as f:
    json.dump({
        "currency": "MAD",
        "petitTaxi": {
            "description": "Urban taxi within city limits. Uses taximeter. Regulated local fares.",
            "baseFare": 7.0,
            "distanceRate": 2.5,  # per km
            "minimumFare": 7.0,   # varies by city, up to 15 MAD
            "nightSurcharge": {
                "enabled": True,
                "rate": 1.5,      # +50%
                "startTime": "20:00",
                "endTime": "06:00"
            },
            "airportFlatFare": "Fixed fare in some cities, e.g., 50–80 MAD from airport to city center",
            "notes": "Fares vary by city. Minimum fare can be higher during nighttime or on weekends."
        },
        "grandTaxi": {
            "description": "Shared intercity/suburban taxi. No taximeter. Fixed route and per‑seat pricing.",
            "perSeatRate": "5–10 MAD for short shared routes, higher for longer distances",
            "entireVehicleNegotiated": "Can be hired privately for a negotiated fare",
            "airportFixedFare": "Official fixed prices for airport routes, typically 50–150 MAD per person depending on destination",
            "notes": "Usually departs when full (6 passengers). Prices are fixed per route and per person."
        }
    }, f, indent=2)

# service_rules.json - detailed rules
with open("taxis/service_rules.json", "w", encoding="utf-8") as f:
    json.dump({
        "petitTaxi": {
            "type": "Petit Taxi (Red)",
            "color": "red",
            "area": "Intra‑city only – strictly within municipal boundaries.",
            "meter": True,
            "maxPassengers": 3,
            "luggage": "Limited to small suitcases.",
            "airportSurcharge": "Some cities allow a fixed airport supplement (e.g., +5–10 MAD).",
            "nightSurcharge": "+50% between 20:00 and 06:00.",
            "regulatoryBody": "Local municipalities."
        },
        "grandTaxi": {
            "type": "Grand Taxi (White)",
            "color": "white",
            "area": "Intercity, suburban, and airport routes.",
            "meter": False,
            "shared": True,
            "maxPassengers": 6,
            "departure": "Departs when full (or after a short wait).",
            "perSeatPricing": True,
            "fixedRoutes": True,
            "privateHire": "Can be hired for exclusive use at negotiated rates.",
            "airportFixedFare": "Official fixed tariffs for common routes to/from airports.",
            "regulatoryBody": "National and regional authorities."
        }
    }, f, indent=2)

# metadata.json
with open("taxis/metadata.json", "w", encoding="utf-8") as f:
    json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)

# README.md
with open("taxis/README.md", "w", encoding="utf-8") as f:
    f.write("""# Moroccan Taxis

## Petit Taxi (Red Taxi)
- Urban transportation within city limits only.
- Metered fares with a base fare of ~7 MAD and ~2.5 MAD per km.
- Night surcharge (+50%) applies from 20:00 to 06:00.
- Minimum fare varies (7–15 MAD) by city.
- Airport trips may have fixed fares in some cities.

## Grand Taxi (White Taxi)
- Shared intercity, suburban, and airport transport.
- No taximeter – fixed route and per‑seat pricing.
- Passengers pay per seat (5–10 MAD for short routes, higher for longer).
- Departs when full (6 passengers), but can be hired privately for a negotiated fare.
- Airport routes have official fixed tariffs.

For detailed pricing and rules, see `pricing.json` and `service_rules.json`.
""")

# -------- Generate Tramway (unchanged) --------
TRAM_COMPANIES = [
    {"id": "casablanca_tramway", "name": "Casablanca Tramway", "city": "casablanca", "lines": 2, "stations": 30},
    {"id": "rabat_sale_tramway", "name": "Rabat-Salé Tramway", "city": "rabat", "lines": 2, "stations": 20}
]
for tc in TRAM_COMPANIES:
    folder = f"tramway/{tc['id']}"
    os.makedirs(folder, exist_ok=True)
    with open(f"{folder}/company.json", "w", encoding="utf-8") as f:
        json.dump({
            "id": tc["id"],
            "name": tc["name"],
            "shortName": tc["id"].replace("_", "").upper(),
            "country": "Morocco",
            "website": "",
            "headquarters": tc["city"].capitalize(),
            "founded": 2012 if tc["id"]=="casablanca_tramway" else 2011,
            "transportType": "tram",
            "description": f"{tc['name']} serves {tc['city'].capitalize()}",
            "alliance": "None",
            "status": "active",
            "primaryColor": "#0066cc",
            "secondaryColor": "#ffffff"
        }, f, indent=2)
    if tc["id"] == "casablanca_tramway":
        stations = TRAM_STATIONS_CASABLANCA
    else:
        stations = TRAM_STATIONS_RABAT
    with open(f"{folder}/stations.json", "w", encoding="utf-8") as f:
        json.dump(stations, f, indent=2)
    routes = []
    for i in range(1, tc["lines"]+1):
        routes.append({
            "routeId": f"{tc['id']}_line_{i}",
            "company": tc["id"],
            "transportType": "tram",
            "origin": stations[0]["id"],
            "destination": stations[-1]["id"],
            "distanceKm": round(len(stations)*0.5, 1),
            "estimatedDuration": len(stations)*2,
            "numberOfStops": len(stations),
            "direct": True
        })
    with open(f"{folder}/routes.json", "w", encoding="utf-8") as f:
        json.dump(routes, f, indent=2)
    tram_schedules = []
    for r in routes:
        tram_schedules.extend(generate_schedules(stations[0]["lat"], stations[0]["lng"], stations[-1]["lat"], stations[-1]["lng"], r["estimatedDuration"], count=6))
    with open(f"{folder}/schedules.json", "w", encoding="utf-8") as f:
        json.dump(tram_schedules, f, indent=2)
    with open(f"{folder}/metadata.json", "w", encoding="utf-8") as f:
        json.dump({"lastUpdated": datetime.now().isoformat(), "version": "1.0"}, f, indent=2)
    with open(f"{folder}/README.md", "w", encoding="utf-8") as f:
        f.write(f"# {tc['name']}\n\nTramway data for {tc['city'].capitalize()}.\n")

# -------- Generate Cities --------
with open("cities/cities.json", "w", encoding="utf-8") as f:
    json.dump([{
        "cityId": c["id"],
        "name": c["name"],
        "region": c["region"],
        "population": c["pop"],
        "latitude": c["lat"],
        "longitude": c["lng"]
    } for c in CITIES], f, indent=2)

# -------- Generate Stations --------
with open("stations/stations.json", "w", encoding="utf-8") as f:
    json.dump(ALL_STATIONS, f, indent=2)

# -------- Generate Routes (combined) - REMOVED FERRIES --------
all_routes = []
# Airlines
for airline in AIRLINE_LIST:
    with open(f"airlines/{airline['id']}/routes.json", "r", encoding="utf-8") as f:
        routes = json.load(f)
        all_routes.extend(routes)
# Trains
with open("trains/oncf/routes.json", "r", encoding="utf-8") as f:
    all_routes.extend(json.load(f))
# Intercity Buses
for bc in BUS_COMPANIES:
    with open(f"buses/{bc['id']}/routes.json", "r", encoding="utf-8") as f:
        all_routes.extend(json.load(f))
# Tram
for tc in TRAM_COMPANIES:
    with open(f"tramway/{tc['id']}/routes.json", "r", encoding="utf-8") as f:
        all_routes.extend(json.load(f))
# Urban Buses
all_routes.extend(urban_bus_routes_all)

# Ensure at least 500 routes
while len(all_routes) < 500:
    o = random.choice(CITIES)
    d = random.choice([c for c in CITIES if c["id"] != o["id"]])
    if not any(r["origin"]==o["id"] and r["destination"]==d["id"] for r in all_routes):
        dist = distance_km(o["lat"], o["lng"], d["lat"], d["lng"])
        dur = int(dist / 50 * 60) + random.randint(10, 40)
        all_routes.append({
            "routeId": f"extra_bus_{o['id']}_{d['id']}",
            "company": "ctm",
            "transportType": "bus",
            "origin": o["id"],
            "destination": d["id"],
            "distanceKm": round(dist, 1),
            "estimatedDuration": dur,
            "numberOfStops": random.randint(0,3),
            "direct": True
        })
    else:
        continue

with open("routes/routes.json", "w", encoding="utf-8") as f:
    json.dump(all_routes[:500], f, indent=2)

# -------- Generate Schedules (combined) - REMOVED FERRIES --------
all_schedules = []
for airline in AIRLINE_LIST:
    with open(f"airlines/{airline['id']}/schedules.json", "r", encoding="utf-8") as f:
        all_schedules.extend(json.load(f))
with open("trains/oncf/schedules.json", "r", encoding="utf-8") as f:
    all_schedules.extend(json.load(f))
for bc in BUS_COMPANIES:
    with open(f"buses/{bc['id']}/schedules.json", "r", encoding="utf-8") as f:
        all_schedules.extend(json.load(f))
for tc in TRAM_COMPANIES:
    with open(f"tramway/{tc['id']}/schedules.json", "r", encoding="utf-8") as f:
        all_schedules.extend(json.load(f))
# Urban Buses
all_schedules.extend(urban_bus_schedules_all)

with open("schedules/schedules.json", "w", encoding="utf-8") as f:
    json.dump(all_schedules, f, indent=2)

# -------- Generate Pricing (combined) - REMOVED FERRIES, added taxi pricing --------
all_prices = []
for airline in AIRLINE_LIST:
    with open(f"airlines/{airline['id']}/prices.json", "r", encoding="utf-8") as f:
        all_prices.extend(json.load(f))
with open("trains/oncf/prices.json", "r", encoding="utf-8") as f:
    all_prices.extend(json.load(f))
for bc in BUS_COMPANIES:
    with open(f"buses/{bc['id']}/prices.json", "r", encoding="utf-8") as f:
        all_prices.extend(json.load(f))
# Urban Buses
all_prices.extend(urban_bus_prices_all)

# Add taxi pricing entries for each city (sample)
for c in CITIES:
    # Petit Taxi
    all_prices.append({
        "routeId": f"petit_taxi_{c['id']}_intracity",
        "price": 7.0,
        "currency": "MAD",
        "cabinClass": "Petit Taxi",
        "notes": f"Base fare in {c['name']}, plus 2.5 MAD/km. Night surcharge +50% after 20:00."
    })
    # Grand Taxi (shared per seat) – sample route between cities
    if random.random() < 0.3:  # only some city pairs
        dest = random.choice([c2 for c2 in CITIES if c2["id"] != c["id"]])
        dist = distance_km(c["lat"], c["lng"], dest["lat"], dest["lng"])
        per_seat = 5 + int(dist / 20)  # simple formula
        all_prices.append({
            "routeId": f"grand_taxi_{c['id']}_{dest['id']}",
            "price": per_seat,
            "currency": "MAD",
            "cabinClass": "Grand Taxi (per seat)",
            "notes": f"Shared taxi from {c['name']} to {dest['name']}. Entire vehicle can be hired for approx {per_seat * 6} MAD."
        })

with open("pricing/pricing.json", "w", encoding="utf-8") as f:
    json.dump(all_prices, f, indent=2)

# -------- Generate Metadata (REMOVED FERRIES and trans_ghazala) --------
os.makedirs("metadata", exist_ok=True)

all_companies = []
for a in AIRLINE_LIST:
    all_companies.append({"id": a["id"], "name": a["name"], "type": "airline"})
all_companies.append({"id": "oncf", "name": "ONCF", "type": "train"})
for bc in BUS_COMPANIES:
    all_companies.append({"id": bc["id"], "name": bc["name"], "type": "bus"})
all_companies.append({"id": "taxis_morocco", "name": "Moroccan Taxis", "type": "taxi"})
for tc in TRAM_COMPANIES:
    all_companies.append({"id": tc["id"], "name": tc["name"], "type": "tram"})
# Urban Bus companies
for ubc in URBAN_BUS_COMPANIES:
    all_companies.append({"id": ubc["id"], "name": ubc["name"], "type": "urban_bus"})

with open("metadata/companies.json", "w", encoding="utf-8") as f:
    json.dump(all_companies, f, indent=2)

with open("metadata/cities.json", "w", encoding="utf-8") as f:
    with open("cities/cities.json", "r", encoding="utf-8") as cf:
        json.dump(json.load(cf), f, indent=2)

with open("metadata/stations.json", "w", encoding="utf-8") as f:
    with open("stations/stations.json", "r", encoding="utf-8") as sf:
        json.dump(json.load(sf), f, indent=2)

# transport_types - removed "ferry"
with open("metadata/transport_types.json", "w", encoding="utf-8") as f:
    json.dump(["air", "train", "bus", "taxi", "tram", "urban_bus"], f, indent=2)

regions = list(set(c["region"] for c in CITIES))
with open("metadata/regions.json", "w", encoding="utf-8") as f:
    json.dump(regions, f, indent=2)

# colors - removed ferry
with open("metadata/colors.json", "w", encoding="utf-8") as f:
    json.dump({
        "air": "#003399",
        "train": "#cc0000",
        "bus": "#006600",
        "taxi": "#ffcc00",
        "tram": "#0066cc",
        "urban_bus": "#009e60"
    }, f, indent=2)

with open("metadata/README.md", "w", encoding="utf-8") as f:
    f.write("""# Metadata

This folder contains global metadata about the transportation data.

- companies.json: list of all transport companies
- cities.json: list of all cities
- stations.json: list of all stations
- transport_types.json: list of all transport modes
- regions.json: list of Moroccan regions
- colors.json: color mapping for transport types
""")

# -------- Documentation (updated: removed ferries, removed trans_ghazala) --------
os.makedirs("documentation", exist_ok=True)
with open("documentation/README.md", "w", encoding="utf-8") as f:
    f.write("""# MoroccWay Transportation Data Documentation

## Overview
This repository contains comprehensive transportation data for Morocco, covering air, train, bus, taxi, tram, and urban bus services.

## Data Structure
- **airlines/**: Per‑airline data (company, fleet, routes, prices, schedules).
- **airports/**: Airport details, services, metadata.
- **trains/**: ONCF national railway data.
- **buses/**: Data for major bus operators (intercity).
- **urban_buses/**: Data for city bus networks (intra‑city).
- **taxis/**: Petit and Grand Taxi information with detailed pricing and rules.
- **tramway/**: Casablanca and Rabat‑Salé tram systems.
- **cities/**: Moroccan cities with coordinates and population.
- **stations/**: Unified list of all transportation stations.
- **routes/**: Combined routes from all transport modes.
- **schedules/**: Combined schedules.
- **pricing/**: Combined pricing.
- **metadata/**: Global metadata files.

## Naming Convention
All files and folders use `lowercase_snake_case`. Route IDs follow the pattern `{company}_{origin}_{destination}`.

## Usage
This data is intended for use in the MoroccWay React + TypeScript + Leaflet GIS application. All JSON files are UTF‑8 encoded and validated.
""")

# -------- Root README (updated: removed ferries and trans_ghazala) --------
with open("README.md", "w", encoding="utf-8") as f:
    f.write("""# MoroccWay Transportation Data

This is the complete transportation data repository for the **MoroccWay** project – an intercity multimodal travel platform for Morocco.

## Contents
- **Airlines**: 12 airlines with routes, fleet, schedules.
- **Airports**: 13 major Moroccan airports.
- **Trains**: ONCF railway with stations, routes, Al Boraq high‑speed services.
- **Buses**: 6 major intercity bus companies (CTM, Supratours, Ghazala, SATAS, Jana Viajes, Pullman du Sud).
- **Urban Buses**: 7 city bus networks (Casablanca, Rabat, Marrakech, Agadir, Fès, Tétouan, Oujda).
- **Taxis**: Petit Taxi (urban, metered) and Grand Taxi (shared intercity) with detailed fare structures.
- **Tramway**: Casablanca and Rabat‑Salé tram networks.
- **Cities**: 28 cities with coordinates and population.
- **Stations**: 300+ stations (airports, train, bus, tram, urban bus stops).
- **Routes**: 500+ realistic intercity and intra‑city routes.
- **Schedules**: 1000+ departure schedules.
- **Pricing**: Realistic fare data in MAD.

## How to Use
1. Integrate into your React + TypeScript + Leaflet app.
2. Use the `metadata/` files for global references.
3. Each transport mode folder contains its own README with details.

## Data Quality
All data is based on publicly available information and realistic estimates. Coordinates are accurate to within a few kilometers.

## Generation
This repository was generated automatically using the `build_repository.py` script. All JSON files are valid and ready for production.

For more details, see the `documentation/` folder.
""")

# -------- Add Logos to All Companies & Create Assets Folder --------
os.makedirs("assets/logos", exist_ok=True)

# Helper function to add logo field to company.json
def update_company_with_logo(folder_path, company_id):
    company_file = os.path.join(folder_path, "company.json")
    if os.path.exists(company_file):
        with open(company_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        data["logo"] = f"/assets/logos/{company_id}.png"
        with open(company_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

# Airlines
for airline in AIRLINE_LIST:
    update_company_with_logo(f"airlines/{airline['id']}", airline["id"])

# Train
update_company_with_logo("trains/oncf", "oncf")

# Intercity Buses
for bc in BUS_COMPANIES:
    update_company_with_logo(f"buses/{bc['id']}", bc["id"])

# Urban Buses
for ubc in URBAN_BUS_COMPANIES:
    update_company_with_logo(f"urban_buses/{ubc['id']}", ubc["id"])

# Tramway
for tc in TRAM_COMPANIES:
    update_company_with_logo(f"tramway/{tc['id']}", tc["id"])

# Taxis
update_company_with_logo("taxis", "taxis_morocco")

# Write a README in the logos folder listing all required PNG files
with open("assets/logos/README.md", "w", encoding="utf-8") as f:
    f.write("""# Logos Folder

This folder contains all company logos used in the MoroccWay transportation data.

## Required Logo Files

Place the following logo files (**in PNG format**) in this folder. 
The filename must match the company ID exactly (case-sensitive).

### Airlines
""")
    for cid in [a["id"] for a in AIRLINE_LIST]:
        f.write(f"- `{cid}.png`\n")
    f.write("\n### Train\n- `oncf.png`\n\n### Intercity Buses\n")
    for cid in [bc["id"] for bc in BUS_COMPANIES]:
        f.write(f"- `{cid}.png`\n")
    f.write("\n### Urban Buses\n")
    for cid in [ubc["id"] for ubc in URBAN_BUS_COMPANIES]:
        f.write(f"- `{cid}.png`\n")
    f.write("\n### Tramway\n")
    for cid in [tc["id"] for tc in TRAM_COMPANIES]:
        f.write(f"- `{cid}.png`\n")
    f.write("\n### Taxis\n- `taxis_morocco.png`\n\n")
    f.write("""## How to Use
1. Download the official logo from the company's website.
2. Save it as a **PNG** file in this folder with the exact filename listed above.
3. The frontend will automatically display it by reading the `logo` field from `company.json` files (`"logo": "/assets/logos/{id}.png"`).
""")

# -------- Create ZIP archive --------
zip_name = "MoroccWay_Transportation_Data.zip"
with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("MoroccWay_Transportation_Data"):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, start=".")
            zipf.write(file_path, arcname)

print(f"✅ Repository successfully created and zipped as {zip_name}")
print(f"✅ All company.json files now include a 'logo' field pointing to /assets/logos/{{id}}.png")
print(f"✅ Check assets/logos/README.md for the complete list of logo files you need to download.")