"use client";

import { useState } from "react";
import {
  Award, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Coins, Dog,
  Fence, Flower2, Footprints, Hammer, Heart, House, LockKeyhole, MapPin,
  Medal, PawPrint, Sparkles, Star, Trees, Trophy, X, Zap
} from "lucide-react";

type HubTab = "missions" | "academy" | "collection" | "events";
type HubSave = {
  coins: number;
  xp: number;
  completed: number;
  bond: number;
  energy: number;
  decorations?: string[];
  unlocked?: string[];
  badges?: string[];
  academyLevel?: number;
  academyUpgrades?: string[];
  claimedGoals?: string[];
};
type Props = {
  open: boolean;
  initialTab: HubTab;
  save: HubSave;
  onClose: () => void;
  onSave: (patch: Partial<HubSave>) => void;
  onStartTraining: () => void;
  onOpenDogs: () => void;
  onOpenShop: () => void;
};

const academyOptions = [
  { id: "garden", name: "Zahrada pro trénink", detail: "Více prostoru pro společné hry a průzkum.", cost: 150, icon: Trees },
  { id: "course", name: "Rozšířené cvičiště", detail: "Nové možnosti pro poslušnost a pohybové výzvy.", cost: 260, icon: Fence },
  { id: "rest", name: "Klidová zóna", detail: "Pohodlné místo pro odpočinek a péči.", cost: 340, icon: House },
  { id: "flowers", name: "Květinový vstup", detail: "Zútulní vstup do akademie.", cost: 420, icon: Flower2 },
];

const dailyGoals = [
  { id: "first-training", title: "První společný trénink", detail: "Dokonči alespoň jednu aktivitu.", reward: 35, icon: Footprints, progress: (s: HubSave) => Math.min(1, s.completed), target: 1, ready: (s: HubSave) => s.completed >= 1 },
  { id: "bond-35", title: "Buduj důvěru", detail: "Získej se psem důvěru alespoň 35.", reward: 30, icon: Heart, progress: (s: HubSave) => Math.min(35, s.bond), target: 35, ready: (s: HubSave) => s.bond >= 35 },
  { id: "xp-100", title: "Malé kroky, velký pokrok", detail: "Nasbírej 100 zkušeností.", reward: 40, icon: Star, progress: (s: HubSave) => Math.min(100, s.xp), target: 100, ready: (s: HubSave) => s.xp >= 100 },
  { id: "collect-one", title: "První vybavení", detail: "Získej do sbírky alespoň jeden předmět.", reward: 25, icon: Sparkles, progress: (s: HubSave) => Math.min(1, (s.decorations || []).length), target: 1, ready: (s: HubSave) => (s.decorations || []).length >= 1 },
];

const eventGoals = [
  { id: "event-training-3", title: "Tři kroky vpřed", detail: "Dokonči celkem tři tréninky.", reward: 70, icon: Trophy, ready: (s: HubSave) => s.completed >= 3, progress: (s: HubSave) => Math.min(3, s.completed), target: 3 },
  { id: "event-two-dogs", title: "Rozrůstající se smečka", detail: "Odemkni alespoň dva psí parťáky.", reward: 60, icon: Dog, ready: (s: HubSave) => (s.unlocked || ["Monty"]).length >= 2, progress: (s: HubSave) => Math.min(2, (s.unlocked || ["Monty"]).length), target: 2 },
  { id: "event-academy-two", title: "Akademie roste", detail: "Vylepši akademii alespoň jednou.", reward: 80, icon: House, ready: (s: HubSave) => (s.academyLevel || 1) >= 2, progress: (s: HubSave) => Math.min(2, s.academyLevel || 1), target: 2 },
];

function localDayKey() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

