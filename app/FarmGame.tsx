"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import "./farm.css";
import { ArrowUpRight, Award, Bone, Check, ChevronRight, CircleHelp, Coins, Dog, Footprints, House, Languages, Leaf, Map, Menu, Plus, Search, ShoppingBag, Sparkles, Target, X } from "lucide-react";

type Panel = "dogs" | "build" | "quests" | "map" | "shop" | "help" | null;
type Building = { type: string; name: string; cost: number; color: string; short: string };
type Plot = { id: number; r: number; c: number; owned: boolean };
const BUILDINGS: Building[] = [
  { type: "kennel", name: "Psí zázemí", cost: 120, color: "#e8bd85", short: "K" },
  { type: "training", name: "Cvičiště", cost: 180, color: "#7f9e63", short: "C" },
  { type: "shop", name: "Výcvikový obchod", cost: 240, color: "#b98b73", short: "O" },
  { type: "salon", name: "Odpočinková zóna", cost: 280, color: "#8caeb0", short: "R" },
  { type: "puller", name: "Dog Puller aréna", cost: 320, color: "#a58bc4", short: "P" },
  { type: "garden", name: "Psí zahrada", cost: 90, color: "#79a36b", short: "Z" },
];
const DOGS = [
  { name: "Monty", breed: "Sheltie", trait: "Zvědavý průzkumník", color: "#c58c55" },
  { name: "Bety", breed: "Corgi", trait: "Veselá parťačka", color: "#d8a35f" },
  { name: "Rex", breed: "Border kolie", trait: "Chytrý šikula", color: "#626b67" },
  { name: "Luna", breed: "Zlatý retrívr", trait: "Milovnice aportu", color: "#d8bd78" },
  { name: "Flek", breed: "Dalmatin", trait: "Malý dobrodruh", color: "#d8d8d1" },
];
const LOCATIONS = [
  { id: "centre", name: "Hlavní areál", sub: "Centrum dění", x: 50, y: 46 },
  { id: "training", name: "Cvičiště", sub: "Trénink a poslušnost", x: 30, y: 36 },
  { id: "park", name: "Psí park", sub: "Volný pohyb", x: 72, y: 31 },
  { id: "puller", name: "Dog Puller", sub: "Sportovní aréna", x: 70, y: 68 },
  { id: "garden", name: "Zahrada", sub: "Klid a odpočinek", x: 31, y: 70 },
];
const tileCenter = (r: number, c: number) => ({ x: 350 + (c - r) * 53, y: 72 + (c + r) * 27 });

