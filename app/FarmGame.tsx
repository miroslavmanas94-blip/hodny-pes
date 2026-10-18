"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight, ArrowUpRight, Award, Bone, BookOpen, Check, ChevronRight,
  CircleHelp, Coins, Dog, Droplets, Footprints, Heart, House, Languages,
  Leaf, Lock, Map, Menu, Plus, Search, ShoppingBag, Sparkles, Target,
  Trees, Trophy, UserRound, Volume2, VolumeX, X
} from "lucide-react";
import "./farm.css";

type Language = "cs" | "en";
type LocationId = "centre" | "obedience" | "puller" | "scent" | "rest" | "park";
type Panel = "missions" | "dogs" | "map" | "shop" | "settings" | "about" | null;
type MapObject = { id: string; title: string; subtitle: string; x: number; y: number; kind: "training" | "puller" | "scent" | "care" | "explore" | "mission"; reward: number; xp: number; energy?: number };
type DogProfile = { id: string; name: string; breed: string; color: string; accent: string; unlockLevel: number };
type DogProgress = { energy: number; bond: number; xp: number };
type SaveData = { coins: number; xp: number; dogStats: Record<string, DogProgress>; activeDog: string; unlockedDogs: string[]; completed: string[]; language: Language; muted: boolean; showHud: boolean; lastLocation: LocationId };
const SAVE_KEY = "hodny-pes-adventure-save-v2";

const DOGS: DogProfile[] = [
  { id: "monty", name: "Monty", breed: "Sheltie", color: "#b87846", accent: "#f0d2a4", unlockLevel: 1 },
  { id: "bety", name: "Bety", breed: "Welsh corgi", color: "#c88a4d", accent: "#f4d8a5", unlockLevel: 3 },
  { id: "rex", name: "Rex", breed: "Border kolie", color: "#454c47", accent: "#d9ded4", unlockLevel: 5 },
  { id: "luna", name: "Luna", breed: "Zlatý retrívr", color: "#cda85c", accent: "#f6e4b8", unlockLevel: 7 },
  { id: "flek", name: "Flek", breed: "Dalmatin", color: "#ece8dd", accent: "#333a35", unlockLevel: 9 },
  { id: "bella", name: "Bella", breed: "Australský ovčák", color: "#7e6554", accent: "#d5bfa4", unlockLevel: 11 },
];

const LOCATIONS: { id: LocationId; title: string; subtitle: string; description: string; icon: typeof House; color: string; tint: string; objects: MapObject[] }[] = [
  {
    id: "centre", title: "Hlavní areál", subtitle: "Vstup a zázemí", description: "Tvoje základna. Rozhlédni se, naplánuj trénink a vydej se do další části centra.",
    icon: House, color: "#547c48", tint: "#dbe7cb",
    objects: [
      { id: "welcome", title: "Recepce", subtitle: "Začni dnešní dobrodružství", x: 48, y: 44, kind: "mission", reward: 20, xp: 15 },
      { id: "centre-training", title: "Tréninkový plac", subtitle: "Krátké cvičení poslušnosti", x: 70, y: 61, kind: "training", reward: 25, xp: 25, energy: 12 },
      { id: "centre-garden", title: "Odpočinková zóna", subtitle: "Dopřej psovi pauzu", x: 28, y: 65, kind: "care", reward: 5, xp: 8, energy: -35 },
    ],
  },
  {
    id: "obedience", title: "Cvičiště", subtitle: "Poslušnost a komunikace", description: "Trénuj přivolání, klid, pozornost a spolupráci. Každý pokus je příležitost naučit se něco nového.",
    icon: Target, color: "#65884e", tint: "#e1ebd2",
    objects: [
      { id: "sit", title: "Sedni a čekej", subtitle: "Krátká lekce sebekontroly", x: 31, y: 48, kind: "training", reward: 25, xp: 30, energy: 10 },
      { id: "recall", title: "Přivolání", subtitle: "Odměň návrat k člověku", x: 62, y: 38, kind: "training", reward: 30, xp: 35, energy: 12 },
      { id: "focus", title: "Pozornost na psovoda", subtitle: "Všímej si signálů svého psa", x: 70, y: 67, kind: "mission", reward: 20, xp: 20, energy: 8 },
    ],
  },
  {
    id: "puller", title: "Dog Puller aréna", subtitle: "Sport a spolupráce", description: "Seznam se s pomůckou, připrav se na aktivitu a střídej pohyb s odpočinkem.",
    icon: Trophy, color: "#9a8053", tint: "#f0e2c3",
    objects: [
      { id: "warmup", title: "Rozcvička", subtitle: "Připrav se na bezpečný trénink", x: 27, y: 61, kind: "care", reward: 10, xp: 15, energy: -8 },
      { id: "puller-running", title: "Running", subtitle: "První sportovní výzva", x: 53, y: 43, kind: "puller", reward: 40, xp: 40, energy: 18 },
      { id: "puller-jumping", title: "Jumping", subtitle: "Zkus přesnost a načasování", x: 75, y: 59, kind: "puller", reward: 45, xp: 45, energy: 20 },
    ],
  },
  {
    id: "scent", title: "Čichací zahrada", subtitle: "Nos jako super schopnost", description: "Hledej pachové stopy, zkoumej prostředí a nech psa pracovat vlastním tempem.",
    icon: Search, color: "#64865a", tint: "#d9e7ce",
    objects: [
      { id: "scent-box", title: "Pachový box", subtitle: "Najdi správnou stopu", x: 33, y: 44, kind: "scent", reward: 35, xp: 35, energy: 10 },
      { id: "scent-trail", title: "Pachová stopa", subtitle: "Postupuj krok za krokem", x: 61, y: 59, kind: "scent", reward: 40, xp: 40, energy: 12 },
      { id: "scent-find", title: "Najdi odměnu", subtitle: "Dokonči čichací úkol", x: 77, y: 39, kind: "mission", reward: 25, xp: 25, energy: 8 },
    ],
  },
  {
    id: "rest", title: "Klidová zóna", subtitle: "Péče a odpočinek", description: "Dobrý trénink počítá i s pauzou. Napij se, odpočiň si a posiluj důvěru.",
    icon: Heart, color: "#7b9870", tint: "#e0ead8",
    objects: [
      { id: "water", title: "Čerstvá voda", subtitle: "Doplň energii", x: 31, y: 47, kind: "care", reward: 5, xp: 8, energy: -28 },
      { id: "bond", title: "Společná chvilka", subtitle: "Buduj důvěru a vztah", x: 56, y: 57, kind: "care", reward: 10, xp: 15, energy: -12 },
      { id: "rest-bed", title: "Pelíšek", subtitle: "Pořádná pauza pro parťáka", x: 74, y: 41, kind: "care", reward: 5, xp: 10, energy: -45 },
    ],
  },
  {
    id: "park", title: "Psí park", subtitle: "Průzkum a běžný život", description: "Procvičuj dovednosti v klidném prostředí a uč se vnímat okolí i potřeby psa.",
    icon: Trees, color: "#628c57", tint: "#dce9d1",
    objects: [
      { id: "park-explore", title: "Prozkoumat okolí", subtitle: "Vydej se za novým podnětem", x: 30, y: 41, kind: "explore", reward: 20, xp: 20, energy: 8 },
      { id: "park-recall", title: "Přivolání v parku", subtitle: "Procvič dovednost v novém místě", x: 59, y: 54, kind: "training", reward: 30, xp: 30, energy: 12 },
      { id: "park-sniff", title: "Čichací stezka", subtitle: "Prozkoumej pachy kolem cesty", x: 74, y: 37, kind: "scent", reward: 25, xp: 25, energy: 10 },
    ],
  },
];

