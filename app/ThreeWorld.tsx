"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
type Point={x:number;y:number};
type Place="centrum"|"mesto"|"priroda"|"hala"|"domov"|"jezero"|"vesnice"|"hory";
type Find={id:string;place:Place;x:number;y:number;kind:"leaf"|"shell"|"medal";};
type Station={id:string;title:string;x:number;y:number;symbol:string};
const finds:Find[]=[
{id:"c_leaf",place:"centrum",x:36,y:38,kind:"leaf"},{id:"c_medal",place:"centrum",x:64,y:57,kind:"medal"},{id:"c_shell",place:"centrum",x:43,y:83,kind:"shell"},
{id:"m_leaf",place:"mesto",x:29,y:31,kind:"leaf"},{id:"m_medal",place:"mesto",x:69,y:61,kind:"medal"},{id:"m_shell",place:"mesto",x:42,y:82,kind:"shell"},
{id:"f_leaf",place:"priroda",x:31,y:29,kind:"leaf"},{id:"f_medal",place:"priroda",x:72,y:46,kind:"medal"},{id:"f_shell",place:"priroda",x:48,y:81,kind:"shell"},
{id:"h_leaf",place:"hala",x:32,y:35,kind:"leaf"},{id:"h_medal",place:"hala",x:69,y:56,kind:"medal"},{id:"h_shell",place:"hala",x:46,y:81,kind:"shell"},
{id:"d_leaf",place:"domov",x:34,y:36,kind:"leaf"},{id:"d_medal",place:"domov",x:70,y:56,kind:"medal"},{id:"d_shell",place:"domov",x:45,y:82,kind:"shell"},
{id:"l_leaf",place:"jezero",x:33,y:30,kind:"leaf"},{id:"l_medal",place:"jezero",x:71,y:55,kind:"medal"},{id:"l_shell",place:"jezero",x:46,y:82,kind:"shell"},
{id:"v_leaf",place:"vesnice",x:32,y:31,kind:"leaf"},{id:"v_medal",place:"vesnice",x:71,y:58,kind:"medal"},{id:"v_shell",place:"vesnice",x:46,y:82,kind:"shell"},
{id:"mtn_leaf",place:"hory",x:32,y:30,kind:"leaf"},{id:"mtn_medal",place:"hory",x:70,y:55,kind:"medal"},{id:"mtn_shell",place:"hory",x:46,y:82,kind:"shell"}
];
export default function ThreeWorld({place,player,dog,academyLevel=1,academyUpgrades=[],collectedItems=[],stations=[],onGroundClick,onStationClick}:{place:Place;player:Point;dog:Point;academyLevel?:number;academyUpgrades?:string[];collectedItems?:string[];stations?:Station[];onGroundClick?:(p:Point)=>void;onStationClick?:(id:string)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const cameraRef=useRef<THREE.OrthographicCamera|null>(null);
 const actors=useRef<{person:THREE.Group|null;dog:THREE.Group|null}>({person:null,dog:null});
 const draw=useRef<(()=>void)|null>(null);
 const collectMeshes=useRef<Array<{id:string;mesh:THREE.Group}>>([]);
 const stationHits=useRef<Array<{id:string;object:THREE.Object3D}>>([]);
 const stationDataRef=useRef(stations);stationDataRef.current=stations;
 const groundClickRef=useRef(onGroundClick);groundClickRef.current=onGroundClick;
 const stationClickRef=useRef(onStationClick);stationClickRef.current=onStationClick;
 useEffect(()=>{
  if(!canvas.current)return;
  const el=canvas.current,scene=new THREE.Scene();scene.background=new THREE.Color(place==="hory"?"#c5d7e7":place==="jezero"?"#c8e2ec":"#c9e2ef");scene.fog=new THREE.Fog(place==="hory"?"#c5d7e7":place==="jezero"?"#c8e2ec":"#c9e2ef",95,185);
  const camera=new THREE.OrthographicCamera(-28,28,17.4,-17.4,.1,360);camera.position.set(32,42,34);camera.lookAt(0,0,0);cameraRef.current=camera;
  const renderer=new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:false,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.15:1.5));renderer.shadowMap.enabled=window.innerWidth>700;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  scene.add(new THREE.HemisphereLight("#fff7e5","#73885c",2.3));
  const sun=new THREE.DirectionalLight("#fff0d0",3);sun.position.set(-25,45,-18);sun.castShadow=window.innerWidth>700;sun.shadow.mapSize.set(768,768);scene.add(sun);
  const material=(c:string,r=.9)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
  const add=(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=scene)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const floor=add(new THREE.PlaneGeometry(170,132),material(place==="priroda"||place==="hory"?"#83b776":place==="hala"?"#b8bec6":place==="mesto"||place==="vesnice"?"#a8c6a5":place==="domov"?"#c9d2c4":place==="jezero"?"#a4c7a2":"#a9c1d2"),0,-.12,0);floor.rotation.x=-Math.PI/2;
  const pathPts=place==="centrum"?[[-38,0,0],[-25,0,.7],[-12,0,0],[0,0,.7],[12,0,0],[25,0,.7],[38,0,0]]:place==="hala"?[[-72,0,30],[-42,0,17],[-12,0,5],[20,0,-15],[65,0,-35]]:[[-76,0,34],[-48,0,19],[-24,0,9],[4,0,13],[30,0,-9],[72,0,-36]];
  const curve=new THREE.CatmullRomCurve3(pathPts.map(([x,y,z])=>new THREE.Vector3(x,y,z)));
  add(new THREE.TubeGeometry(curve,72,2.8,8,false),material("#c9b894"),0,-.02,0).castShadow=false;
  add(new THREE.TubeGeometry(curve,72,2.35,8,false),material("#e9d8b2"),0,.025,0).castShadow=false;
  const scatterCount=place==="centrum"?48:place==="hala"?65:150;for(let i=0;i<scatterCount;i++){const x=((i*47)%154)-77,z=((i*31)%116)-58;if(Math.abs(z-(10-x*.48))<4)continue;if(place==="centrum"&&Math.abs(x)<25&&Math.abs(z)<15)continue;const p=add(new THREE.DodecahedronGeometry(.4,0),material(i%2?"#d4d0b9":"#b6c69f"),x,.02,z);p.scale.set(.7,.24,.48);p.castShadow=false;}
  const tree=(x:number,z:number,s=1,i=0)=>{const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);add(new THREE.CylinderGeometry(.38,.52,2.5,7),material("#886143"),0,1.1,0,g);if(i%2===0){add(new THREE.ConeGeometry(2.1,3.8,7),material("#58884d"),0,3.6,0,g);add(new THREE.ConeGeometry(1.6,3.2,7),material("#7ca85e"),0,5.0,0,g);}else{add(new THREE.IcosahedronGeometry(2,1),material("#659753"),-.6,3.8,0,g);add(new THREE.IcosahedronGeometry(1.8,1),material("#80aa65"),.7,4.3,-.2,g);add(new THREE.IcosahedronGeometry(1.55,1),material("#568749"),0,5.2,.25,g);}add(new THREE.CylinderGeometry(1.8,1.8,.05,9),material("#83b46c"),0,.03,0,g).castShadow=false;};
  const trees:[number,number,number,number][]=[[-76,-53,1.1,0],[-63,-58,.9,1],[-43,-54,1,0],[-22,-56,.8,1],[0,-57,1,0],[23,-55,.9,1],[47,-53,1.1,0],[68,-46,.9,1],[-78,-15,.85,1],[-76,8,1,0],[-70,46,1.15,1],[-46,54,.95,0],[-23,51,1.1,1],[5,56,.9,0],[29,51,1.1,1],[55,47,1.1,0],[76,28,.85,1],[76,0,1,0],[-61,29,1,0],[-52,-32,1.1,1],[51,-28,1.2,0],[62,-12,1.1,1],[-55,17,1.2,0],[49,24,1.2,1]];
  if(place==="priroda"||place==="jezero")trees.push([-42,-29,1.2,0],[-29,-40,1.1,1],[35,-35,1.2,0],[46,-22,1.1,1],[-44,28,1.2,0],[42,34,1.2,1]);
  if(place==="vesnice")trees.splice(0,trees.length,...trees.filter((_,i)=>i%3===0));
  if(place!=="hala")trees.forEach(t=>tree(...t));
  const collectibleMaterials={leaf:material("#d8e7a4",.4),shell:material("#f0c78f",.35),medal:material("#f4d26d",.3)};
  collectMeshes.current=[];
  finds.filter(f=>f.place===place&&!collectedItems.includes(f.id)).forEach(f=>{
   const g=new THREE.Group();const x=(f.x-50)*1.42,z=(f.y-50)*1.08;g.position.set(x,0,z);scene.add(g);
   const base=add(new THREE.CylinderGeometry(.52,.68,.16,12),material("#f8f4dd"),0,.16,0,g);base.castShadow=false;
   if(f.kind==="leaf"){const leaf=add(new THREE.SphereGeometry(.42,10,8),collectibleMaterials.leaf,0,.75,0,g);leaf.scale.set(.58,1.25,.28);leaf.rotation.z=-.45;}
   else if(f.kind==="shell"){const shell=add(new THREE.SphereGeometry(.42,12,8,0,Math.PI*2,0,Math.PI*.65),collectibleMaterials.shell,0,.63,0,g);shell.scale.set(1,.7,.8);}
   else{const medal=add(new THREE.TorusGeometry(.3,.1,8,16),collectibleMaterials.medal,0,.8,0,g);medal.rotation.x=Math.PI/2;add(new THREE.SphereGeometry(.15,10,8),collectibleMaterials.medal,0,.8,0,g);}
   collectMeshes.current.push({id:f.id,mesh:g});
  });
  const building=(x:number,z:number,scale=1,wallColor="#f0dfbb",roofColor="#6e98b8",label="HODNÝ PES",taskId="quiz")=>{
   const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
   const wall=material(wallColor),roof=material(roofColor),trim=material("#fff0d4"),wood=material("#8a6344"),glass=new THREE.MeshStandardMaterial({color:"#9ccbd7",roughness:.3});
   add(new THREE.BoxGeometry(11,5.5,8),wall,0,2.8,0,g);
   add(new THREE.BoxGeometry(11.5,.3,8.5),trim,0,5.6,0,g);
   const ra=add(new THREE.BoxGeometry(6.5,.55,9),roof,-2.8,7,0,g);ra.rotation.z=-.55;
   const rb=add(new THREE.BoxGeometry(6.5,.55,9),roof,2.8,7,0,g);rb.rotation.z=.55;
   add(new THREE.BoxGeometry(2,3,.18),wood,0,1.6,4.1,g);
   add(new THREE.BoxGeometry(.12,.12,.22),material("#f4d58b"),.6,1.8,4.2,g);
   for(const wx of [-3.5,3.5]){
    add(new THREE.BoxGeometry(1.6,1.5,.2),trim,wx,3.5,4.12,g);
    add(new THREE.BoxGeometry(1.3,1.25,.22),glass,wx,3.5,4.23,g);
    add(new THREE.BoxGeometry(.1,1.25,.05),trim,wx,3.5,4.36,g);
   }
   // A readable facade plaque makes every building identifiable from the isometric camera.
   const c=document.createElement("canvas");c.width=512;c.height=128;const ctx=c.getContext("2d");
   if(ctx){ctx.fillStyle="#f8f1df";ctx.fillRect(0,0,512,128);ctx.fillStyle="#315d49";ctx.font="bold 34px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label,256,64);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;add(new THREE.PlaneGeometry(7.2,1.8),new THREE.MeshBasicMaterial({map:tex,transparent:true}),0,4.8,4.28,g);}
   // Invisible raycast target: building clicks are handled by the same stable hit-testing path as activities.
   const hitMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,colorWrite:false,depthWrite:false});
   const hit=add(new THREE.BoxGeometry(12,10,10),hitMat,0,4.8,0,g);stationHits.current.push({id:taskId,object:hit});
  };
  stationHits.current=[];
  if(place==="centrum"){
   // The academy is the hub. All ten buildings are placed in the initial camera view,
   // around the player's starting area; they are not HTML/SVG overlays.
   const academyBuildings=[
    {x:-16,z:-7,label:"HLAVNÍ DŮM",wall:"#f1dfbb",roof:"#b98765",task:"tricks"},
    {x:-8,z:-7,label:"RECEPCE",wall:"#f3e4c7",roof:"#6d98bb",task:"quiz"},
    {x:0,z:-7,label:"CVIČIŠTĚ",wall:"#e7d7b5",roof:"#7c9a65",task:"obedience"},
    {x:8,z:-7,label:"VÝCVIKOVÁ HALA",wall:"#d8e5d6",roof:"#7d9bb9",task:"agility"},
    {x:16,z:-7,label:"PSÍ KOTCE",wall:"#e9d8bd",roof:"#a87952",task:"recall"},
    {x:-16,z:7,label:"OBCHOD",wall:"#f0dfbf",roof:"#c47c61",task:"quiz"},
    {x:-8,z:7,label:"PSÍ SALON",wall:"#f1d9d1",roof:"#c78d9d",task:"tricks"},
    {x:0,z:7,label:"DOG PULLER",wall:"#e4e2c9",roof:"#7ca6bd",task:"puller"},
    {x:8,z:7,label:"SKLAD ODMĚN",wall:"#e8d3ad",roof:"#88a16c",task:"nosework"},
    {x:16,z:7,label:"JEZÍRKO",wall:"#d9e9df",roof:"#6e9e9b",task:"nosework"}
   ];
   academyBuildings.forEach(b=>building(b.x,b.z,.44,b.wall,b.roof,b.label,b.task));
   // A compact courtyard, with a clear walking lane between both rows of buildings.
   const plaza=add(new THREE.CylinderGeometry(3.2,3.2,.12,10),material("#d9c7a5"),0,.01,0);plaza.rotation.y=Math.PI/10;
   for(let i=0;i<12;i++){const x=-24+(i%6)*9.6,z=i<6?-16:16;const flower=add(new THREE.SphereGeometry(.22,7,6),material(["#e7b2a7","#f1d27a","#d7c0e3"][i%3]),x,.32,z);flower.scale.set(1,.55,1);}
  } else if(place==="domov"){
   building(-5,-7,1.05,"#f2dfbc","#b98765","MŮJ DŮM","tricks");
   add(new THREE.BoxGeometry(7,.65,4),material("#b9d4a0"),7,.35,4);
  } else if(place==="mesto"){
   building(-12,-9,.7,"#f0dfbf","#c47c61","OBCHOD","quiz");
   building(15,-19,.55,"#d8e5d6","#7d9bb9","KLUB","recall");
  } else if(place==="priroda"){
   building(16,-13,.58,"#e6d6b4","#7c9a65","ODPOČINEK","nosework");
  } else if(place==="jezero"){
   building(-28,-15,.62,"#f0dfbc","#6e9e9b","PŘÍSTŘEŠEK","nosework");
   const water=add(new THREE.CircleGeometry(17,48),new THREE.MeshStandardMaterial({color:"#70b8d0",roughness:.24,metalness:.08}),23,-.04,-9);water.rotation.x=-Math.PI/2;
   const shore=add(new THREE.TorusGeometry(17,.65,8,64),material("#d7c39a"),23,.02,-9);shore.rotation.x=Math.PI/2;
   for(let i=0;i<7;i++){const reed=add(new THREE.CylinderGeometry(.09,.13,1.1,6),material("#799b61"),8+i*2,.5,-25+(i%3)*2);reed.rotation.z=.12;}
  } else if(place==="vesnice"){
   building(-25,-14,.72,"#f1dfbf","#c47c61","VESNICKÝ DŮM","quiz");
   building(2,-28,.6,"#e6d7b9","#83a66d","ZAHRADA","tricks");
   building(26,-13,.66,"#e2e7dc","#7899b8","KLUB","recall");
   const plaza=add(new THREE.CylinderGeometry(9,9,.18,8),material("#d8c7a7"),7,.02,5);
   add(new THREE.CylinderGeometry(1.2,1.5,1.4,8),material("#7da8bb"),7,.8,5);
   add(new THREE.CylinderGeometry(1.8,1.8,.15,8),material("#e6dfc9"),7,1.55,5);
  } else if(place==="hory"){
   for(let i=0;i<9;i++){const x=-67+i*16,z=-43+(i%3)*5;const mountain=add(new THREE.ConeGeometry(10+(i%3)*3,25+(i%4)*5,7),material(i%2?"#8da7ae":"#718f83"),x,11,z);mountain.position.y=12+(i%3)*2;}
   building(23,-12,.58,"#e6d6b4","#6e8da1","HORSKÁ CHATA","recall");
  } else {
   for(let i=0;i<9;i++){add(new THREE.BoxGeometry(.35,1.4,.35),material("#f1e8d1"),-20+i*5,.7,13);if(i<8)add(new THREE.BoxGeometry(5,.2,.2),material("#d8c9a8"),-17.5+i*5,1,13);}
  }
  const jump=(x:number,z:number,c:string)=>{add(new THREE.BoxGeometry(.4,2,.4),material("#f5ead5"),x-2.3,1,z);add(new THREE.BoxGeometry(.4,2,.4),material("#f5ead5"),x+2.3,1,z);add(new THREE.CylinderGeometry(.22,.22,5,8),material(c),x,1.65,z).rotation.z=Math.PI/2;};if(place==="hala"){jump(-16,3,"#5c9fc0");jump(-3,10,"#d88b66");const hoop=add(new THREE.TorusGeometry(1.45,.2,10,24),material("#e2a85e"),10,2,10);hoop.rotation.x=Math.PI/2;add(new THREE.BoxGeometry(1,2.2,1),material("#f4ead2"),7.2,1.1,10);add(new THREE.BoxGeometry(1,2.2,1),material("#f4ead2"),12.8,1.1,10);}
  if(academyUpgrades.includes("course")&&place==="hala"){const colors=["#d98b70","#d4ad55","#79a9c4"];for(let i=0;i<3;i++){const x=-14+i*8,z=5+(i%2)*3;add(new THREE.BoxGeometry(.3,1.25,.3),material("#f3ead8"),x-.9,.62,z);add(new THREE.BoxGeometry(.3,1.25,.3),material("#f3ead8"),x+.9,.62,z);add(new THREE.CylinderGeometry(.14,.14,2.1,8),material(colors[i]),x,1.1,z).rotation.z=Math.PI/2;}}
  if(academyUpgrades.includes("garden")&&(place==="centrum"||place==="domov")){const soil=material("#8eaa70"),stem=material("#5d8b54"),petals=[material("#e6a1a0"),material("#e9c96f"),material("#d9b8dc")];add(new THREE.BoxGeometry(10,.12,4),soil,-23,.05,10);for(let i=0;i<12;i++){const x=-27+(i%6)*1.6,z=8+Math.floor(i/6)*2;add(new THREE.CylinderGeometry(.045,.06,.5,5),stem,x,.28,z);add(new THREE.SphereGeometry(.22,8,6),petals[i%petals.length],x,.58,z);}}
  if(academyUpgrades.includes("rest")&&(place==="centrum"||place==="domov")){const wood=material("#a87952"),cushion=material("#d7e4ed"),frame=material("#f1e4c8");add(new THREE.BoxGeometry(3.8,.3,1.5),wood,13,.5,9);add(new THREE.BoxGeometry(3.25,.22,1.15),cushion,13,.72,9);add(new THREE.BoxGeometry(.18,.8,.18),frame,11.4,.25,8.5);add(new THREE.BoxGeometry(.18,.8,.18),frame,14.6,.25,8.5);}
  if(academyLevel>=3&&place==="centrum"){const sign=add(new THREE.BoxGeometry(3.2,1.6,.16),material("#f7f0d9"),-17,1.5,-5);sign.rotation.y=.15;add(new THREE.BoxGeometry(2.7,.18,.18),material("#6f9b75"),-17,2.2,-5);}
  if(place==="centrum"||place==="priroda"||place==="jezero"||place==="hory")for(let i=0;i<3;i++){const b=add(new THREE.BoxGeometry(2.5,.65,2.1),material(["#d9b477","#90b4c7","#c6a8c6"][i]),-24+i*4,.36,-4+i*3);b.rotation.y=i*.14;}
  if(place==="vesnice"){for(let i=0;i<8;i++)add(new THREE.CylinderGeometry(.65,.72,.12,7),material("#c7c9b8"),-3+i*1.65,.05,17-Math.sin(i*.4)*1.8);add(new THREE.CylinderGeometry(.8,.58,.42,12),material("#6eabc9"),4,.22,14);}
  const person=new THREE.Group(),shirt=material("#668eac"),skin=material("#dcae85"),pants=material("#475c66"),hair=material("#5b493a");
  add(new THREE.CapsuleGeometry(.62,1.45,4,8),shirt,0,2.35,0,person);add(new THREE.SphereGeometry(.63,12,10),skin,0,3.75,0,person);add(new THREE.SphereGeometry(.66,10,8,0,Math.PI*2,0,Math.PI*.48),hair,0,4.05,-.04,person);add(new THREE.CapsuleGeometry(.2,1.05,3,6),pants,-.34,.85,0,person);add(new THREE.CapsuleGeometry(.2,1.05,3,6),pants,.34,.85,0,person);for(const x of [-.78,.78]){const a=add(new THREE.CapsuleGeometry(.16,.9,3,6),shirt,x,2.45,0,person);a.rotation.z=x<0?-.35:.35;}
  const dogModel=new THREE.Group(),coat=material("#b78350"),cream=material("#f3e6d0"),dark=material("#67462f"),blue=material("#5d9fca");add(new THREE.CapsuleGeometry(.72,1.55,4,9),coat,0,1.15,0,dogModel).rotation.z=Math.PI/2;add(new THREE.SphereGeometry(.75,12,10),coat,.95,1.75,-.03,dogModel);add(new THREE.SphereGeometry(.48,10,8),cream,1.28,1.43,.34,dogModel);add(new THREE.ConeGeometry(.29,.85,5),dark,.62,2.38,-.42,dogModel).rotation.z=-.35;add(new THREE.ConeGeometry(.29,.85,5),dark,1.13,2.4,.28,dogModel).rotation.z=.25;add(new THREE.SphereGeometry(.09,8,8),material("#263b36"),1.5,1.85,.45,dogModel);add(new THREE.SphereGeometry(.13,8,8),material("#293b37"),1.6,1.52,.48,dogModel);add(new THREE.TorusGeometry(.28,.08,8,18),blue,.5,1.42,0,dogModel).rotation.x=Math.PI/2;for(const [x,z] of [[-.45,-.28],[.42,-.28],[-.45,.3],[.42,.3]] as [number,number][]){add(new THREE.CapsuleGeometry(.13,.55,3,6),dark,x,.42,z,dogModel);}const tail=add(new THREE.CapsuleGeometry(.12,.65,3,6),coat,-1,1.6,-.1,dogModel);tail.rotation.z=-.95;scene.add(person,dogModel);actors.current={person,dog:dogModel};
  const raycaster=new THREE.Raycaster();const ndc=new THREE.Vector2();const ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);const onCanvasClick=(event:MouseEvent)=>{const rect=el.getBoundingClientRect();ndc.x=((event.clientX-rect.left)/rect.width)*2-1;ndc.y=-((event.clientY-rect.top)/rect.height)*2+1;camera.updateMatrixWorld(true);raycaster.setFromCamera(ndc,camera);const hitStation=raycaster.intersectObjects(stationHits.current.map(s=>s.object),false)[0];if(hitStation){const station=stationHits.current.find(s=>s.object===hitStation.object);if(station&&stationClickRef.current){stationClickRef.current(station.id);return;}}if(!groundClickRef.current)return;const hit=new THREE.Vector3();if(raycaster.ray.intersectPlane(ground,hit)){const target={x:Math.max(6,Math.min(94,hit.x/1.42+50)),y:Math.max(5,Math.min(92,hit.z/1.08+50))};groundClickRef.current(target);}};const onWheel=(event:WheelEvent)=>{event.preventDefault();const cam=cameraRef.current;if(!cam)return;cam.zoom=Math.max(.65,Math.min(1.85,cam.zoom*(event.deltaY<0?1.08:.92)));cam.updateProjectionMatrix();draw.current?.();};
  let lastPinchDistance=0;const pinchDistance=(touches:TouchList)=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  const onTouchStart=(event:TouchEvent)=>{lastPinchDistance=event.touches.length===2?pinchDistance(event.touches):0;};
  const onTouchMove=(event:TouchEvent)=>{if(event.touches.length!==2||!lastPinchDistance)return;event.preventDefault();const next=pinchDistance(event.touches),cam=cameraRef.current;if(cam){cam.zoom=Math.max(.65,Math.min(1.85,cam.zoom*(next/lastPinchDistance)));cam.updateProjectionMatrix();draw.current?.();}lastPinchDistance=next;};
  const onTouchEnd=()=>{lastPinchDistance=0;};
  el.addEventListener("click",onCanvasClick);el.addEventListener("wheel",onWheel,{passive:false});el.addEventListener("touchstart",onTouchStart,{passive:true});el.addEventListener("touchmove",onTouchMove,{passive:false});el.addEventListener("touchend",onTouchEnd);const resize=()=>{const w=el.clientWidth||1000,h=el.clientHeight||620,a=w/h,viewH=a<1.15?52:43;renderer.setSize(w,h,false);camera.left=-viewH*a/2;camera.right=viewH*a/2;camera.top=viewH/2;camera.bottom=-viewH/2;camera.updateProjectionMatrix();renderer.render(scene,camera);};const obs=new ResizeObserver(resize);obs.observe(el);draw.current=()=>renderer.render(scene,camera);resize();
  return()=>{obs.disconnect();el.removeEventListener("click",onCanvasClick);el.removeEventListener("wheel",onWheel);el.removeEventListener("touchstart",onTouchStart);el.removeEventListener("touchmove",onTouchMove);el.removeEventListener("touchend",onTouchEnd);draw.current=null;cameraRef.current=null;collectMeshes.current=[];stationHits.current=[];renderer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});actors.current={person:null,dog:null};};
 },[place,academyLevel,academyUpgrades,collectedItems]);
 useEffect(()=>{const map=(p:Point)=>({x:(p.x-50)*1.42,z:(p.y-50)*1.08});const p=map(player),d=map(dog);if(actors.current.person)actors.current.person.position.set(p.x,0,p.z);if(actors.current.dog)actors.current.dog.position.set(d.x,0,d.z);
  // Camera follows the player so the expanded world can be explored beyond the starting clearing.
  const camera=cameraRef.current;if(camera){const focus=new THREE.Vector3(d.x,0,d.z);camera.position.set(focus.x+32,focus.y+42,focus.z+34);camera.lookAt(focus);}const t=performance.now()*.002;collectMeshes.current.forEach(({mesh},i)=>{mesh.position.y=.08+Math.sin(t+i*1.7)*.13;mesh.rotation.y=t*.65+i;});draw.current?.();
 },[player,dog,place,collectedItems]);
 return <><canvas ref={canvas} className="hpThreeCanvas" aria-label="3D izometrický areál Hodný pes"/><div className="hpWorldZoomControls" aria-label="Přiblížení mapy"><button type="button" aria-label="Přiblížit mapu" onClick={()=>{const c=cameraRef.current;if(c){c.zoom=Math.min(1.85,c.zoom*1.15);c.updateProjectionMatrix();draw.current?.();}}}>+</button><button type="button" aria-label="Oddálit mapu" onClick={()=>{const c=cameraRef.current;if(c){c.zoom=Math.max(.65,c.zoom/1.15);c.updateProjectionMatrix();draw.current?.();}}}>−</button></div></>;
}
