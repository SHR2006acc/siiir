export type LocationType = "CITY" | "TRAIN_STATION" | "COACH_STATION" | "AIRPORT";

export type MoroccoLocation = {
  id: string;
  name: string;
  city: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  aliases: string[];
};

export const moroccoLocations: MoroccoLocation[] = [
  { id:"casablanca", name:"Casablanca", city:"Casablanca", type:"CITY", latitude:33.5731, longitude:-7.5898, aliases:["Casa"] },
  { id:"rabat", name:"Rabat", city:"Rabat", type:"CITY", latitude:34.0209, longitude:-6.8416, aliases:["Rabat Ville"] },
  { id:"sale", name:"Salé", city:"Salé", type:"CITY", latitude:34.0531, longitude:-6.7985, aliases:["Sale"] },
  { id:"mohammedia", name:"Mohammedia", city:"Mohammedia", type:"CITY", latitude:33.6861, longitude:-7.3830, aliases:["Fedala"] },
  { id:"kenitra", name:"Kénitra", city:"Kénitra", type:"CITY", latitude:34.2610, longitude:-6.5802, aliases:["Kenitra"] },
  { id:"fes", name:"Fès", city:"Fès", type:"CITY", latitude:34.0331, longitude:-5.0003, aliases:["Fez","Fes"] },
  { id:"meknes", name:"Meknès", city:"Meknès", type:"CITY", latitude:33.8935, longitude:-5.5473, aliases:["Meknes"] },
  { id:"marrakech", name:"Marrakech", city:"Marrakech", type:"CITY", latitude:31.6295, longitude:-7.9811, aliases:["Marrakesh"] },
  { id:"agadir", name:"Agadir", city:"Agadir", type:"CITY", latitude:30.4278, longitude:-9.5981, aliases:[] },
  { id:"essaouira", name:"Essaouira", city:"Essaouira", type:"CITY", latitude:31.5085, longitude:-9.7595, aliases:["Mogador"] },
  { id:"oujda", name:"Oujda", city:"Oujda", type:"CITY", latitude:34.6814, longitude:-1.9086, aliases:[] },
  { id:"nador", name:"Nador", city:"Nador", type:"CITY", latitude:35.1681, longitude:-2.9335, aliases:[] },
  { id:"tanger", name:"Tanger", city:"Tanger", type:"CITY", latitude:35.7595, longitude:-5.8340, aliases:["Tangier"] },
  { id:"tetouan", name:"Tétouan", city:"Tétouan", type:"CITY", latitude:35.5889, longitude:-5.3626, aliases:["Tetouan"] },
  { id:"al-hoceima", name:"Al Hoceïma", city:"Al Hoceïma", type:"CITY", latitude:35.2517, longitude:-3.9372, aliases:["Al Hoceima"] },
  { id:"errachidia", name:"Errachidia", city:"Errachidia", type:"CITY", latitude:31.9314, longitude:-4.4244, aliases:["Er Rachidia"] },
  { id:"laayoune", name:"Laâyoune", city:"Laâyoune", type:"CITY", latitude:27.1253, longitude:-13.1625, aliases:["Laayoune","El Aaiún"] },
  { id:"dakhla", name:"Dakhla", city:"Dakhla", type:"CITY", latitude:23.6848, longitude:-15.9570, aliases:[] },
  { id:"beni-mellal", name:"Béni Mellal", city:"Béni Mellal", type:"CITY", latitude:32.3373, longitude:-6.3498, aliases:["Beni Mellal"] },
  { id:"khouribga", name:"Khouribga", city:"Khouribga", type:"CITY", latitude:32.8860, longitude:-6.9209, aliases:[] },
  { id:"el-jadida", name:"El Jadida", city:"El Jadida", type:"CITY", latitude:33.2316, longitude:-8.5007, aliases:["Mazagan"] },
  { id:"safi", name:"Safi", city:"Safi", type:"CITY", latitude:32.2994, longitude:-9.2372, aliases:[] },
  { id:"ouarzazate", name:"Ouarzazate", city:"Ouarzazate", type:"CITY", latitude:30.9335, longitude:-6.9370, aliases:[] },
  { id:"chefchaouen", name:"Chefchaouen", city:"Chefchaouen", type:"CITY", latitude:35.1688, longitude:-5.2636, aliases:["Chaouen"] },
  { id:"ifrane", name:"Ifrane", city:"Ifrane", type:"CITY", latitude:33.5228, longitude:-5.1109, aliases:[] },
  { id:"azrou", name:"Azrou", city:"Azrou", type:"CITY", latitude:33.4344, longitude:-5.2213, aliases:[] },
  { id:"taza", name:"Taza", city:"Taza", type:"CITY", latitude:34.2133, longitude:-4.0103, aliases:[] },
  { id:"settat", name:"Settat", city:"Settat", type:"CITY", latitude:33.0010, longitude:-7.6166, aliases:[] },
  { id:"berrechid", name:"Berrechid", city:"Berrechid", type:"CITY", latitude:33.2655, longitude:-7.5875, aliases:[] },
  { id:"guelmim", name:"Guelmim", city:"Guelmim", type:"CITY", latitude:28.9870, longitude:-10.0574, aliases:["Goulimine"] },
  { id:"tiznit", name:"Tiznit", city:"Tiznit", type:"CITY", latitude:29.6974, longitude:-9.7316, aliases:[] },
  { id:"taroudant", name:"Taroudant", city:"Taroudant", type:"CITY", latitude:30.4703, longitude:-8.8770, aliases:[] },
  { id:"taghazout", name:"Taghazout", city:"Taghazout", type:"CITY", latitude:30.5457, longitude:-9.7093, aliases:[] },
  { id:"sefrou", name:"Sefrou", city:"Sefrou", type:"CITY", latitude:33.8319, longitude:-4.8280, aliases:[] },
  { id:"larache", name:"Larache", city:"Larache", type:"CITY", latitude:35.1932, longitude:-6.1557, aliases:[] },
  { id:"khemisset", name:"Khémisset", city:"Khémisset", type:"CITY", latitude:33.8240, longitude:-6.0663, aliases:["Khemisset"] },
  { id:"temara", name:"Témara", city:"Témara", type:"CITY", latitude:33.9287, longitude:-6.9066, aliases:["Temara"] },
  { id:"taounate", name:"Taounate", city:"Taounate", type:"CITY", latitude:34.5366, longitude:-4.6401, aliases:[] },
  { id:"ben-guerir", name:"Ben Guerir", city:"Ben Guerir", type:"CITY", latitude:32.2359, longitude:-7.9538, aliases:["Benguerir"] },
  { id:"chichaoua", name:"Chichaoua", city:"Chichaoua", type:"CITY", latitude:31.5435, longitude:-8.7620, aliases:[] },
  { id:"inezgane", name:"Inezgane", city:"Inezgane", type:"CITY", latitude:30.3554, longitude:-9.5364, aliases:[] },
  { id:"ait-melloul", name:"Aït Melloul", city:"Aït Melloul", type:"CITY", latitude:30.3347, longitude:-9.4977, aliases:["Ait Melloul"] },
  { id:"sidi-ifni", name:"Sidi Ifni", city:"Sidi Ifni", type:"CITY", latitude:29.3797, longitude:-10.1730, aliases:[] },
  { id:"asilah", name:"Asilah", city:"Asilah", type:"CITY", latitude:35.4650, longitude:-6.0340, aliases:[] },
  { id:"ksar-el-kebir", name:"Ksar El Kébir", city:"Ksar El Kébir", type:"CITY", latitude:35.0004, longitude:-5.9038, aliases:["Ksar El Kebir"] },
  { id:"ouezzane", name:"Ouezzane", city:"Ouezzane", type:"CITY", latitude:34.7958, longitude:-5.5785, aliases:["Ouazzane"] },
  { id:"berkane", name:"Berkane", city:"Berkane", type:"CITY", latitude:34.9217, longitude:-2.3198, aliases:[] },
  { id:"zagora", name:"Zagora", city:"Zagora", type:"CITY", latitude:30.3306, longitude:-5.8384, aliases:[] },
  { id:"cmn", name:"Aéroport Mohammed V (CMN)", city:"Casablanca", type:"AIRPORT", latitude:33.3675, longitude:-7.58997, aliases:["Mohammed V Airport","CMN"] },
  { id:"casa-voyageurs", name:"Casa Voyageurs", city:"Casablanca", type:"TRAIN_STATION", latitude:33.5896, longitude:-7.5913, aliases:["Gare Casa Voyageurs"] },
  { id:"marrakech-station", name:"Gare de Marrakech", city:"Marrakech", type:"TRAIN_STATION", latitude:31.6304, longitude:-8.0188, aliases:[] },
  { id:"rabat-agdal", name:"Rabat Agdal", city:"Rabat", type:"TRAIN_STATION", latitude:33.9907, longitude:-6.8581, aliases:[] },
];