export default function AcademyHub({ open, initialTab, save, onClose, onSave, onStartTraining, onOpenDogs, onOpenShop }: Props) {
  const [tab, setTab] = useState<HubTab>(initialTab);
  if (!open) return null;

  const claimed = save.claimedGoals || [];
  const upgrades = save.academyUpgrades || [];
  const decorations = save.decorations || [];
  const day = localDayKey();
  const claimReward = (id: string, reward: number, daily = false) => {
    const key = daily ? day + ":" + id : "event:" + id;
    if (claimed.includes(key) || save.coins < 0) return;
    onSave({ coins: save.coins + reward, claimedGoals: [...claimed, key] });
  };
  const buyUpgrade = (id: string, cost: number) => {
    if (upgrades.includes(id) || save.coins < cost) return;
    const next = [...upgrades, id];
    onSave({ coins: save.coins - cost, academyUpgrades: next, academyLevel: Math.min(5, 1 + next.length) });
  };

  const tabs: { id: HubTab; label: string; icon: typeof BookOpen }[] = [
    { id: "missions", label: "Mise", icon: BookOpen },
    { id: "academy", label: "Akademie", icon: House },
    { id: "collection", label: "Sbírka", icon: Medal },
    { id: "events", label: "Výzvy", icon: CalendarDays },
  ];

  return (
    <div className="hpModalBackdrop hpHubBackdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="hpHubModal" role="dialog" aria-modal="true" aria-labelledby="hpHubTitle">
        <header className="hpHubHeader">
          <span className="hpHubMark"><PawPrint size={22} /></span>
          <div><small>HODNÝ PES · TVŮJ POSTUP</small><h2 id="hpHubTitle">Akademie a dobrodružství</h2></div>
          <div className="hpHubBalance"><Coins size={15} /> {save.coins}</div>
          <button className="hpHubClose" onClick={onClose} aria-label="Zavřít přehled"><X size={19} /></button>
        </header>
        <nav className="hpHubTabs" aria-label="Přehled hry">
          {tabs.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon size={17} /><span>{item.label}</span></button>; })}
        </nav>
        <div className="hpHubBody">
          {tab === "missions" && <div className="hpHubSection">
            <div className="hpHubIntro"><span className="hpHubEyebrow">DNEŠNÍ CÍLE</span><h3>Každý malý krok se počítá.</h3><p>Plň krátké úkoly během hraní. Odměny získáš za skutečný pokrok, ne pouhým otevřením nabídky.</p></div>
            <div className="hpHubGoalList">{dailyGoals.map(goal => {
              const Icon = goal.icon; const key = day + ":" + goal.id; const isClaimed = claimed.includes(key); const ready = goal.ready(save); const progress = goal.progress(save);
              return <article className={"hpHubGoal" + (isClaimed ? " claimed" : "")} key={goal.id}><span className="hpHubGoalIcon"><Icon size={20} /></span><div className="hpHubGoalCopy"><b>{goal.title}</b><p>{goal.detail}</p><div className="hpHubProgress"><i style={{ width: Math.min(100, progress / goal.target * 100) + "%" }} /></div><small>{progress} / {goal.target}</small></div><button disabled={!ready || isClaimed} onClick={() => claimReward(goal.id, goal.reward, true)}>{isClaimed ? <><CheckCircle2 size={15} /> Vybráno</> : <><Coins size={14} /> {goal.reward}</>}</button></article>;
            })}</div>
            <button className="hpHubPrimary" onClick={onStartTraining}><Footprints size={17} /> Začít trénink <ChevronRight size={17} /></button>
          </div>}
          {tab === "academy" && <div className="hpHubSection">
            <div className="hpHubIntro"><span className="hpHubEyebrow">VYBUDUJ SI SVÉ MÍSTO</span><h3>Malá akademie, velké plány.</h3><p>Vylepšuj areál za mince získané hraním. Nákupy jsou čistě herní a nevyžadují skutečné peníze.</p></div>
            <div className="hpHubAcademyCard"><div className="hpHubAcademyArt"><House size={35} /><span>ÚROVEŇ {save.academyLevel || 1}</span></div><div><b>Psí akademie</b><p>{upgrades.length} ze {academyOptions.length} vylepšení odemčeno</p><div className="hpHubProgress"><i style={{ width: upgrades.length / academyOptions.length * 100 + "%" }} /></div></div></div>
            <div className="hpHubUpgradeList">{academyOptions.map(item => { const Icon = item.icon; const owned = upgrades.includes(item.id); return <article className={"hpHubUpgrade" + (owned ? " owned" : "")} key={item.id}><span className="hpHubUpgradeIcon"><Icon size={22} /></span><div><b>{item.name}</b><p>{item.detail}</p><small>{owned ? "Součást akademie" : "Vylepšení areálu"}</small></div><button disabled={owned || save.coins < item.cost} onClick={() => buyUpgrade(item.id, item.cost)}>{owned ? <><CheckCircle2 size={15} /> Hotovo</> : <><Coins size={14} /> {item.cost}</>}</button></article>; })}</div>
            <button className="hpHubSecondary" onClick={onOpenShop}><Sparkles size={17} /> Prohlédnout dekorace a vybavení</button>
          </div>}
          {tab === "collection" && <div className="hpHubSection">
            <div className="hpHubIntro"><span className="hpHubEyebrow">TVÉ OBJEVY</span><h3>Sbírej vzpomínky i úspěchy.</h3><p>Každý odznak připomíná, co už jste spolu zvládli. Další předměty získáš tréninkem a rozvojem akademie.</p></div>
            <div className="hpHubCollectionStats"><article><Dog size={21} /><b>{(save.unlocked || ["Monty"]).length}</b><span>Psí parťáci</span></article><article><Sparkles size={21} /><b>{decorations.length}</b><span>Předměty</span></article><article><Award size={21} /><b>{(save.badges || []).length}</b><span>Odznaky</span></article><article><Star size={21} /><b>{save.xp}</b><span>Zkušenosti</span></article></div>
            <div className="hpHubCollectionList"><div><span><Dog size={17} /></span><div><b>Psí tým</b><small>{(save.unlocked || ["Monty"]).join(" · ")}</small></div><button onClick={onOpenDogs}>Otevřít <ChevronRight size={15} /></button></div><div><span><Sparkles size={17} /></span><div><b>Dekorace a vybavení</b><small>{decorations.length ? decorations.join(" · ") : "Zatím nic ve sbírce"}</small></div><button onClick={onOpenShop}>Obchod <ChevronRight size={15} /></button></div><div><span><Award size={17} /></span><div><b>Odznaky</b><small>{(save.badges || []).length ? (save.badges || []).join(" · ") : "Dokonči výzvy a tréninky"}</small></div></div></div>
          </div>}
          {tab === "events" && <div className="hpHubSection">
            <div className="hpHubIntro"><span className="hpHubEyebrow">AKADEMICKÉ VÝZVY</span><h3>Dokážeš to společně?</h3><p>Trvalé výzvy jsou dostupné kdykoli. Online soutěže a časově omezené akce přijdou až po zavedení ověřeného serverového systému.</p></div>
            <div className="hpHubGoalList">{eventGoals.map(goal => { const Icon = goal.icon; const key = "event:" + goal.id; const isClaimed = claimed.includes(key); const ready = goal.ready(save); const progress = goal.progress(save); return <article className={"hpHubGoal" + (isClaimed ? " claimed" : "")} key={goal.id}><span className="hpHubGoalIcon"><Icon size={20} /></span><div className="hpHubGoalCopy"><b>{goal.title}</b><p>{goal.detail}</p><div className="hpHubProgress"><i style={{ width: Math.min(100, progress / goal.target * 100) + "%" }} /></div><small>{progress} / {goal.target}</small></div><button disabled={!ready || isClaimed} onClick={() => claimReward(goal.id, goal.reward)}>{isClaimed ? <><CheckCircle2 size={15} /> Vybráno</> : <><Coins size={14} /> {goal.reward}</>}</button></article>; })}</div>
          </div>}
        </div>
        <footer className="hpHubFooter"><span><Zap size={15} /> Energie {save.energy}%</span><span><Heart size={15} /> Důvěra {save.bond}%</span><span><MapPin size={15} /> Úroveň {Math.floor(save.xp / 100) + 1}</span></footer>
      </section>
    </div>
  );
}
