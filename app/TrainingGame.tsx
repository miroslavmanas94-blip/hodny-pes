"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, Bone, CheckCircle2, ChevronRight, CircleHelp, Coins, Dog, Footprints, Heart, Home, Map as MapIcon, MapPin, Pause, Play, RotateCcw, Star, Target, Trophy, X } from "lucide-react";
import "./training-game.css";

type Place = "centrum" | "mesto" | "priroda" | "hala" | "domov";
type Activity = "obedience" | "agility" | "nosework" | "quiz" | "recall" | "puller" | "tricks";
type SkillSet = Record<Activity, number>;
type Save = { xp:number; coins:number; bond:number; energy:number; level:number; completed:number; attempts:number; correct:number; streak:number; skills:SkillSet; unlocked:string[]; dog:string; place:Place; dailyDone:boolean };
type Task = { id:Activity; title:string; desc:string; x:number; y:number; icon:string; place:Place[] };
const initialSkills:SkillSet={obedience:0,agility:0,nosework:0,quiz:0,recall:0,puller:0,tricks:0};
const initialSave:Save={xp:0,coins:100,bond:20,energy:100,level:1,completed:0,attempts:0,correct:0,streak:0,skills:initialSkills,unlocked:["Monty"],dog:"Monty",place:"centrum",dailyDone:false};
const places:{id:Place;name:string;subtitle:string;emoji:string}[]=[
 {id:"centrum",name:"Výcvikové centrum",subtitle:"Poslušnost a hlavní mise",emoji:"🏡"},
 {id:"mesto",name:"Městský park",subtitle:"Rozptýlení a přivolání",emoji:"🌳"},
 {id:"priroda",name:"Lesní stezka",subtitle:"Pachové stopy a průzkum",emoji:"🌲"},
 {id:"hala",name:"Vnitřní hala",subtitle:"Agility a Dog Puller",emoji:"🏟️"},
 {id:"domov",name:"Domov a zahrada",subtitle:"Triky a klidný trénink",emoji:"🏠"}
];
const tasks:Task[]=[
 {id:"obedience",title:"Poslušnost",desc:"Proveď povely ve správném pořadí",x:25,y:32,icon:"🎯",place:["centrum","domov"]},
 {id:"recall",title:"Přivolání",desc:"Vyčkej na správný okamžik a přivolej psa",x:72,y:35,icon:"📣",place:["centrum","mesto"]},
 {id:"nosework",title:"Čichací stopa",desc:"Najdi správný pach mezi možnostmi",x:30,y:68,icon:"👃",place:["priroda","centrum"]},
 {id:"agility",title:"Agility",desc:"Zapamatuj si a projdi trasu",x:72,y:69,icon:"🏁",place:["hala","centrum"]},
 {id:"puller",title:"Dog Puller",desc:"Vyber správné chycení a vrať kruh",x:51,y:52,icon:"⭕",place:["hala","priroda"]},
 {id:"tricks",title:"Triky",desc:"Zopakuj krátkou pohybovou sekvenci",x:48,y:28,icon:"✨",place:["domov","centrum"]},
 {id:"quiz",title:"Kvíz trenéra",desc:"Rozhodni, jak psa učit bezpečně a férově",x:52,y:76,icon:"🧠",place:["centrum","mesto","priroda","hala","domov"]}
];
const quizQuestions=[
 {q:"Pes si při přivolání nevšímá povelu. Co uděláš?",a:["Zvýším hlas a potrestám ho","Zjednoduším situaci, přivolám v lehčím prostředí a odměním návrat","Budu ho honit"],correct:1,why:"Trénink začíná v prostředí, kde pes uspěje. Návrat má být bezpečný a výhodný."},
 {q:"Jak nejlépe učit nový povel?",a:["Krátké kroky a odměna za správné chování","Opakovat povel stále rychleji","Cvičit bez přestávky"],correct:0,why:"Krátké lekce a přesné odměňování pomáhají psovi pochopit, co se od něj čeká."},
 {q:"Pes během tréninku zívá, odvrací hlavu a odchází. Co je rozumné?",a:["Zvýšit náročnost","Ignorovat všechny signály","Dát pauzu a snížit obtížnost"],correct:2,why:"Pauza a menší nároky pomáhají udržet trénink bezpečný a příjemný."},
 {q:"Kdy je vhodné psa odměnit?",a:["Co nejblíže okamžiku správného chování","Až za několik minut","Jen na konci týdne"],correct:0,why:"Včasná odměna psovi usnadňuje spojit si ji s konkrétním chováním."}
];
const commands=["Sedni","Zůstaň","Ke mně"];
const routes=[["↑","→","↓"],["←","↑","→"],["↑","↑","←"]];
const trickRoutes=[["→","↑","←"],["↑","↓","→"],["←","→","↑"]];
const labels:Record<Activity,string>={obedience:"Poslušnost",agility:"Agility",nosework:"Čichání",quiz:"Kvíz",recall:"Přivolání",puller:"Dog Puller",tricks:"Triky"};