const TXT = {
  cs: {
    eyebrow: "VÍTEJ VE SVÉM PSÍM SVĚTĚ", explore: "PROZKOUMAT", intro: "Buduj vztah. Trénuj s respektem. Objevuj společně.",
    play: "Pokračovat ve hře", newGame: "Začít znovu", level: "ÚROVEŇ", xp: "ZKUŠENOSTI",
    energy: "ENERGIE PSA", bond: "DŮVĚRA", map: "Lokace", missions: "Mise a cíle", dogs: "Moji psi",
    shop: "Vybavení", settings: "Nastavení", about: "O projektu", objective: "DNEŠNÍ CÍL",
    objectiveText: "Vyber místo na mapě a začni společný trénink.", explore: "Prozkoumat lokaci",
    travel: "Přejít do lokace", back: "Zpět do světa", completed: "Splněno", doTask: "Začít aktivitu",
    reward: "Odměna", noEnergy: "Pejsek potřebuje pauzu. Zajdi do klidové zóny.", notEnough: "Na tohle ještě nemáš dost Hafíků.",
    dogLocked: "Odemkne se na úrovni", choose: "Vybrat parťáka", active: "AKTIVNÍ PARŤÁK",
    moreDogs: "Další pes se odemkne po tréninkovém pokroku. Každý pes má vlastní energii a potřebuje péči.",
    language: "Jazyk", sound: "Zvukové efekty", hud: "Zobrazovat herní HUD", save: "Postup se ukládá v tomto prohlížeči.",
    real: "Skutečný Hodný pes", realText: "Hra představuje pozitivní výcvik a psí sporty. Nenahrazuje odborné vedení.",
    website: "Navštívit hodnypes.cz", training: "Výcvik", puller: "Dog Puller", scent: "Čichání", care: "Péče", exploreKind: "Průzkum",
    newLevel: "Nová úroveň! Skvělá práce.", complete: "Hotovo", start: "Vstoupit do areálu", continue: "Pokračovat",
    firstTitle: "Každý velký tým začíná důvěrou", firstBody: "Poznej svého prvního parťáka, prozkoumej areál a vyber si první aktivitu. Trénuj krátce a dopřej psovi pauzu.",
    coin: "Hafíků", resetTitle: "Začít novou hru?", resetBody: "Tímto se smaže místní uložený postup v tomto prohlížeči.", cancel: "Zrušit", reset: "Smazat postup",
  },
  en: {
    eyebrow: "WELCOME TO YOUR DOG WORLD", explore: "EXPLORE", intro: "Build trust. Train kindly. Discover together.",
    play: "Continue game", newGame: "Start over", level: "LEVEL", xp: "EXPERIENCE",
    energy: "DOG ENERGY", bond: "TRUST", map: "Locations", missions: "Missions & goals", dogs: "My dogs",
    shop: "Equipment", settings: "Settings", about: "About", objective: "TODAY'S GOAL",
    objectiveText: "Choose a place on the map and start training together.", explore: "Explore location",
    travel: "Travel to location", back: "Back to world", completed: "Completed", doTask: "Start activity",
    reward: "Reward", noEnergy: "Your dog needs a break. Visit the rest area.", notEnough: "You need more Pawcoins for this.",
    dogLocked: "Unlocks at level", choose: "Choose companion", active: "ACTIVE COMPANION",
    moreDogs: "Unlock more dogs as you progress. Every dog has their own energy and needs care.",
    language: "Language", sound: "Sound effects", hud: "Show game HUD", save: "Progress is saved in this browser.",
    real: "The real Hodný pes", realText: "The game introduces positive training and dog sports. It does not replace professional guidance.",
    website: "Visit hodnypes.cz", training: "Training", puller: "Dog Puller", scent: "Scent work", care: "Care", exploreKind: "Explore",
    newLevel: "Level up! Great work.", complete: "Done", start: "Enter the grounds", continue: "Continue",
    firstTitle: "Every great team starts with trust", firstBody: "Meet your first companion, explore the grounds and choose an activity. Keep sessions short and give your dog breaks.",
    coin: "Pawcoins", resetTitle: "Start a new game?", resetBody: "This removes the local save in this browser.", cancel: "Cancel", reset: "Delete save",
  },
} satisfies Record<Language, Record<string, string>>;