export default function FarmGame() {
  const [coins, setCoins] = useState(350);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [owned, setOwned] = useState<number[]>([7, 8, 9, 12, 13, 14, 15, 16, 17, 20, 21, 22]);
  const [buildings, setBuildings] = useState<Record<number, string>>({ 8: "kennel", 13: "training", 16: "garden" });
  const [activeDog, setActiveDog] = useState(0);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [language, setLanguage] = useState<"cs" | "en">("cs");
  const [loaded, setLoaded] = useState(false);
  const [activeLocation, setActiveLocation] = useState("centre");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const en = language === "en";
  const t = (cs: string, english: string) => en ? english : cs;
  const plots: Plot[] = useMemo(() => Array.from({ length: 36 }, (_, id) => ({ id, r: Math.floor(id / 6), c: id % 6, owned: owned.includes(id) })), [owned]);
  const dog = DOGS[activeDog];
  const location = LOCATIONS.find(l => l.id === activeLocation) || LOCATIONS[0];
  const quests = [
    { id: "welcome", title: t("Prohlédni si hlavní areál", "Explore the main grounds"), desc: t("Poznej své nové psí centrum.", "Get to know your new dog centre."), reward: 30, xp: 10 },
    { id: "train", title: t("První trénink", "First training session"), desc: t("Vyzkoušej si krátkou tréninkovou výzvu.", "Try a short training challenge."), reward: 45, xp: 25 },
    { id: "garden", title: t("Čas na průzkum", "Time to explore"), desc: t("Navštiv klidnou část areálu.", "Visit a quiet part of the grounds."), reward: 25, xp: 10 },
    { id: "puller", title: t("Dog Puller výzva", "Dog Puller challenge"), desc: t("Připrav se na sportovní aktivitu.", "Get ready for a sport activity."), reward: 60, xp: 25 },
    { id: "shop", title: t("Vybavení pro parťáka", "Gear for your companion"), desc: t("Prohlédni si výcvikové vybavení.", "Browse training equipment."), reward: 50, xp: 15 },
  ];
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hodny-pes-isometric-save-v1");
      if (raw) {
        const save = JSON.parse(raw);
        if (typeof save.coins === "number") setCoins(save.coins);
        if (typeof save.xp === "number") { setXp(save.xp); setLevel(Math.floor(save.xp / 100) + 1); }
        if (Array.isArray(save.owned)) setOwned(save.owned);
        if (save.buildings && typeof save.buildings === "object") setBuildings(save.buildings);
        if (Array.isArray(save.completed)) setCompleted(save.completed);
        if (typeof save.activeDog === "number") setActiveDog(Math.max(0, Math.min(DOGS.length - 1, save.activeDog)));
        if (save.language === "en") setLanguage("en");
      }
    } catch { /* Ignore an invalid local save and start a new game. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hodny-pes-isometric-save-v1", JSON.stringify({ coins, xp, owned, buildings, completed, activeDog, language }));
  }, [loaded, coins, xp, owned, buildings, completed, activeDog, language]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const award = (amount: number, experience = 10) => {
    setCoins(v => v + amount);
    const nextXp = xp + experience;
    const nextLevel = Math.floor(nextXp / 100) + 1;
    setXp(nextXp);
    if (nextLevel > level) notify(t("Nová úroveň. Dobrá práce!", "Level up. Nicely done!"));
    setLevel(nextLevel);
  };
  const claimQuest = (id: string, title: string, reward: number, experience: number) => {
    if (completed.includes(id)) return;
    setCompleted(v => [...v, id]); award(reward, experience);
    notify(t("Splněno: ", "Completed: ") + title + " · +" + reward);
  };
  const buyPlot = (id: number) => {
    if (owned.includes(id)) return;
    if (coins < 100) { notify(t("Na rozšíření potřebuješ 100 Hafíků.", "You need 100 Pawcoins to expand.")); return; }
    const near = owned.some(own => Math.abs(Math.floor(own / 6) - Math.floor(id / 6)) + Math.abs(own % 6 - id % 6) === 1);
    if (!near) { notify(t("Nejdřív rozšiř pozemek vedle svého areálu.", "Expand a neighbouring plot first.")); return; }
    setCoins(v => v - 100); setOwned(v => [...v, id]); award(0, 15); notify(t("Nový pozemek je tvůj.", "New land unlocked."));
  };
  const handlePlot = (plot: Plot) => {
    if (!plot.owned) { buyPlot(plot.id); return; }
    if (selectedBuild) {
      const item = BUILDINGS.find(b => b.type === selectedBuild);
      if (buildings[plot.id]) { notify(t("Na tomto místě už něco stojí.", "This plot is already occupied.")); return; }
      if (!item) return;
      if (coins < item.cost) { notify(t("Na tuto budovu nemáš dost Hafíků.", "Not enough Pawcoins for this building.")); return; }
      setCoins(v => v - item.cost); setBuildings(v => ({ ...v, [plot.id]: selectedBuild })); setSelectedBuild(null); award(0, 20); notify(t("Nová část areálu: ", "New facility: ") + item.name);
      return;
    }
    const type = buildings[plot.id];
    if (type === "kennel") setPanel("dogs");
    else if (type === "training") { setActiveLocation("training"); claimQuest("train", t("První trénink", "First training"), 45, 25); }
    else if (type === "garden") { setActiveLocation("garden"); claimQuest("garden", t("Čas na průzkum", "Time to explore"), 25, 10); }
    else if (type === "shop") { setActiveLocation("centre"); setPanel("shop"); }
    else if (type === "puller") { setActiveLocation("puller"); claimQuest("puller", t("Dog Puller výzva", "Dog Puller challenge"), 60, 25); }
    else if (type === "salon") { setActiveLocation("park"); claimQuest("shop", t("Odpočinek pro parťáka", "A break for your companion"), 50, 15); }
    else notify(t("Vyber budovu v nabídce a umísti ji sem.", "Choose a building and place it here."));
  };

  return <main className="farmApp">
    <header className="farmTopbar">
      <button className="brandMark" onClick={() => {setActiveLocation("centre");setPanel(null);}} aria-label="Hodný pes — hlavní areál"><span className="brandSymbol"><Dog size={23}/></span><span className="brandText"><b>HODNÝ PES</b><small>PSÍ DOBRODRUŽSTVÍ</small></span></button>
      <div className="topLocation"><span className="statusDot"/><span>{t("HERNÍ AREÁL", "GAME GROUNDS")}</span><b>{location.name}</b></div>
      <div className="topActions"><div className="currencyPill"><Coins size={17}/><b>{coins.toLocaleString(language === "cs" ? "cs-CZ" : "en-US")}</b><span>{t("Hafíků", "Pawcoins")}</span></div><button className="topIconButton" title={t("Změnit jazyk", "Change language")} onClick={() => setLanguage(v => v === "cs" ? "en" : "cs")}><Languages size={17}/><small>{language.toUpperCase()}</small></button><a className="websiteButton" href="https://hodnypes.cz/" target="_blank" rel="noreferrer">{t("Hodný pes v reálu", "Real Hodný pes")} <ArrowUpRight size={15}/></a><button className="mobileMenuToggle" onClick={() => setSidebarOpen(v => !v)} aria-label={t("Otevřít navigaci", "Open navigation")}><Menu size={19}/></button></div>
    </header>
    <div className="gameShell">
      <aside className={"gameSidebar "+(sidebarOpen?"gameSidebarOpen":"")}>
        <div className="sidebarEyebrow">{t("TVÉ CENTRUM", "YOUR CENTRE")}</div>
        <button className="profileButton" onClick={() => setPanel("dogs")}><span className="profileDog" style={{"--dog-color":dog.color} as CSSProperties}><Dog size={26}/></span><span className="profileInfo"><b>{dog.name}</b><small>{dog.breed} · {t("tvůj parťák", "your companion")}</small></span><ChevronRight size={16}/></button>
        <div className="levelPanel"><div className="levelLabel"><span>{t("ÚROVEŇ CENTRA", "CENTRE LEVEL")}</span><b>{level}</b></div><div className="levelTrack"><span style={{width:(xp%100)+"%"}}/></div><div className="levelCaption"><span>{xp%100}/100 XP</span><span>{t("Další úroveň", "Next level")}</span></div></div>
        <div className="navLabel">{t("PROZKOUMAT", "EXPLORE")}</div>
        <button className="navItem navActive" onClick={() => {setActiveLocation("centre");setPanel(null);}}><House size={18}/><span>{t("Hlavní areál", "Main grounds")}</span><i/></button>
        <button className={"navItem "+(panel==="map"?"navSelected":"")} onClick={() => setPanel("map")}><Map size={18}/><span>{t("Mapa a lokace", "Map & locations")}</span><ChevronRight size={15}/></button>
        <button className={"navItem "+(panel==="dogs"?"navSelected":"")} onClick={() => setPanel("dogs")}><Dog size={18}/><span>{t("Psí parťáci", "Dog companions")}</span><span className="navBadge">{DOGS.length}</span></button>
        <button className={"navItem "+(panel==="quests"?"navSelected":"")} onClick={() => setPanel("quests")}><Target size={18}/><span>{t("Mise a výzvy", "Missions & challenges")}</span><span className="navBadge">{quests.filter(q=>!completed.includes(q.id)).length}</span></button>
        <div className="navLabel navLabelSpaced">{t("SPRÁVA AREÁLU", "CENTRE MANAGEMENT")}</div>
        <button className={"navItem "+(panel==="build"?"navSelected":"")} onClick={() => setPanel("build")}><House size={18}/><span>{t("Budovy a vybavení", "Buildings & equipment")}</span></button>
        <button className={"navItem "+(panel==="shop"?"navSelected":"")} onClick={() => setPanel("shop")}><ShoppingBag size={18}/><span>{t("Výcvikový obchod", "Training shop")}</span></button>
        <button className="navItem" onClick={() => setPanel("help")}><CircleHelp size={18}/><span>{t("Jak hrát", "How to play")}</span></button>
        <div className="sidebarSpacer"/>
        <div className="realWorldCard"><span className="realWorldIcon"><Footprints size={20}/></span><span className="realWorldEyebrow">{t("VÍCE NEŽ HRA", "MORE THAN A GAME")}</span><b>{t("Skutečné zážitky se psy", "Real experiences with dogs")}</b><p>{t("Poznej kurzy, workshopy a pozitivní výcvik v centru Hodný pes.", "Discover courses, workshops and positive dog training.")}</p><a href="https://hodnypes.cz/" target="_blank" rel="noreferrer">{t("Objev centrum", "Discover the centre")} <ArrowUpRight size={14}/></a></div>
        <div className="sidebarBottom"><span className="brandMini"><Dog size={14}/></span><span>Hodný pes <small>· {t("s respektem a radostí", "with care and joy")}</small></span></div>
      </aside>
      <section className="worldArea">
        <div className="worldHeading"><div><span className="worldEyebrow"><span className="statusDot"/> {t("TVŮJ PSÍ SVĚT", "YOUR DOG WORLD")}</span><h1>{location.name}<span>.</span></h1><p>{location.sub} · {t("Vyber místo přímo na mapě a vydej se za dalším dobrodružstvím.", "Choose a place on the map and head into your next adventure.")}</p></div><div className="worldStats"><div><span>{t("POZEMKY", "PLOTS")}</span><b>{owned.length}<small>/36</small></b></div><div><span>{t("SPLNĚNO", "COMPLETED")}</span><b>{completed.length}<small>/{quests.length}</small></b></div></div></div>
        <div className="mapViewport">
          <div className="mapAtmosphere"><span className="mapSun"/><span className="mapCloud cloudOne"/><span className="mapCloud cloudTwo"/></div>
          <div className="mapTopLabel"><span className="mapLiveDot"/><span>{t("HLAVNÍ AREÁL HODNÝ PES", "HODNÝ PES MAIN GROUNDS")}</span><small>{t("INTERAKTIVNÍ MAPA", "INTERACTIVE MAP")}</small></div>
          <svg className="isometricBoard" viewBox="0 0 700 420" role="img" aria-label={t("Izometrická mapa hlavního areálu. Vyber pozemek nebo lokaci.", "Isometric map of the main grounds. Choose a plot or location.")}>
            <defs><linearGradient id="groundWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b8d29a"/><stop offset="100%" stopColor="#8eaf79"/></linearGradient><filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#34472d" floodOpacity=".16"/></filter></defs>
            <ellipse cx="350" cy="245" rx="294" ry="145" fill="#4f7046" opacity=".12"/>
            <path d="M350 42 L640 190 L350 365 L60 190 Z" fill="url(#groundWash)" stroke="#77996a" strokeWidth="2"/>
            {plots.map(plot => {
              const {x,y}=tileCenter(plot.r,plot.c);
              const points = `${x},${y} ${x+53},${y+27} ${x},${y+54} ${x-53},${y+27}`;
              const type=buildings[plot.id];
              const item=BUILDINGS.find(b=>b.type===type);
              const active = plot.owned && (plot.r===2 || plot.r===3);
              return <g key={plot.id} className={"plotGroup "+(plot.owned?"plotOwned":"plotLocked")} onClick={() => handlePlot(plot)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")handlePlot(plot)}} aria-label={plot.owned?(item?.name||t("Volný pozemek","Empty plot")):t("Odemknout pozemek za 100 Hafíků","Unlock plot for 100 Pawcoins")}>
                <polygon points={points} fill={!plot.owned?"#d4c8a4":active?"#b8d69b":((plot.r+plot.c)%2===0?"#a9cc8c":"#b5d596")} stroke={!plot.owned?"#a99b77":"#8bae72"} strokeWidth="1.4"/>
                {plot.owned && <path d={`M ${x-19} ${y+27} l 8 -4 M ${x+13} ${y+34} l 7 -3`} stroke="#83ac70" strokeWidth="2" opacity=".6" strokeLinecap="round"/>}
                {!plot.owned && <g><circle cx={x} cy={y+25} r="10" fill="#f5edda" stroke="#b7a77d"/><path d={`M ${x-3} ${y+25} h6 M ${x} ${y+22} v6`} stroke="#8e805e" strokeWidth="1.5"/><text x={x} y={y+43} textAnchor="middle" fontSize="8" fill="#655d45">100</text></g>}
                {item && <g filter="url(#softShadow)"><ellipse cx={x} cy={y+23} rx="25" ry="9" fill="#536c45" opacity=".2"/><path d={`M ${x-22} ${y+17} l22 -12 22 12 -22 12 z`} fill={item.color} stroke="#6d775c" strokeWidth="1"/><path d={`M ${x-22} ${y+17} v-15 l22 -12 v15 z`} fill={item.color} stroke="#6d775c" strokeWidth="1" transform={`translate(0 13)`}/><path d={`M ${x} ${y+5} l22 12 v-15 l-22 -12 z`} fill="#f3e4c6" stroke="#6d775c" strokeWidth="1" transform="translate(0 13)"/><text x={x} y={y+26} textAnchor="middle" fontSize="10" fontWeight="800" fill="#334631">{item.short}</text><text x={x} y={y+43} textAnchor="middle" fontSize="8" fontWeight="700" fill="#34472d">{item.name}</text></g>}
              </g>;
            })}
            <g className="mapDog" onClick={() => setPanel("dogs")} role="button" tabIndex={0} aria-label={t("Vybrat psího parťáka","Choose dog companion")}><ellipse cx="350" cy="238" rx="24" ry="8" fill="#4b6941" opacity=".24"/><circle cx="350" cy="218" r="17" fill={dog.color} stroke="#fff4dd" strokeWidth="3"/><path d="M338 208 l-7 -9 12 3 M362 208 l7 -9 -12 3" fill={dog.color} stroke="#fff4dd" strokeWidth="2" strokeLinejoin="round"/><circle cx="344" cy="217" r="2" fill="#2f392b"/><circle cx="356" cy="217" r="2" fill="#2f392b"/><ellipse cx="350" cy="224" rx="5" ry="3" fill="#f6eee0"/><text x="350" y="257" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2f432c">{dog.name}</text></g>
          </svg>
          {LOCATIONS.filter(l=>l.id!=="centre").map(l=><button key={l.id} className={"mapLocationPin "+(activeLocation===l.id?"mapLocationPinActive":"")} style={{left:l.x+"%",top:l.y+"%"}} onClick={() => {setActiveLocation(l.id);setPanel(null);}}><span className="pinCore">{l.id==="training"?<Target size={17}/>:l.id==="park"?<Dog size={17}/>:l.id==="puller"?<Award size={17}/>:<Leaf size={17}/>}</span><span className="pinLabel"><b>{l.name}</b><small>{l.sub}</small></span></button>)}
          <button className={"mapCentrePin "+(activeLocation==="centre"?"mapCentrePinActive":"")} onClick={() => {setActiveLocation("centre");setPanel(null);}}><span className="centrePinIcon"><House size={17}/></span><span><b>{t("Hlavní areál","Main grounds")}</b><small>{t("Centrum dění","Main hub")}</small></span></button>
          {selectedBuild && <div className="placementHint"><span className="placementDot"/><span>{t("Vyber volný pozemek pro", "Choose an empty plot for")} <b>{BUILDINGS.find(b=>b.type===selectedBuild)?.name}</b></span><button onClick={() => setSelectedBuild(null)} aria-label={t("Zrušit výběr","Cancel selection")}><X size={15}/></button></div>}
          <div className="mapLegend"><span><i className="legendYourLand"/> {t("Tvůj pozemek","Your land")}</span><span><i className="legendLockedLand"/> {t("K rozšíření","Available to unlock")}</span><span className="legendCount">{owned.length}/36 {t("pozemků","plots")}</span></div>
          <div className="mapCompass" aria-hidden="true"><span>N</span><div/></div>
          <div className="mapZoomControls"><button onClick={() => notify(t("Mapa je zobrazena v přehledném měřítku.", "Map is shown at overview scale."))} aria-label={t("Přiblížit mapu","Zoom map")}><Plus size={17}/></button><button onClick={() => {setActiveLocation("centre");setSelectedBuild(null);}} aria-label={t("Zobrazit celý areál","Show full grounds")}><Search size={16}/></button></div>
        </div>
        <div className="worldBottomBar"><div className="activeCompanion"><span className="companionBadge" style={{"--dog-color":dog.color} as React.CSSProperties}><Dog size={21}/></span><span><small>{t("AKTIVNÍ PARŤÁK", "ACTIVE COMPANION")}</small><b>{dog.name} <em>{dog.breed}</em></b></span><button onClick={() => setPanel("dogs")}>{t("Změnit", "Change")}</button></div><div className="quickActions"><button onClick={() => {setPanel("quests");setSidebarOpen(false);}}><Target size={17}/><span>{t("Mise", "Missions")}</span><i>{quests.filter(q=>!completed.includes(q.id)).length}</i></button><button onClick={() => {setPanel("build");setSidebarOpen(false);}}><House size={17}/><span>{t("Stavět", "Build")}</span></button><button onClick={() => {setPanel("shop");setSidebarOpen(false);}}><ShoppingBag size={17}/><span>{t("Obchod", "Shop")}</span></button><button onClick={() => claimQuest("welcome",quests[0].title,30,10)} disabled={completed.includes("welcome")}><Sparkles size={17}/><span>{completed.includes("welcome")?t("Splněno","Complete"):t("Denní úkol","Daily task")}</span></button></div></div>
        <footer className="worldFooter"><span>HODNÝ PES <i>·</i> {t("hra o důvěře a společných zážitcích", "a game about trust and shared moments")}</span><a href="https://hodnypes.cz/" target="_blank" rel="noreferrer">{t("Skutečné kurzy a výcvik", "Real training & courses")} <ArrowUpRight size={13}/></a></footer>
      </section>
    </div>
    {panel && <div className="panelBackdrop" onClick={() => {setPanel(null);setSelectedBuild(null);}}><section className="gamePanel" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><header className="panelHeader"><div><span className="panelEyebrow">HODNÝ PES · {t("CENTRUM","CENTRE")}</span><h2>{panel==="dogs"?t("Psí parťáci","Dog companions"):panel==="build"?t("Budovy a vybavení","Buildings & equipment"):panel==="quests"?t("Mise a výzvy","Missions & challenges"):panel==="map"?t("Mapa a lokace","Map & locations"):panel==="shop"?t("Výcvikový obchod","Training shop"):t("Jak hrát","How to play")}</h2></div><button className="panelClose" onClick={()=>{setPanel(null);setSelectedBuild(null);}} aria-label={t("Zavřít","Close")}><X size={20}/></button></header>
      {panel==="dogs" && <><p className="panelIntro">{t("Vyber parťáka pro dnešní dobrodružství. Každý má svůj charakter a oblíbené aktivity.", "Choose a companion for today's adventure. Each has a distinct character and favourite activities.")}</p><div className="dogRadialGrid">{DOGS.map((d,i)=><button key={d.name} className={"dogRadialChoice "+(i===activeDog?"dogRadialChoiceActive":"")} onClick={()=>{setActiveDog(i);notify(t("Tvým parťákem je ","Your companion is now ")+d.name);}}><span className="dogPortrait" style={{"--dog-color":d.color} as React.CSSProperties}><Dog size={27}/></span><b>{d.name}</b><small>{d.breed}</small><span className="dogTrait">{d.trait}</span>{i===activeDog&&<span className="selectedCheck"><Check size={14}/></span>}</button>)}</div><div className="panelCallout"><Heart size={18}/><span>{t("Pozitivní výcvik začíná důvěrou. Každý pes se učí vlastním tempem.", "Positive training starts with trust. Every dog learns at their own pace.")}</span></div></>}
      {panel==="build" && <><p className="panelIntro">{t("Vyber vybavení a pak klikni na volný pozemek na mapě. Budovy rozšiřují možnosti tvého areálu.", "Choose a facility, then click an empty owned plot on the map. Buildings expand your centre's options.")}</p><div className="facilityList">{BUILDINGS.map(b=><button key={b.type} className={"facilityRow "+(selectedBuild===b.type?"facilitySelected":"")} onClick={()=>{setSelectedBuild(b.type);setPanel(null);notify(t("Teď vyber volný pozemek na mapě.","Now choose an empty plot on the map."));}}><span className="facilityIcon" style={{background:b.color}}>{b.short}</span><span className="facilityInfo"><b>{b.name}</b><small>{t("Zařízení psího centra","Dog centre facility")}</small></span><strong><Coins size={14}/>{b.cost}</strong><ChevronRight size={16}/></button>)}</div></>}
      {panel==="quests" && <><p className="panelIntro">{t("Úkoly tě provedou areálem. Za splnění získáš Hafíky a zkušenosti.", "Quests guide you around the grounds. Complete them to earn Pawcoins and experience.")}</p><div className="questList">{quests.map(q=><article className={"questPanelRow "+(completed.includes(q.id)?"questPanelDone":"")} key={q.id}><span className="questPanelIcon">{completed.includes(q.id)?<Check size={19}/>:<Target size={19}/>}</span><div><b>{q.title}</b><p>{q.desc}</p><small>+{q.reward} {t("Hafíků","Pawcoins")} · +{q.xp} XP</small></div><button disabled={completed.includes(q.id)} onClick={()=>{if(q.id==="welcome")claimQuest(q.id,q.title,q.reward,q.xp);else {setPanel(null);setActiveLocation(q.id==="train"?"training":q.id==="garden"?"garden":q.id==="puller"?"puller":"centre");notify(t("Dokonči aktivitu v příslušné části areálu.","Complete the activity in the matching area."));}}}>{completed.includes(q.id)?t("Splněno","Done"):t("Najít","Find")}</button></article>)}</div></>}
      {panel==="map" && <><p className="panelIntro">{t("Vyber lokaci a mapa tě přenese do její části areálu. Hlavní areál je tvým výchozím bodem.", "Choose a location to focus the map. The main grounds are your starting point.")}</p><div className="locationList">{LOCATIONS.map(l=><button key={l.id} className={"locationRow "+(activeLocation===l.id?"locationRowActive":"")} onClick={()=>{setActiveLocation(l.id);setPanel(null);}}><span className="locationMarker">{l.id==="centre"?<House size={18}/>:l.id==="training"?<Target size={18}/>:l.id==="park"?<Dog size={18}/>:l.id==="puller"?<Award size={18}/>:<Leaf size={18}/>}</span><span><b>{l.name}</b><small>{l.sub}</small></span>{activeLocation===l.id?<Check size={18}/>:<ChevronRight size={17}/>}</button>)}</div><div className="panelCallout"><Map size={18}/><span>{t("Lokace jsou herní body na mapě. Kliknutím na ně přepneš aktivní oblast.", "Locations are interactive map points. Select one to focus that area.")}</span></div></>}
      {panel==="shop" && <><p className="panelIntro">{t("Vybavení v této herní ukázce představuje pomůcky pro trénink. Skutečné produkty najdeš v e-shopu Hodný pes.", "Equipment in this demo represents training tools. Find real products in the Hodný pes shop.")}</p><div className="shopFeature"><span className="shopFeatureIcon"><Bone size={30}/></span><div><span className="panelEyebrow">{t("DOPORUČENÉ VYBAVENÍ","FEATURED EQUIPMENT")}</span><h3>Dog Puller</h3><p>{t("Hra, pohyb a spolupráce se psem.", "Play, movement and teamwork with your dog.")}</p><a href="https://www.hodnypes.cz/internetovy-obchod/" target="_blank" rel="noreferrer">{t("Prohlédnout e-shop","Visit the online shop")} <ArrowUpRight size={15}/></a></div></div><div className="panelCallout"><ShoppingBag size={18}/><span>{t("Hra nenahrazuje odborný výcvik. Inspiruj se a objev skutečné možnosti centra.", "The game does not replace professional training. Explore real centre activities.")}</span></div></>}
      {panel==="help" && <div className="helpList"><p><b>{t("Mapa","Map")}</b> — {t("klikni na pozemek, budovu nebo značku lokace.","Select a plot, building or location marker.")}</p><p><b>{t("Rozšíření","Expansion")}</b> — {t("sousední pozemek stojí 100 Hafíků.","A neighbouring plot costs 100 Pawcoins.")}</p><p><b>{t("Stavění","Building")}</b> — {t("vyber budovu v nabídce a umísti ji na volné vlastní místo.","Choose a facility and place it on an empty owned plot.")}</p><p><b>{t("Psí parťáci","Companions")}</b> — {t("vyber si jednoho z pěti psích průvodců.","Choose one of five dog companions.")}</p><p><b>{t("Postup","Progress")}</b> — {t("odměny a postup se ukládají v tomto prohlížeči.","Rewards and progress save in this browser.")}</p><p><b>{t("Hodný pes","Hodný pes")}</b> — {t("skutečné kurzy a pozitivní výcvik najdeš na hodnypes.cz.","Find real courses and positive training at hodnypes.cz.")}</p></div>}
      <footer className="panelFooter"><span><Coins size={15}/> {coins.toLocaleString(language==="cs"?"cs-CZ":"en-US")} {t("Hafíků","Pawcoins")}</span><button onClick={()=>{setPanel(null);setSelectedBuild(null);}}>{t("Zpět do areálu","Back to grounds")}</button></footer>
    </section></div>}
    {toast && <div className="gameToast"><span className="toastMark"><Check size={15}/></span>{toast}</div>}
  </main>;
}