export default function TrainingGame(){
 const [save,setSave]=useState<Save>(initialSave);
 const [loaded,setLoaded]=useState(false);
 const [player,setPlayer]=useState({x:50,y:88});
 const [game,setGame]=useState<Activity|null>(null);
 const [round,setRound]=useState(0);
 const [errors,setErrors]=useState(0);
 const [sequence,setSequence]=useState<string[]>([]);
 const [step,setStep]=useState(0);
 const [feedback,setFeedback]=useState("");
 const [finished,setFinished]=useState(false);
 const [quizIndex,setQuizIndex]=useState(0);
 const [quizScore,setQuizScore]=useState(0);
 const [scentTarget,setScentTarget]=useState(1);
 const [recallReady,setRecallReady]=useState(false);
 const [pullerTarget,setPullerTarget]=useState(2);
 const [notice,setNotice]=useState("");
 const [photoMode,setPhotoMode]=useState(false);
 const [showStats,setShowStats]=useState(false);
 const level=Math.floor(save.xp/100)+1;
 const place=places.find(p=>p.id===save.place)!;
 const visibleTasks=tasks.filter(t=>t.place.includes(save.place));
 const accuracy=save.attempts?Math.round(save.correct/save.attempts*100):0;
 useEffect(()=>{try{const raw=localStorage.getItem("hodny-pes-training-save-v3");if(raw){const p=JSON.parse(raw) as Partial<Save>;setSave({...initialSave,...p,skills:{...initialSkills,...p.skills},unlocked:Array.isArray(p.unlocked)?p.unlocked:["Monty"]});if(p.place)setPlayer({x:50,y:88});}}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem("hodny-pes-training-save-v3",JSON.stringify(save))}catch{}}},[save,loaded]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(game||photoMode||showStats)return;const k=e.key.toLowerCase();const d=12;if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(k)){e.preventDefault();setPlayer(p=>({x:Math.max(7,Math.min(93,p.x+((k==="arrowleft"||k==="a")?-d:(k==="arrowright"||k==="d")?d:0)),y:Math.max(10,Math.min(91,p.y+((k==="arrowup"||k==="w")?-d:(k==="arrowdown"||k==="s")?d:0)))}));}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[game,photoMode,showStats]);
 const move=useCallback((dx:number,dy:number)=>setPlayer(p=>({x:Math.max(7,Math.min(93,p.x+dx)),y:Math.max(10,Math.min(91,p.y+dy))})),[]);
 const startGame=(id:Activity)=>{setGame(id);setRound(0);setErrors(0);setStep(0);setFeedback("");setFinished(false);setQuizIndex(Math.floor(Math.random()*quizQuestions.length));setQuizScore(0);setScentTarget(Math.floor(Math.random()*3));setPullerTarget(Math.floor(Math.random()*3));setRecallReady(false);setSequence(id==="agility"?routes[Math.floor(Math.random()*routes.length)]:id==="tricks"?trickRoutes[Math.floor(Math.random()*trickRoutes.length)]:[]);};
 const finishGame=(score:number,total:number)=>{const pct=Math.max(0,Math.round(score/total*100));const earned=Math.max(5,Math.round(pct/5));const coins=Math.max(3,Math.round(pct/10)+5);setSave(s=>({...s,xp:s.xp+earned,coins:s.coins+coins,bond:Math.min(100,s.bond+(pct>=60?3:1)),energy:Math.max(0,s.energy-8),completed:s.completed+1,attempts:s.attempts+total,correct:s.correct+score,streak:pct>=70?s.streak+1:0,dailyDone:true,skills:{...s.skills,[game!]:Math.min(100,(s.skills[game!]||0)+Math.max(2,Math.round(pct/10))}}));setFeedback("Trénink dokončen: "+pct+" % · +"+earned+" XP · +"+coins+" Hafíků");setFinished(true);};
 const answerCommand=(answer:string)=>{const expected=commands[step];if(answer===expected){const next=step+1;setStep(next);setFeedback("Správně! Pes reaguje na povel.");if(next>=commands.length)finishGame(commands.length,commands.length+errors)}else{setErrors(e=>e+1);setFeedback("To nebyl další povel v pořadí. Zkus se soustředit a pokračuj.");}};
 const answerRoute=(direction:string)=>{if(direction===sequence[step]){const next=step+1;setStep(next);setFeedback("Správný směr!");if(next>=sequence.length)finishGame(sequence.length,sequence.length+errors)}else{setErrors(e=>e+1);setFeedback("Špatná odbočka. Trasa pokračuje — zkus další směr.");setStep(s=>Math.min(sequence.length-1,s+1));}};
 const answerQuiz=(index:number)=>{const q=quizQuestions[quizIndex];const ok=index===q.correct;const nextScore=quizScore+(ok?1:0);const nextRound=round+1;setQuizScore(nextScore);setRound(nextRound);setFeedback(ok?"Správně. "+q.why:"Ještě ne. "+q.why);if(!ok)setErrors(e=>e+1);if(nextRound>=3){finishGame(nextScore,3+errors+(ok?0:1))}else{setTimeout(()=>{setQuizIndex(i=>(i+1)%quizQuestions.length);setFeedback("")},900)}};
 const closeGame=()=>{setGame(null);setFeedback("");setFinished(false)};
 const setPlace=(p:Place)=>{setSave(s=>({...s,place:p}));setPlayer({x:50,y:88});setNotice("Přesunul ses: "+places.find(x=>x.id===p)?.name);};
 const reset=()=>{setSave(initialSave);setPlayer({x:50,y:88});setNotice("Postup byl resetován.");};
 return <main className="hpGame">
  <header className="hpTop"><div className="hpBrand"><span className="hpLogo"><Dog size={25}/></span><span><b>Hodný pes</b><small>PSÍ DOBRODRUŽSTVÍ</small></span></div><div className="hpPlace"><MapPin size={16}/>{place.name}</div><div className="hpCurrencies"><span><Coins size={16}/>{save.coins}</span><span><Star size={16}/>Úroveň {level}</span></div></header>
  <section className="hpHero"><div><span className="hpEyebrow">TVŮJ PSÍ TÝM · DEN {Math.max(1,save.completed+1)}</span><h1>Každý trénink<br/><em>posouvá dál.</em></h1><p>Veď psa světem, plň opravdové minihry a sleduj, jak roste vaše spolupráce.</p><div className="hpHeroActions"><button className="hpPrimary" onClick={()=>startGame(visibleTasks[0]?.id||"obedience")}><Play size={17}/> Pokračovat v tréninku</button><button className="hpSecondary" onClick={()=>setShowStats(true)}><Award size={17}/> Můj progres</button></div></div><div className="hpDogArt" aria-label="Pes a psovod"><div className="hpSun"/><span className="hpArtTree treeA">🌳</span><span className="hpArtTree treeB">🌲</span><span className="hpArtPerson">🧍</span><span className="hpArtDog">🐕</span><span className="hpArtGround"/></div></section>
  <div className="hpStatusGrid"><article><span><Star size={17}/> Zkušenosti</span><b>{save.xp} XP</b><div className="hpProgress"><i style={{width:(save.xp%100)+"%"}}/></div><small>{save.xp%100}/100 do další úrovně</small></article><article><span><Heart size={17}/> Důvěra</span><b>{save.bond}%</b><div className="hpProgress"><i style={{width:save.bond+"%"}}/></div><small>Buduje se spoluprací a pauzami</small></article><article><span><Footprints size={17}/> Energie psa</span><b>{save.energy}%</b><div className="hpProgress"><i style={{width:save.energy+"%"}}/></div><button className="hpTextButton" onClick={()=>setSave(s=>({...s,energy:Math.min(100,s.energy+20),bond:Math.min(100,s.bond+1)}))}>Dopřát odpočinek +20</button></article><article><span><Target size={17}/> Přesnost</span><b>{accuracy}%</b><div className="hpProgress"><i style={{width:accuracy+"%"}}/></div><small>{save.correct}/{save.attempts} správných odpovědí</small></article></div>
  <section className="hpWorldSection"><div className="hpSectionHeading"><div><span className="hpEyebrow">PROZKOUMÁVEJ A TRÉNUJ</span><h2>Tvůj psí svět</h2><p>Pohybuj se klávesami WASD nebo šipkami. Přijdi k aktivitě a začni trénovat.</p></div><button className="hpSecondary" onClick={()=>setPhotoMode(true)}>📸 Fotorežim</button></div>
   <div className={"hpWorld hpWorld-"+save.place}><div className="hpWorldSun"/><div className="hpPath pathOne"/><div className="hpPath pathTwo"/><div className="hpWorldDecor decorOne">🌳</div><div className="hpWorldDecor decorTwo">🌲</div><div className="hpWorldDecor decorThree">🌿</div><div className="hpWorldDecor decorFour">🌳</div><div className="hpWorldBuilding">{place.emoji}</div>
    {visibleTasks.map(t=><button key={t.id} className="hpWorldTask" style={{left:t.x+"%",top:t.y+"%"}} onClick={()=>{setPlayer({x:t.x,y:Math.min(88,t.y+12)});startGame(t.id)}}><span>{t.icon}</span><b>{t.title}</b><small>Spustit minihru ↗</small></button>)}
    <div className="hpPlayer" style={{left:player.x+"%",top:player.y+"%"}}><span>🧍</span><b>Ty</b></div><div className="hpWorldDog" style={{left:Math.min(92,player.x+5)+"%",top:Math.min(90,player.y+2)+"%"}}>🐕<small>{save.dog}</small></div>
    <div className="hpMovement"><button onClick={()=>move(0,-6)} aria-label="Nahoru">↑</button><div><button onClick={()=>move(-6,0)} aria-label="Doleva">←</button><button onClick={()=>move(0,6)} aria-label="Dolů">↓</button><button onClick={()=>move(6,0)} aria-label="Doprava">→</button></div></div><div className="hpWorldHint"><Footprints size={15}/> WASD / šipky · pohyb postavy</div>
   </div>
   <div className="hpPlaces">{places.map(p=><button key={p.id} className={save.place===p.id?"active":""} onClick={()=>setPlace(p.id)}><span>{p.emoji}</span><b>{p.name}</b><small>{p.subtitle}</small><ChevronRight size={16}/></button>)}</div>
  </section>
  <section className="hpActivities"><div className="hpSectionHeading"><div><span className="hpEyebrow">SEDM DISCIPLÍN</span><h2>Vyber si trénink</h2><p>Každá disciplína má vlastní pravidla a samostatný progres.</p></div></div><div className="hpActivityGrid">{tasks.map(t=><button key={t.id} className="hpActivityCard" onClick={()=>startGame(t.id)}><span className="hpActivityIcon">{t.icon}</span><span><b>{t.title}</b><small>{t.desc}</small><em>Dovednost {save.skills[t.id]} / 100</em><i><u style={{width:save.skills[t.id]+"%"}}/></i></span><ChevronRight size={18}/></button>)}</div></section>
  <section className="hpBottomGrid"><article className="hpPanel"><div className="hpPanelTitle"><Trophy size={19}/><h3>Tvůj pokrok</h3><button onClick={()=>setShowStats(true)}>Detail</button></div><div className="hpStatLine"><span>Dokončené tréninky</span><b>{save.completed}</b></div><div className="hpStatLine"><span>Nejlepší série</span><b>{save.streak}</b></div><div className="hpStatLine"><span>Úroveň psa</span><b>{Math.floor(save.xp/150)+1}</b></div><div className="hpStatLine"><span>Odemčené plemeno</span><b>{save.unlocked.length}</b></div></article><article className="hpPanel"><div className="hpPanelTitle"><Target size={19}/><h3>Dnešní výzva</h3></div><p>Dokonči libovolnou minihru. Výsledek se započítá do statistik.</p><div className="hpDailyRow"><span>{save.dailyDone?"✓ Výzva splněna":"🎯 Jedna tréninková lekce"}</span><button disabled={save.dailyDone} onClick={()=>startGame("quiz")}>{save.dailyDone?"Hotovo":"Začít"}</button></div><button className="hpReset" onClick={reset}><RotateCcw size={14}/> Resetovat místní postup</button></article></section>
  <footer className="hpFooter">Hodný pes: Psí dobrodružství <span>Trénuj s respektem. Odměňuj pokrok. Dopřej pauzu.</span></footer>
  {notice&&<button className="hpNotice" onClick={()=>setNotice("")}>{notice} <X size={14}/></button>}
  {game&&<div className="hpModalBackdrop"><section className="hpGameModal" role="dialog" aria-modal="true"><header><div><small>MINIHRA · {place.name.toUpperCase()}</small><h2>{labels[game]}</h2></div><button onClick={closeGame} aria-label="Zavřít"><X/></button></header>
   {finished?<div className="hpResult"><div className="hpResultIcon"><Trophy size={35}/></div><h3>Skvělá práce!</h3><p>{feedback}</p><div className="hpResultStats"><span>Chyby <b>{errors}</b></span><span>Celkem pokusů <b>{Math.max(1,round+1+errors)}</b></span><span>Nová dovednost <b>{Math.min(100,save.skills[game]+Math.max(2,Math.round(10-errors*2)))}</b></span></div><button className="hpPrimary" onClick={closeGame}>Pokračovat ve světě <ChevronRight size={17}/></button></div>
   :<div className="hpMiniContent">
    {game==="obedience"&&<><p className="hpInstruction">Pes se učí krátkou sestavu. Vyber povely v pořadí, ve kterém se zobrazují.</p><div className="hpSequence">{commands.map((c,i)=><span className={i<step?"done":i===step?"current":""} key={c}>{i<step?"✓":i+1}<small>{c}</small></span>)}</div><div className="hpChoiceGrid">{["Sedni","Lehni","Zůstaň","Ke mně"].map(c=><button key={c} onClick={()=>{if(c===commands[step]){const n=step+1;setStep(n);setFeedback("Správný povel — pes reaguje.");if(n===commands.length)finishGame(Math.max(0,commands.length-errors),commands.length)}else{setErrors(e=>e+1);setFeedback("Tento povel teď není v sestavě. Zkus další možnost.")}}}>{c}</button>)}</div></>}
    {game==="agility"&&<><p className="hpInstruction">Zapamatuj si trasu a zadej směry v pořadí. Každá správná volba tě posune k další překážce.</p><div className="hpRoute">{sequence.map((v,i)=><span className={i<step?"done":i===step?"current":""} key={i}>{i<step?"✓":v}</span>)}</div><div className="hpChoiceGrid hpArrows">{["↑","←","→","↓"].map(a=><button key={a} onClick={()=>answerRoute(a)}>{a}</button>)}</div></>}
    {game==="nosework"&&<><p className="hpInstruction">Ve kterém boxu je hledaný pach? Sleduj indicii, vyber jeden ze tří boxů a zkus to bez hádání.</p><div className="hpScentClue">🔎 Hledáš: <b>pach skořice</b></div><div className="hpChoiceGrid hpBoxes">{["📦 Box A","📦 Box B","📦 Box C"].map((b,i)=><button key={b} onClick={()=>{const ok=i===scentTarget;setRound(r=>r+1);if(ok){setFeedback("Pes označil správný box!");finishGame(1,1)}else{setErrors(e=>e+1);setFeedback("Tady hledaný pach není. Zkus další stopu.");setScentTarget((scentTarget+1)%3)}}}>{b}</button>)}</div><small className="hpMiniHint">Pachová práce je o hledání, ne o rychlosti.</small></>}
    {game==="quiz"&&<><p className="hpInstruction">Kvíz trenéra · otázka {round+1} ze 3</p><div className="hpQuizQuestion">{quizQuestions[quizIndex].q}</div><div className="hpQuizAnswers">{quizQuestions[quizIndex].a.map((a,i)=><button key={a} onClick={()=>answerQuiz(i)}>{String.fromCharCode(65+i)}. {a}</button>)}</div></>}
    {game==="recall"&&<><p className="hpInstruction">Přivolání se trénuje bezpečně. Nejprve vyčkej, až se pes na chvíli zabaví podnětem, pak ho přivolej.</p><div className="hpRecallScene"><span>🐕</span><span>🦋</span><span>🧍</span></div>{!recallReady?<button className="hpPrimary full" onClick={()=>{setRecallReady(true);setFeedback("Pes zpozorněl u motýla. Teď ho přivolej jasným povelem.")}}>Počkat na rozptýlení</button>:<button className="hpPrimary full" onClick={()=>finishGame(1,1)}>📣 Ke mně!</button>}{feedback&&<p className="hpFeedback">{feedback}</p>}</>}
    {game==="puller"&&<><p className="hpInstruction">Zvol správnou techniku. V této výzvě se počítá bezpečné chycení a návrat ke psovodovi.</p><div className="hpPullerRing">⭕</div><div className="hpChoiceGrid">{["Chytit za pohybu","Vrhni se bez rozběhu","Vrať kruh a udělej pauzu"].map((a,i)=><button key={a} onClick={()=>{const ok=i===2;if(ok)finishGame(1,1);else{setErrors(e=>e+1);setFeedback("Nejdřív kontrolovaný návrat a pauza. Zkus znovu.")}}}>{a}</button>)}</div></>}
    {game==="tricks"&&<><p className="hpInstruction">Nauč se krátkou sestavu pohybů. Zadej šipky ve správném pořadí.</p><div className="hpRoute">{sequence.map((v,i)=><span className={i<step?"done":i===step?"current":""} key={i}>{i<step?"✓":v}</span>)}</div><div className="hpChoiceGrid hpArrows">{["↑","←","→","↓"].map(a=><button key={a} onClick={()=>answerRoute(a)}>{a}</button>)}</div></>}
    {feedback&&!finished&&<p className="hpFeedback">{feedback}</p>}
    <div className="hpMiniFooter"><span>🐾 {save.dog} · Důvěra {save.bond}%</span><button onClick={()=>{setErrors(0);setStep(0);setRound(0);setFeedback("");setFinished(false);startGame(game)}}>Restartovat</button></div>
   </div>}
  </section></div>}
  {showStats&&<div className="hpModalBackdrop"><section className="hpStatsModal" role="dialog" aria-modal="true"><header><div><small>TVŮJ TÝM</small><h2>Statistiky a dovednosti</h2></div><button onClick={()=>setShowStats(false)}><X/></button></header><div className="hpStatsSummary"><article><b>{save.xp}</b><small>Celkem XP</small></article><article><b>{accuracy}%</b><small>Přesnost</small></article><article><b>{save.completed}</b><small>Tréninky</small></article><article><b>{save.bond}%</b><small>Důvěra</small></article></div>{Object.entries(save.skills).map(([id,v])=><div className="hpSkillRow" key={id}><span>{labels[id as Activity]}</span><div className="hpProgress"><i style={{width:v+"%"}}/></div><b>{v}/100</b></div>)}<div className="hpDogSelect"><span>Aktivní pes: <b>{save.dog}</b></span>{["Monty","Bety","Rex","Luna"].map((d,i)=><button key={d} disabled={i>0&&save.level<i*3+1&&!save.unlocked.includes(d)} onClick={()=>setSave(s=>({...s,dog:d,unlocked:s.unlocked.includes(d)?s.unlocked:[...s.unlocked,d]}))}>{d}{save.dog===d?" ✓":""}{i>0&&!save.unlocked.includes(d)?" 🔒":""}</button>)}</div><button className="hpPrimary full" onClick={()=>setShowStats(false)}>Zpět do hry</button></section></div>}
  {photoMode&&<div className="hpPhotoMode"><button onClick={()=>setPhotoMode(false)}><X/> Zavřít fotorežim</button><div><span>🧍</span><span>🐕</span><h2>{save.dog} a jeho parťák</h2><p>{place.name} · Úroveň {level} · Důvěra {save.bond}%</p></div><small>Tip: pořiď snímek obrazovky pro uložení vzpomínky.</small></div>}
 </main>;
}