const iconFor = (kind: MapObject["kind"]) => {
  if (kind === "training") return Target;
  if (kind === "puller") return Trophy;
  if (kind === "scent") return Search;
  if (kind === "care") return Heart;
  if (kind === "explore") return Trees;
  return Sparkles;
};

const defaultSave: SaveData = {
  coins: 120, xp: 0, dogStats: { monty: { energy: 100, bond: 20, xp: 0 } }, activeDog: "monty",
  unlockedDogs: ["monty"], completed: [], language: "cs", muted: false, showHud: true, lastLocation: "centre",
};

export default function FarmGame() {
  const [save, setSave] = useState<SaveData>(defaultSave);
  const [loaded, setLoaded] = useState(false);
  const [locationId, setLocationId] = useState<LocationId>("centre");
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [player, setPlayer] = useState({ x: 48, y: 76 });
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [welcome, setWelcome] = useState(true);

  const t = (key: keyof typeof TXT.cs) => TXT[save.language][key] || TXT.cs[key];
  const level = Math.floor(save.xp / 100) + 1;
  const activeDog = DOGS.find(d => d.id === save.activeDog) || DOGS[0];
  const activeDogStats = save.dogStats[activeDog.id] || { energy: 100, bond: 20, xp: 0 };
  const dogLevel = Math.floor(activeDogStats.xp / 100) + 1;
  const location = LOCATIONS.find(l => l.id === locationId) || LOCATIONS[0];
  const progress = save.xp % 100;
  const currentObjects = location.objects;
  const unfinished = LOCATIONS.flatMap(loc => loc.objects).filter(obj => !save.completed.includes(obj.id));
  const nextObjective = unfinished[0] || currentObjects[0];
  const nextObjectiveLocation = nextObjective ? LOCATIONS.find(loc => loc.objects.some(obj => obj.id === nextObjective.id)) || location : location;
  const ownedDogs = DOGS.filter(d => save.unlockedDogs.includes(d.id));
  const tForObject = (obj: MapObject) => ({ training: t("training"), puller: t("puller"), scent: t("scent"), care: t("care"), explore: t("exploreKind"), mission: t("missions") })[obj.kind];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SaveData>;
        const validLocations: LocationId[] = ["centre", "obedience", "puller", "scent", "rest", "park"];
        setSave({
          ...defaultSave,
          ...parsed,
          coins: typeof parsed.coins === "number" ? Math.max(0, parsed.coins) : defaultSave.coins,
          xp: typeof parsed.xp === "number" ? Math.max(0, parsed.xp) : 0,
          dogStats: parsed.dogStats && typeof parsed.dogStats === "object" ? parsed.dogStats : defaultSave.dogStats,
          unlockedDogs: Array.isArray(parsed.unlockedDogs) ? parsed.unlockedDogs.filter(id => DOGS.some(d => d.id === id)) : ["monty"],
          completed: Array.isArray(parsed.completed) ? parsed.completed.filter(id => typeof id === "string") : [],
          language: parsed.language === "en" ? "en" : "cs",
          lastLocation: validLocations.includes(parsed.lastLocation as LocationId) ? parsed.lastLocation as LocationId : "centre",
          activeDog: DOGS.some(d => d.id === parsed.activeDog) ? parsed.activeDog as string : "monty",
          muted: Boolean(parsed.muted), showHud: parsed.showHud !== false,
        });
        setLocationId(validLocations.includes(parsed.lastLocation as LocationId) ? parsed.lastLocation as LocationId : "centre");
        setWelcome(false);
      }
    } catch {
      // Invalid or unavailable browser storage should not prevent the game from starting.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify({ ...save, lastLocation: locationId })); } catch { /* Storage can be disabled or full. */ }
  }, [loaded, save, locationId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string) => setToast(message);
  const updateSave = (patch: Partial<SaveData>) => setSave(prev => ({ ...prev, ...patch }));

  const travelTo = (id: LocationId) => {
    setLocationId(id);
    setActiveObject(null);
    setPlayer({ x: 50, y: 76 });
    setPanel(null);
    setMobileNav(false);
  };

  const doActivity = (obj: MapObject) => {
    setPlayer({ x: obj.x, y: Math.max(60, obj.y + 16) });
    setActiveObject(obj.id);
    if (obj.energy && obj.energy > 0 && activeDogStats.energy < obj.energy) {
      notify(t("noEnergy"));
      travelTo("rest");
      return;
    }
    const alreadyCompleted = save.completed.includes(obj.id);
    const rewardCoins = alreadyCompleted ? 0 : obj.reward;
    const earnedXp = alreadyCompleted ? 5 : obj.xp;
    const newXp = save.xp + earnedXp;
    const newDogXp = activeDogStats.xp + earnedXp;
    const newLevel = Math.floor(newXp / 100) + 1;
    const newDogLevel = Math.floor(newDogXp / 100) + 1;
    const unlocks = DOGS.filter(d => d.unlockLevel <= newDogLevel && !save.unlockedDogs.includes(d.id));
    const updatedUnlocked = [...save.unlockedDogs, ...unlocks.map(d => d.id)];
    setSave(prev => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      xp: newXp,
      dogStats: { ...prev.dogStats, [activeDog.id]: { energy: Math.max(0, Math.min(100, (prev.dogStats[activeDog.id]?.energy ?? 100) - (obj.energy || 8))), bond: Math.max(0, Math.min(100, (prev.dogStats[activeDog.id]?.bond ?? 20) + (obj.kind === "care" ? 8 : 3))), xp: newDogXp } },
      completed: alreadyCompleted ? prev.completed : [...prev.completed, obj.id],
      unlockedDogs: updatedUnlocked,
    }));
    notify(alreadyCompleted ? (save.language === "cs" ? "Trénink zopakován: +5 XP bez další odměny." : "Practice repeated: +5 XP, no extra coins.") : (newLevel > level ? t("newLevel") : (save.language === "cs" ? "Aktivita splněna — skvělá spolupráce!" : "Activity complete — great teamwork!")));
    if (unlocks.length) window.setTimeout(() => notify((save.language === "cs" ? "Odemčen nový pes: " : "New dog unlocked: ") + unlocks.map(d => d.name).join(", ")), 900);
  };

  const restDog = () => {
    updateSave({ dogStats: { ...save.dogStats, [activeDog.id]: { energy: Math.min(100, activeDogStats.energy + 35), bond: Math.min(100, activeDogStats.bond + 5), xp: activeDogStats.xp } } });
    notify(save.language === "cs" ? "Paráda. Energie je doplněná, můžete pokračovat." : "Great. Energy restored — ready when you are.");
  };

  const resetSave = () => {
    setSave(defaultSave);
    setLocationId("centre");
    setPlayer({ x: 48, y: 76 });
    setPanel(null);
    setConfirmReset(false);
    setWelcome(true);
    try { window.localStorage.removeItem(SAVE_KEY); } catch { /* Ignore storage errors. */ }
    notify(save.language === "cs" ? "Nová hra je připravená." : "Your new game is ready.");
  };

  const MapIcon = location.icon;
  const totalDone = save.completed.length;
  const totalTasks = LOCATIONS.reduce((sum, loc) => sum + loc.objects.length, 0);

  return (
    <main className="adventureApp">
      <header className="adventureTopbar">
        <button className="adventureBrand" onClick={() => travelTo("centre")} aria-label="Hodný pes: Psí dobrodružství — hlavní areál">
          <span className="brandBadge"><Dog size={23} /></span>
          <span className="brandWordmark"><b>Psí dobrodružství</b><small>HODNÝ PES · VÝCVIK S RESPEKTEM</small></span>
        </button>
        <div className="topbarLocation"><span className="liveIndicator" /><span>{location.title}</span></div>
        <div className="topbarActions">
          <div className="currencyBadge"><Coins size={17} /><b>{save.coins.toLocaleString(save.language === "cs" ? "cs-CZ" : "en-US")}</b><small>{t("coin")}</small></div>
          <button className="iconButton languageButton" onClick={() => updateSave({ language: save.language === "cs" ? "en" : "cs" })} aria-label={t("language")}><Languages size={17}/><span>{save.language.toUpperCase()}</span></button>
          <button className="iconButton settingsButton" onClick={() => setPanel("settings")} aria-label={t("settings")}><Volume2 size={17}/></button>
          <a className="brandLink" href="https://www.hodnypes.cz/" target="_blank" rel="noreferrer">{t("real")} <ArrowUpRight size={14}/></a>
          <button className="iconButton mobileMenuButton" onClick={() => setMobileNav(v => !v)} aria-label="Menu"><Menu size={19}/></button>
        </div>
      </header>

      <div className="adventureLayout">
        <aside className={"adventureSidebar " + (mobileNav ? "sidebarVisible" : "")}>
          <div className="sidebarSectionLabel">{t("eyebrow")}</div>
          <button className="activeDogCard" onClick={() => setPanel("dogs")}>
            <span className="dogAvatar" style={{ "--dog-color": activeDog.color, "--dog-accent": activeDog.accent } as CSSProperties}><Dog size={29}/></span>
            <span className="dogCardText"><b>{activeDog.name}</b><small>{activeDog.breed}</small><span><Heart size={12}/> {t("bond")} {activeDogStats.bond}%</span></span>
            <ChevronRight size={17}/>
          </button>
          <div className="levelCard">
            <div className="levelCardTop"><span>{t("level")} {level}</span><b>{progress}/100 XP</b></div>
            <div className="progressTrack"><span style={{ width: progress + "%" }}/></div>
            <div className="levelCardBottom"><span>{t("xp")}</span><span>{totalDone}/{totalTasks}</span></div>
          </div>
          <div className="sidebarSectionLabel sidebarSectionSpaced">{t("explore")}</div>
          <nav className="locationNav" aria-label={t("map")}>
            {LOCATIONS.map(loc => {
              const Icon = loc.icon;
              return <button key={loc.id} className={"locationNavItem " + (locationId === loc.id ? "locationNavActive" : "")} onClick={() => travelTo(loc.id)}>
                <span className="locationNavIcon"><Icon size={17}/></span><span><b>{loc.title}</b><small>{loc.subtitle}</small></span>{locationId === loc.id && <span className="navActiveDot"/>}
              </button>;
            })}
          </nav>
          <div className="sidebarGrow"/>
          <div className="brandPromoCard">
            <span className="promoIcon"><Footprints size={20}/></span>
            <small>{t("real")}</small>
            <b>{save.language === "cs" ? "Více porozumění. Lepší společný život." : "More understanding. A better life together."}</b>
            <p>{t("realText")}</p>
            <a href="https://www.hodnypes.cz/" target="_blank" rel="noreferrer">{t("website")} <ArrowUpRight size={13}/></a>
          </div>
          <button className="sidebarTextButton" onClick={() => setPanel("about")}><CircleHelp size={16}/>{t("about")}</button>
        </aside>

        <section className="adventureMain">
          <div className="worldIntro">
            <div>
              <div className="worldKicker"><MapIcon size={14}/>{t("eyebrow")}</div>
              <h1>{location.title}<span>.</span></h1>
              <p>{location.description}</p>
            </div>
            <div className="worldIntroActions">
              <button className="secondaryButton" onClick={() => setPanel("map")}><Map size={16}/>{t("map")}</button>
              <button className="primaryButton" onClick={() => setPanel("missions")}><Target size={16}/>{t("missions")} <span>{totalTasks - totalDone}</span></button>
            </div>
          </div>

          <div className={"gameWorld world-" + locationId}>
            <div className="worldSky"><span className="skySun"/><span className="skyCloud skyCloudOne"/><span className="skyCloud skyCloudTwo"/></div>
            <div className="worldMapHeader"><span><span className="liveIndicator"/>{location.title}</span><small>{save.language === "cs" ? "KLEPNI NA MÍSTO A VYBER AKCI" : "TAP A PLACE TO CHOOSE AN ACTION"}</small></div>
            <svg className="terrainSvg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="terrainGrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={locationId === "puller" ? "#d9c99b" : locationId === "scent" ? "#bad2a4" : "#c9d9ac"}/><stop offset="100%" stopColor={locationId === "rest" ? "#b9cba7" : "#a8c48e"}/></linearGradient>
                <filter id="terrainShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#36533a" floodOpacity=".16"/></filter>
              </defs>
              <path d="M0 0H1000V640H0Z" fill="#dce7d0"/>
              <path d="M-40 260 Q180 145 350 250 T700 230 T1050 205 V680H-40Z" fill="url(#terrainGrass)"/>
              <path d="M-50 455 Q170 350 330 440 T650 430 T1040 390" fill="none" stroke="#e7d9b5" strokeWidth="82" strokeLinecap="round"/>
              <path d="M-50 455 Q170 350 330 440 T650 430 T1040 390" fill="none" stroke="#f4e8cc" strokeWidth="67" strokeLinecap="round"/>
              <path d="M260 -20 Q310 120 440 230 T590 680" fill="none" stroke="#e8dbb9" strokeWidth="70" strokeLinecap="round"/>
              <path d="M260 -20 Q310 120 440 230 T590 680" fill="none" stroke="#f7edda" strokeWidth="56" strokeLinecap="round"/>
              {locationId === "centre" && <g filter="url(#terrainShadow)"><path d="M90 145L235 65L380 145L235 224Z" fill="#e4d7b7" stroke="#8e9f77" strokeWidth="3"/><path d="M90 145V218L235 298V224Z" fill="#c4ad82"/><path d="M235 224L380 145V219L235 298Z" fill="#ad946a"/><path d="M155 145L235 100L315 145L235 190Z" fill="#b86f50"/><path d="M155 145V188L235 232V190Z" fill="#9c593f"/><path d="M235 190L315 145V188L235 232Z" fill="#804932"/><rect x="218" y="211" width="35" height="57" rx="2" fill="#f3e8ce" stroke="#8f785b" strokeWidth="3"/><path d="M220 226H250M235 212V268" stroke="#9d8c6d" strokeWidth="2"/></g>}
              {locationId === "obedience" && <g filter="url(#terrainShadow)"><path d="M130 150L495 70L720 185L355 265Z" fill="#d6c79d" stroke="#a3b28a" strokeWidth="3"/><path d="M180 150L490 83L670 175L360 242Z" fill="#b7cf99" stroke="#f4e8cc" strokeWidth="8"/><path d="M255 151L492 101L604 159L367 211Z" fill="none" stroke="#e9f0d9" strokeWidth="4" strokeDasharray="13 10"/><circle cx="470" cy="156" r="25" fill="#f4e8cc"/><circle cx="470" cy="156" r="15" fill="#75985e"/></g>}
              {locationId === "puller" && <g filter="url(#terrainShadow)"><ellipse cx="500" cy="275" rx="250" ry="140" fill="#b7a67b" stroke="#f1e3c3" strokeWidth="13"/><ellipse cx="500" cy="275" rx="208" ry="106" fill="#d6c79d" stroke="#b6c28f" strokeWidth="7"/><ellipse cx="500" cy="275" rx="160" ry="75" fill="#c5d7a8" stroke="#f6edda" strokeWidth="5"/><path d="M295 274H705" stroke="#f6edda" strokeWidth="4" strokeDasharray="12 10"/></g>}
              {locationId === "scent" && <g filter="url(#terrainShadow)"><path d="M140 170L330 90L510 190L320 270Z" fill="#a3bf8b" stroke="#f3e6c7" strokeWidth="7"/><path d="M195 172L330 115L455 187L320 244Z" fill="#8eaa73" stroke="#c6d9b1" strokeWidth="4"/><rect x="265" y="146" width="64" height="46" rx="8" fill="#d9b77c" stroke="#f4e7c7" strokeWidth="4"/><circle cx="297" cy="168" r="10" fill="#a7c48f"/></g>}
              {locationId === "rest" && <g filter="url(#terrainShadow)"><path d="M160 165L380 75L590 188L370 280Z" fill="#b7c7a0" stroke="#e7edda" strokeWidth="4"/><path d="M210 166L380 96L540 188L370 258Z" fill="#d9e2c8" stroke="#a6bc91" strokeWidth="3"/><rect x="325" y="160" width="100" height="52" rx="18" fill="#b5cda2" stroke="#77966a" strokeWidth="4"/><path d="M342 176H408" stroke="#f7f1df" strokeWidth="5" strokeLinecap="round"/></g>}
              {locationId === "park" && <g filter="url(#terrainShadow)"><path d="M90 190Q310 65 470 190T850 170" fill="none" stroke="#f2e5c7" strokeWidth="64" strokeLinecap="round"/><path d="M90 190Q310 65 470 190T850 170" fill="none" stroke="#fff3da" strokeWidth="50" strokeLinecap="round"/></g>}
              {Array.from({ length: 10 }, (_, i) => <g key={i} transform={"translate(" + (65 + (i * 97) % 890) + " " + (100 + (i * 67) % 470) + ")"} opacity=".78"><ellipse cx="0" cy="18" rx="22" ry="8" fill="#69885a" opacity=".23"/><circle cx="-7" cy="0" r="18" fill={i % 2 ? "#789c68" : "#86a975"}/><circle cx="8" cy="-7" r="17" fill={i % 2 ? "#88a978" : "#719565"}/><circle cx="0" cy="-15" r="15" fill={i % 2 ? "#9fbd89" : "#80a471"}/><path d="M0 4V24" stroke="#927e5c" strokeWidth="5" strokeLinecap="round"/></g>)}
            </svg>

            {currentObjects.map(obj => {
              const Icon = iconFor(obj.kind);
              const done = save.completed.includes(obj.id);
              return <button key={obj.id} className={"worldObject " + (done ? "worldObjectDone" : "") + (activeObject === obj.id ? " worldObjectActive" : "")} style={{ left: obj.x + "%", top: obj.y + "%" }} onClick={() => doActivity(obj)} aria-label={obj.title}>
                <span className="objectShadow"/><span className="objectIcon"><Icon size={22}/>{done && <span className="objectCheck"><Check size={11}/></span>}</span><span className="objectLabel"><b>{obj.title}</b><small>{done ? t("completed") : tForObject(obj)}</small></span>
              </button>;
            })}
            <div className="playerPair" style={{ left: player.x + "%", top: player.y + "%" }} aria-label={save.language === "cs" ? "Tvoje postava a pes" : "Your character and dog"}>
              <span className="playerShadow"/><span className="playerPerson"><UserRound size={22}/></span><span className="playerDog" style={{ "--dog-color": activeDog.color, "--dog-accent": activeDog.accent } as CSSProperties}><Dog size={23}/></span>
            </div>
            <div className="mapCompass"><Map size={14}/><span>{location.title}</span><small>{currentObjects.filter(o => !save.completed.includes(o.id)).length} {save.language === "cs" ? "aktivity" : "activities"}</small></div>
            <div className="mapZoomControls"><button onClick={() => notify(save.language === "cs" ? "Mapa se dá prozkoumat klepnutím na jednotlivé aktivity." : "Explore the map by tapping activity markers.")} aria-label={save.language === "cs" ? "Nápověda k mapě" : "Map help"}><CircleHelp size={17}/></button></div>
            {save.showHud && <div className="mapObjective"><span className="objectiveBadge"><Target size={18}/></span><span><small>{t("objective")}</small><b>{nextObjective ? nextObjective.title : (save.language === "cs" ? "Všechny aktivity splněny!" : "All activities completed!")}</b><em>{nextObjective ? nextObjective.subtitle : t("complete")}</em></span><button onClick={() => { if (!nextObjective) return; if (nextObjectiveLocation.id !== locationId) { travelTo(nextObjectiveLocation.id); window.setTimeout(() => doActivity(nextObjective), 80); } else doActivity(nextObjective); }} aria-label={t("doTask")}><ArrowRight size={18}/></button></div>}
          </div>

          <div className="belowMapGrid">
            <section className="progressPanel">
              <div className="panelHeading"><span className="panelHeadingIcon"><Award size={18}/></span><div><h2>{save.language === "cs" ? "Tvoje cesta" : "Your journey"}</h2><p>{save.language === "cs" ? "Každý malý krok se počítá." : "Every small step counts."}</p></div><b>{totalDone}/{totalTasks}</b></div>
              <div className="progressTrack progressTrackWide"><span style={{ width: Math.min(100, totalDone / totalTasks * 100) + "%" }}/></div>
              <div className="journeyStats"><span><Sparkles size={15}/>{save.xp} XP</span><span><Dog size={15}/>{dogLevel} {save.language === "cs" ? "úroveň psa" : "dog level"}</span><span><Heart size={15}/>{save.bond}% {t("bond").toLowerCase()}</span></div>
            </section>
            <section className="quickActionsPanel">
              <div className="panelHeading"><span className="panelHeadingIcon"><Footprints size={18}/></span><div><h2>{save.language === "cs" ? "Co podnikneme?" : "What's next?"}</h2><p>{save.language === "cs" ? "Vyber další krok." : "Choose your next step."}</p></div></div>
              <div className="quickActionButtons"><button onClick={() => setPanel("missions")}><Target size={16}/>{t("missions")}<ChevronRight size={15}/></button><button onClick={() => travelTo("rest")}><Heart size={16}/>{t("care")}<ChevronRight size={15}/></button><button onClick={() => setPanel("dogs")}><Dog size={16}/>{t("dogs")}<ChevronRight size={15}/></button></div>
            </section>
          </div>
        </section>
      </div>

      {panel && <div className="panelBackdrop" onClick={() => setPanel(null)}>
        <section className="adventurePanel" role="dialog" aria-modal="true" aria-label={panel} onClick={e => e.stopPropagation()}>
          <header className="adventurePanelHeader"><div><small>HODNÝ PES · PSÍ DOBRODRUŽSTVÍ</small><h2>{panel === "missions" ? t("missions") : panel === "dogs" ? t("dogs") : panel === "map" ? t("map") : panel === "shop" ? t("shop") : panel === "settings" ? t("settings") : t("about")}</h2></div><button onClick={() => setPanel(null)} aria-label="Close"><X size={20}/></button></header>
          {panel === "missions" && <div className="missionList">{LOCATIONS.map(loc => <div className="missionLocationGroup" key={loc.id}><h3>{loc.title}</h3>{loc.objects.map(obj => { const Icon = iconFor(obj.kind); const done = save.completed.includes(obj.id); return <article className={"missionRow " + (done ? "missionRowDone" : "")} key={obj.id}><span className="missionIcon"><Icon size={18}/></span><span className="missionText"><b>{obj.title}</b><small>{obj.subtitle}</small><em>+{obj.reward} {t("coin")} · +{obj.xp} XP</em></span>{done ? <span className="missionDone"><Check size={15}/>{t("completed")}</span> : <button onClick={() => { travelTo(loc.id); window.setTimeout(() => doActivity(obj), 50); }}>{t("doTask")}<ChevronRight size={14}/></button>}</article>; })}</div>)}</div>}
          {panel === "dogs" && <div className="dogRoster"><p className="panelLead">{t("moreDogs")}</p>{DOGS.map(d => { const unlocked = save.unlockedDogs.includes(d.id); const selected = save.activeDog === d.id; return <article key={d.id} className={"dogRosterRow " + (selected ? "dogRosterSelected" : "") + (!unlocked ? " dogRosterLocked" : "")}><span className="dogRosterAvatar" style={{ "--dog-color": d.color, "--dog-accent": d.accent } as CSSProperties}>{unlocked ? <Dog size={25}/> : <Lock size={21}/>}</span><span className="dogRosterInfo"><b>{d.name}</b><small>{d.breed}</small><em>{unlocked ? (selected ? t("active") : (save.language === "cs" ? "Úroveň psa " + (d.id === "monty" ? dogLevel : d.unlockLevel) : "Dog level " + (d.id === "monty" ? dogLevel : d.unlockLevel))) : t("dogLocked") + " " + d.unlockLevel}</em></span>{unlocked ? <button disabled={selected} onClick={() => updateSave({ activeDog: d.id, dogStats: { ...save.dogStats, [d.id]: save.dogStats[d.id] || { energy: 100, bond: 20, xp: 0 } } })}>{selected ? <Check size={16}/> : t("choose")}</button> : <span className="lockRequirement"><Lock size={14}/>{d.unlockLevel}</span>}</article>; })}</div>}
          {panel === "map" && <div className="locationCards">{LOCATIONS.map(loc => { const Icon = loc.icon; const done = loc.objects.filter(obj => save.completed.includes(obj.id)).length; return <button className={"locationCard " + (locationId === loc.id ? "locationCardActive" : "")} key={loc.id} onClick={() => travelTo(loc.id)}><span className="locationCardIcon" style={{ background: loc.tint, color: loc.color }}><Icon size={22}/></span><span><b>{loc.title}</b><small>{loc.subtitle}</small><em>{done}/{loc.objects.length} {t("completed").toLowerCase()}</em></span><ChevronRight size={17}/></button>; })}</div>}
          {panel === "shop" && <div className="shopContent"><p className="panelLead">{save.language === "cs" ? "Vybavení odemykáš hraním a plněním aktivit. Tato první verze používá jednoduché herní odměny bez plateb." : "Unlock equipment by playing and completing activities. This first version uses simple in-game rewards without payments."}</p><article className="shopProduct"><span><Bone size={27}/></span><div><b>Dog Puller</b><small>{save.language === "cs" ? "Sportovní pomůcka · odemyká se hraním" : "Sports equipment · earned through play"}</small></div><strong><Coins size={15}/> 80</strong><button disabled={save.coins < 80 || save.completed.includes("shop-puller")} onClick={() => { updateSave({ coins: save.coins - 80, completed: [...save.completed, "shop-puller"] }); notify(save.language === "cs" ? "Vybavení odemčeno." : "Equipment unlocked."); }}>{save.completed.includes("shop-puller") ? t("completed") : (save.language === "cs" ? "Odemknout" : "Unlock")}</button></article><article className="shopProduct"><span><Leaf size={27}/></span><div><b>{save.language === "cs" ? "Přírodní obojek" : "Nature collar"}</b><small>{save.language === "cs" ? "Kosmetická odměna pro parťáka" : "Cosmetic reward for your companion"}</small></div><strong><Coins size={15}/> 120</strong><button disabled={save.coins < 120 || save.completed.includes("shop-collar")} onClick={() => { updateSave({ coins: save.coins - 120, completed: [...save.completed, "shop-collar"] }); notify(save.language === "cs" ? "Obojek odemčen." : "Collar unlocked."); }}>{save.completed.includes("shop-collar") ? t("completed") : (save.language === "cs" ? "Odemknout" : "Unlock")}</button></article><a className="externalShopLink" href="https://www.hodnypes.cz/internetovy-obchod/" target="_blank" rel="noreferrer">{save.language === "cs" ? "Skutečné pomůcky v e-shopu Hodný pes" : "Real equipment in the Hodný pes shop"} <ArrowUpRight size={15}/></a></div>}
          {panel === "settings" && <div className="settingsContent"><div className="settingRow"><span><Languages size={18}/><span><b>{t("language")}</b><small>{save.language === "cs" ? "Čeština / English" : "English / Čeština"}</small></span></span><button onClick={() => updateSave({ language: save.language === "cs" ? "en" : "cs" })}>{save.language === "cs" ? "Čeština" : "English"}</button></div><div className="settingRow"><span>{save.muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}<span><b>{t("sound")}</b><small>{save.language === "cs" ? "V této verzi nejsou přidány zvukové soubory." : "No sound files are bundled in this version."}</small></span></span><button onClick={() => updateSave({ muted: !save.muted })}>{save.muted ? (save.language === "cs" ? "Vypnuto" : "Off") : (save.language === "cs" ? "Zapnuto" : "On")}</button></div><div className="settingRow"><span><Search size={18}/><span><b>{t("hud")}</b><small>{save.language === "cs" ? "Cíl mise na mapě" : "Map objective panel"}</small></span></span><button onClick={() => updateSave({ showHud: !save.showHud })}>{save.showHud ? (save.language === "cs" ? "Zobrazeno" : "Shown") : (save.language === "cs" ? "Skryto" : "Hidden")}</button></div><div className="saveNotice"><Check size={17}/>{t("save")}</div><button className="dangerButton" onClick={() => setConfirmReset(true)}>{t("newGame")}</button>{confirmReset && <div className="resetConfirm"><b>{t("resetTitle")}</b><p>{t("resetBody")}</p><div><button onClick={() => setConfirmReset(false)}>{t("cancel")}</button><button onClick={resetSave}>{t("reset")}</button></div></div>}</div>}
          {panel === "about" && <div className="aboutContent"><span className="aboutMark"><Dog size={35}/></span><h3>Hodný pes: Psí dobrodružství</h3><p>{save.language === "cs" ? "Herní prototyp inspirovaný pozitivním výcvikem, důvěrou mezi člověkem a psem a psími sporty. V této verzi se postup ukládá pouze do místního prohlížeče. Účty, online multiplayer a synchronizace mezi zařízeními zatím nejsou zapojené." : "A game prototype inspired by positive dog training, trust between people and dogs, and dog sports. Progress in this version is saved only in the local browser. Accounts, online multiplayer and cross-device sync are not connected yet."}</p><a href="https://www.hodnypes.cz/" target="_blank" rel="noreferrer">{t("website")} <ArrowUpRight size={15}/></a></div>}
          <footer className="adventurePanelFooter"><span><Coins size={15}/>{save.coins} {t("coin")}</span><button onClick={() => setPanel(null)}>{save.language === "cs" ? "Zpět do hry" : "Back to game"}</button></footer>
        </section>
      </div>}

      {welcome && <div className="welcomeOverlay"><section className="welcomeCard"><div className="welcomeArt"><span className="welcomeSun"/><span className="welcomeTree welcomeTreeOne"/><span className="welcomeTree welcomeTreeTwo"/><span className="welcomeGround"/><span className="welcomePerson"><UserRound size={42}/></span><span className="welcomeDog"><Dog size={43}/></span></div><div className="welcomeText"><small>{t("eyebrow")}</small><h2>{t("firstTitle")}</h2><p>{t("firstBody")}</p><div className="welcomeBenefits"><span><Heart size={15}/>{save.language === "cs" ? "Pozitivní výcvik" : "Positive training"}</span><span><Map size={15}/>{save.language === "cs" ? "6 lokací" : "6 locations"}</span><span><Award size={15}/>{save.language === "cs" ? "Mise a odměny" : "Missions & rewards"}</span></div><button className="primaryButton welcomeStart" onClick={() => { setWelcome(false); travelTo("centre"); }}>{t("start")} <ArrowRight size={17}/></button><button className="welcomeSkip" onClick={() => setWelcome(false)}>{t("continue")}</button></div></section></div>}

      {toast && <div className="gameToast"><span><Check size={16}/></span>{toast}</div>}
    </main>
  );
}
