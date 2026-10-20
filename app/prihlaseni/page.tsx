"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, PawPrint, Eye, EyeOff, ShieldCheck } from "lucide-react";
import "./login.css";

export default function LoginPage() {
 const router = useRouter();
 const [nextPath,setNextPath] = useState("/hra");
 const [mode,setMode] = useState<"login"|"signup">("login");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [showPassword,setShowPassword] = useState(false);
 const [busy,setBusy] = useState(false);
 const [message,setMessage] = useState("");
 const [configured,setConfigured] = useState(true);
 const [client,setClient] = useState<ReturnType<typeof createBrowserClient>|null>(null);
 useEffect(()=> {
  const params = new URLSearchParams(window.location.search);
  const requested=params.get("next") || "/hra"; setNextPath(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/hra");
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key){setConfigured(false);return;}
  const sb=createBrowserClient(url,key);setClient(sb);
  sb.auth.getUser().then(({data})=>{if(data.user) router.replace(nextPath);});
 },[router]);
 async function submit(e:FormEvent) {
  e.preventDefault(); if(!client)return;
  setBusy(true);setMessage("");
  const result = mode==="login"
   ? await client.auth.signInWithPassword({email,password})
   : await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+"/auth/callback?next=/hra"}});
  setBusy(false);
  if(result.error){setMessage(result.error.message);return;}
  if(mode==="signup"&&!result.data.session){setMessage("Účet je vytvořený. Potvrď e-mail a potom se přihlas.");return;}
  router.replace(nextPath);router.refresh();
 }
 async function oauth(provider:"google") {
  if(!client)return;setBusy(true);setMessage("");
  const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+"/auth/callback?next=/hra"}});
  if(error){setBusy(false);setMessage(error.message);}
 }
 return <main className="login-page"><Link href="/" className="login-back"><ArrowLeft size={17}/> Zpět na úvod</Link><section className="login-card"><div className="login-mark"><PawPrint size={28}/></div><span className="login-eyebrow">HODNÝ PES · PSÍ DOBRODRUŽSTVÍ</span><h1>{mode==="login"?"Vítej zpátky!":"Přidej se do dobrodružství."}</h1><p className="login-lead">Přihlas se, ať můžeš pokračovat ve svém světě a mít svůj postup spojený s účtem.</p>
 {configured?<><div className="login-tabs"><button className={mode==="login"?"active":""} onClick={()=>{setMode("login");setMessage("")}}>Přihlášení</button><button className={mode==="signup"?"active":""} onClick={()=>{setMode("signup");setMessage("")}}>Vytvořit účet</button></div><form onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" placeholder="ty@email.cz"/></label><label>Heslo<span className="password-field"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Alespoň 6 znaků"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Skrýt heslo":"Zobrazit heslo"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label><button className="login-submit" disabled={busy||!client}>{busy?"Chvilku strpení…":mode==="login"?"Přihlásit se":"Vytvořit účet"}</button></form><div className="login-divider"><span>nebo pokračuj přes</span></div><div className="oauth-row"><button className="google-login" disabled={busy||!client} onClick={()=>oauth("google")}><svg className="google-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 37.95 46.98 31.9 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.55 2.56 10.78l7.97-6.19Z" transform="translate(0 0)"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -4)"/></svg><span>Pokračovat přes Google</span></button></div>{message&&<p className="login-message" role="status">{message}</p>}<p className="login-security"><ShieldCheck size={15}/> Účet a přihlášení zajišťuje Supabase.</p></>:<div className="login-message config-message"><b>Přihlášení zatím není nakonfigurované.</b><p>V prostředí nasazení je potřeba nastavit NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY a povolit Google v Supabase Authentication.</p></div>}
 </section><p className="login-foot">Hra je inspirovaná pozitivním přístupem ke psům. Nenahrazuje skutečný výcvik.</p></main>;
}