export const cityLocations = moroccoLocations.filter((location) => location.type === "CITY");

const additionalMoroccoCities = [
  "Aït Melloul", "Akhfenir", "Arfoud", "Asilah", "Azemmour", "Azilal",
  "Ben Guerir", "Béni Ansar", "Berkane", "Biougra", "Bouarfa", "Boujdour",
  "Bouskoura", "Chichaoua", "Demnate", "El Hajeb", "El Kelaâ des Sraghna",
  "Es-Semara", "Figuig", "Fnideq", "Fquih Ben Salah", "Guercif", "Had Soualem",
  "Inezgane", "Imintanoute", "Imzouren", "Jerada", "Kasba Tadla", "Khémisset",
  "Khénifra", "Ksar El Kébir", "Larache", "Martil", "Mechra Bel Ksiri",
  "Médiouna", "Merzouga", "M'diq", "Midelt", "Mirleft", "Moulay Idriss Zerhoun",
  "Oualidia", "Ouezzane", "Rissani", "Sefrou", "Sidi Bennour", "Sidi Ifni",
  "Sidi Kacem", "Sidi Slimane", "Skhirat", "Souk El Arbaa", "Tan-Tan",
  "Taounate", "Témara", "Tiflet", "Tinghir", "Youssoufia",
];

export const locationNames = Array.from(new Set([
  ...cityLocations.map((location) => location.name),
  ...additionalMoroccoCities,
])).sort((a, b) => a.localeCompare(b, "fr"));

export function getLocation(name: string) {
  const normalized = name.trim().toLocaleLowerCase("fr");
  return moroccoLocations.find((location) =>
    [location.name, location.city, ...location.aliases]
      .some((candidate) => candidate.toLocaleLowerCase("fr") === normalized)
  );
}
