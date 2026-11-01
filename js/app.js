/* La visita de Lolo · juegos de Educación Infantil para pizarra digital */
(() => {
  const $ = s => document.querySelector(s);
  const app = document.documentElement;
  const lolo = $('#lolo'), zona = $('#zona'), arrecife = $('#arrecife'), agendaEl = $('#agenda');
  let texto = $('#texto');
  const reduceSO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let calma = false; try{ calma = localStorage.getItem('lolo-calma')==='1'; }catch(e){}
  const quieto = () => reduceSO || calma;
  let voz = true, ultimo = '', paso = 0, dia = 0, colorDia = 'rojo', modo = 'lolo';

  /* ---------- pictogramas de la agenda ---------- */
  const P = {
    hola:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1-5.5-3L3.5 14a1.5 1.5 0 0 1 2.5-1.5L8 15"/>',
    cara:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="15" cy="10" r=".6" fill="currentColor"/><path d="M8.5 14.5q3.5 3 7 0"/>',
    tiempo:'<circle cx="9" cy="9" r="3.5"/><path d="M9 2.5v1.5M2.5 9H4M4.4 4.4l1 1M13.6 4.4l-1 1"/><path d="M8 20h9a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.5 1.5A2.8 2.8 0 0 0 8 20z" fill="#fff"/>',
    color:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    pez:'<path d="M3 7l4 5-4 5z"/><ellipse cx="13" cy="12" rx="7" ry="5"/><circle cx="16" cy="11" r=".7" fill="currentColor"/>',
    pelota:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17"/>',
    cuerpo:'<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M6 11h12M12 15l-3.5 6M12 15l3.5 6"/>',
    jabon:'<rect x="3" y="11" width="13" height="8" rx="3"/><circle cx="17" cy="7" r="2.5"/><circle cx="11" cy="6" r="1.6"/><circle cx="20" cy="12" r="1.3"/>',
    pata:'<ellipse cx="12" cy="16" rx="4.5" ry="3.8"/><circle cx="6" cy="10.5" r="1.9"/><circle cx="9.5" cy="6.5" r="1.9"/><circle cx="14.5" cy="6.5" r="1.9"/><circle cx="18" cy="10.5" r="1.9"/>',
    nota:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    corazon:'<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    estrella:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    mover:'<circle cx="13" cy="4" r="2"/><path d="M8 9l4-2 3 3 3 1M12 7l-1 6 4 3v5M11 13l-4 3-3-1"/>',
    fin:'<circle cx="12" cy="12" r="9"/><path d="M7.5 12.5l3 3 6-6.5"/>',
    aire:'<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/><path d="M3 19h6"/>',
    ojo:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bombilla:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    pregunta:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>'
  };
  const icono = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[k]}</svg>`;

  /* ---------- tentáculos ---------- */
  (function(){
    const defs=[[62,140,30,175,44,226],[88,156,70,196,78,238],[112,162,108,206,104,244],[136,162,140,206,150,242],[158,154,178,194,174,236],[180,138,214,170,204,222]];
    const q=(a,b,c,t)=>(1-t)*(1-t)*a+2*(1-t)*t*b+t*t*c; let h='';
    defs.forEach(([x0,y0,cx,cy,x1,y1])=>{ let s=`<g class="tent"><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="url(#gTent)" stroke-width="24" stroke-linecap="round" fill="none"/>`;
      [.45,.7,.9].forEach((t,i)=>{ s+=`<circle cx="${q(x0,cx,x1,t).toFixed(1)}" cy="${q(y0,cy,y1,t).toFixed(1)}" r="${5-i}" fill="#FFD7B0" stroke="#F0A070" stroke-width="1.5"/>`; }); h+=s+'</g>'; });
    $('#tentaculos').innerHTML=h;
  })();

  /* ---------- burbujas ---------- */
  (function(){
    const c=$('#burbujas'), x=c.getContext('2d'); let w,h; const b=[];
    const size=()=>{ w=c.width=innerWidth*devicePixelRatio; h=c.height=innerHeight*devicePixelRatio; }; size(); addEventListener('resize',size);
    for(let i=0;i<30;i++) b.push({x:Math.random(),y:Math.random(),r:2+Math.random()*7,v:.0006+Math.random()*.0012,o:Math.random()*6});
    const dib=t=>{
      if(!quieto()){
        x.clearRect(0,0,w,h);
        b.forEach(p=>{ p.y-=p.v; if(p.y<-.05){p.y=1.05;p.x=Math.random();}
          const px=(p.x+Math.sin(t/1400+p.o)*.008)*w, py=p.y*h, r=p.r*devicePixelRatio;
          x.beginPath(); x.arc(px,py,r,0,7); x.fillStyle='rgba(255,255,255,.18)'; x.fill(); x.lineWidth=1.2*devicePixelRatio; x.strokeStyle='rgba(255,255,255,.55)'; x.stroke();
          x.beginPath(); x.arc(px-r*.35,py-r*.35,r*.28,0,7); x.fillStyle='rgba(255,255,255,.8)'; x.fill(); });
      }
      requestAnimationFrame(dib);
    };
    requestAnimationFrame(dib);
  })();

  /* ---------- voz y sonido ---------- */
  let voces=[], vozEs=null;
  const esNatural=v=>/natural|neural|online|premium|enhanced|mejorad|google|siri/i.test(v.name);
  const puntua=v=>(/natural|neural/i.test(v.name)?60:0)+(/online/i.test(v.name)?20:0)+(/premium|enhanced|mejorad|siri/i.test(v.name)?50:0)+(/google/i.test(v.name)?35:0)+(/^es[-_]ES/i.test(v.lang)?10:0)+(v.localService===false?5:0);
  function cargar(){ try{
    voces=speechSynthesis.getVoices().filter(v=>/^es/i.test(v.lang)).sort((a,b)=>puntua(b)-puntua(a));
    let guardada=null; try{ guardada=localStorage.getItem('lolo-voz'); }catch(e){}
    vozEs=voces.find(v=>v.voiceURI===guardada)||voces[0]||null;
    const sel=$('#selVoz');
    if(sel){ sel.innerHTML=voces.length?voces.map(v=>`<option value="${v.voiceURI.replace(/"/g,'&quot;')}">${esNatural(v)?'★ ':''}${v.name} (${v.lang})</option>`).join(''):'<option value="">No hay voces en español en este navegador</option>'; if(vozEs) sel.value=vozEs.voiceURI; }
    const aviso=$('#vozAviso'); if(aviso) aviso.hidden=voces.some(esNatural);
  }catch(e){} }
  try{ cargar(); speechSynthesis.onvoiceschanged=cargar; }catch(e){}
  function hablar(t){
    if(!('speechSynthesis' in window)) return;
    try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang=vozEs?vozEs.lang:'es-ES'; if(vozEs) u.voice=vozEs;
      const nat=vozEs&&esNatural(vozEs); u.rate=calma?.85:(nat?.95:.9); u.pitch=nat?1.05:(calma?1.1:1.25); speechSynthesis.speak(u); }catch(e){}
  }
  function decir(t){
    ultimo=t; texto.textContent=t;
    if(!quieto() && texto.animate) texto.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:300});
    if(voz) hablar(t);
  }
  let ac=null;
  const ctx=()=>{ try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); return ac; }catch(e){ return null; } };
  const vol=v=>calma?v*.45:v;
  function tono(notas,tipo='sine',v=.16,sep=.11,dur=.5){
    const a=ctx(); if(!a) return;
    notas.forEach((f,i)=>{ const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+i*sep;
      o.type=tipo; o.frequency.value=f; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol(v),t+.02); g.gain.exponentialRampToValueAtTime(.001,t+dur);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.05); });
  }
  function ruido(t0,dur,v,frec){
    const a=ctx(); if(!a) return;
    const n=Math.floor(a.sampleRate*dur), buf=a.createBuffer(1,n,a.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);
    const s=a.createBufferSource(), f=a.createBiquadFilter(), g=a.createGain(); s.buffer=buf; f.type='bandpass'; f.frequency.value=frec; f.Q.value=.8; g.gain.value=vol(v);
    s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime+t0);
  }
  const acierto=()=>tono(calma?[523,784]:[523,659,784,1047]);
  const intento=()=>{ if(!calma) tono([330,294],'triangle',.08,.14); };
  const palmada=t=>ruido(t,.12,.9,1800);
  const INSTR={
    castanuelas:()=>{ [0,.1,.2,.42].forEach(t=>ruido(t,.05,.8,3200)); },
    pandereta:()=>{ ruido(0,.35,.6,7000); ruido(.25,.3,.5,7000); },
    tambor:()=>{ tono([110,90],'sine',.5,.28,.35); ruido(0,.08,.4,300); },
    guitarra:()=>{ tono([196,247,294,392],'triangle',.18,.06,1.2); }
  };

  const cara=c=>lolo.dataset.cara=c;
  function anima(cl){ if(quieto()) return; lolo.classList.remove('salta','contento'); void lolo.getBoundingClientRect(); lolo.classList.add(cl); setTimeout(()=>lolo.classList.remove(cl),1800); }
  function celebrar(el){
    if(quieto()) return;
    const r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2, cols=['#FFC93C','#FF5D8F','#2BB673','#3DBBC9','#FF8A3D','#ffffff'];
    for(let i=0;i<20;i++){ const p=document.createElement('span'), s=8+Math.random()*14, a=Math.random()*Math.PI*2, d=80+Math.random()*120;
      p.className='particula'; p.style.cssText=`left:${cx-s/2}px;top:${cy-s/2}px;width:${s}px;height:${s}px;background:${cols[i%cols.length]};${i%3===0?'border:2px solid #fff;background:transparent;':''}`;
      document.body.appendChild(p);
      p.animate([{transform:'translate(0,0) scale(.4)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-40}px) scale(1)`,opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>p.remove(); }
  }

  /* ---------- ilustraciones ---------- */
  const SL=(cx,cy,rx)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*.18}" fill="url(#gSombra)"/>`;
  const COLORES={rojo:['#FF6B6B','#D63031'],azul:['#6EB6FF','#1E6FD9'],amarillo:['#FFE36E','#F2B705'],verde:['#7EE08A','#2E9E4F']};
  const calcetin=c=>{ const [a,b]=COLORES[c], id='s'+c+Math.random().toString(36).slice(2,6);
    return `<svg viewBox="0 0 120 130"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>${SL(64,122,40)}
    <path d="M42 10h36v58c0 6 3 10 9 15l12 9c10 8 8 24-5 28-7 2-14 1-20-4L34 92c-7-6-10-14-10-22V10z" fill="url(#${id})" stroke="#183153" stroke-width="4" stroke-linejoin="round"/>
    <path d="M28 40h46M28 54h46" stroke="#fff" stroke-width="7" opacity=".85"/><path d="M84 98c6 4 10 10 9 18" stroke="#fff" stroke-width="9" opacity=".5" fill="none" stroke-linecap="round"/>
    <rect x="22" y="6" width="58" height="18" rx="7" fill="#fff" stroke="#183153" stroke-width="4"/><path d="M32 12v6M42 12v6M52 12v6M62 12v6M72 12v6" stroke="#D6E4EA" stroke-width="3" stroke-linecap="round"/></svg>`; };
  const pez=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="p">
    <path d="M-14 0l-16-13c-3 0-4 2-3 4l5 9-5 9c-1 2 0 4 3 4z" fill="#FF8A3D" stroke="#183153" stroke-width="3" stroke-linejoin="round"/><path d="M2-12q8-12 18-6" fill="#FF8A3D" stroke="#183153" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="6" cy="0" rx="24" ry="16" fill="url(#gPez)" stroke="#183153" stroke-width="3"/><path d="M-2-14q-5 14 0 28" stroke="#FF8A3D" stroke-width="4" fill="none"/>
    <circle cx="18" cy="-3" r="5" fill="#fff" stroke="#183153" stroke-width="2"/><circle cx="19" cy="-3" r="2.6" fill="#183153"/><path d="M24 6q3 2 5 0" stroke="#183153" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="2" cy="-8" rx="8" ry="3" fill="#fff" opacity=".55"/></g></g>`;
  const POS={1:[[60,58,1.25]],2:[[38,42,1],[80,82,1]],3:[[34,30,.9],[84,56,.9],[40,92,.9]]};
  const peces=n=>`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#DDF4F7"/><path d="M14 92q46 16 92 0" stroke="#BFE8EE" stroke-width="5" fill="none" stroke-linecap="round"/>${POS[n].map(([x,y,s])=>pez(x-4,y,s)).join('')}</svg>`;
  const pelota=r=>`<svg viewBox="0 0 140 130">${SL(70,118,r*.95)}<g transform="translate(70 ${110-r})"><circle r="${r}" fill="#fff"/>
    <path d="M0 0 L0 ${-r} A${r} ${r} 0 0 1 ${r*.87} ${-r*.5}z" fill="#FF5D8F"/><path d="M0 0 L${r*.87} ${r*.5} A${r} ${r} 0 0 1 0 ${r}z" fill="#3DBBC9"/>
    <path d="M0 0 L${-r*.87} ${-r*.5} A${r} ${r} 0 0 1 0 ${-r}z" fill="#FFC93C"/><path d="M0 0 L0 ${r} A${r} ${r} 0 0 1 ${-r*.87} ${r*.5}z" fill="#FF8A3D"/>
    <circle r="${r}" fill="url(#gBrillo)"/><circle r="${r*.16}" fill="#fff" stroke="#183153" stroke-width="2.5"/><circle r="${r}" fill="none" stroke="#183153" stroke-width="4"/></g></svg>`;
  const ojosC=`<ellipse cx="36" cy="44" rx="7" ry="8.5" fill="#183153"/><ellipse cx="64" cy="44" rx="7" ry="8.5" fill="#183153"/><circle cx="38.5" cy="41" r="2.6" fill="#fff"/><circle cx="66.5" cy="41" r="2.6" fill="#fff"/>`;
  const mej=`<ellipse cx="24" cy="60" rx="8" ry="5" fill="#FF5D8F" opacity=".35"/><ellipse cx="76" cy="60" rx="8" ry="5" fill="#FF5D8F" opacity=".35"/>`;
  const carita=(g,ojos,extra)=>`<svg viewBox="0 0 100 106">${SL(50,100,34)}<circle cx="50" cy="50" r="44" fill="url(#${g})" stroke="#183153" stroke-width="4"/><ellipse cx="34" cy="24" rx="14" ry="7" fill="#fff" opacity=".45" transform="rotate(-20 34 24)"/>${ojos}${extra}</svg>`;
  const CARAS={
    feliz:carita('cFeliz',ojosC,mej+'<path d="M30 60q20 24 40 0z" fill="#B83A3A" stroke="#183153" stroke-width="4" stroke-linejoin="round"/>'),
    triste:carita('cTriste',ojosC,'<path d="M33 74q17-14 34 0" stroke="#183153" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M28 30l14-5M72 30l-14-5" stroke="#183153" stroke-width="4" stroke-linecap="round"/><path d="M30 56q-5 10 0 13q5-3 0-13z" fill="#fff" stroke="#3A82D0" stroke-width="2"/>'),
    enfado:carita('cEnfado',ojosC,'<path d="M24 28l20 10M76 28l-20 10" stroke="#183153" stroke-width="5" stroke-linecap="round"/><path d="M34 72q16-8 32 0" stroke="#183153" stroke-width="4.5" fill="none" stroke-linecap="round"/>'),
    sorpresa:carita('cSorpresa','<circle cx="35" cy="42" r="10" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="35" cy="43" r="5" fill="#183153"/><circle cx="65" cy="42" r="10" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="65" cy="43" r="5" fill="#183153"/>',mej+'<ellipse cx="50" cy="70" rx="9" ry="12" fill="#B83A3A" stroke="#183153" stroke-width="4"/>'),
    risa:carita('cFeliz','<path d="M27 44q8-8 16 0M57 44q8-8 16 0" stroke="#183153" stroke-width="4.5" fill="none" stroke-linecap="round"/>',mej+'<path d="M26 58q24 34 48 0z" fill="#B83A3A" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><path d="M80 30q6 6 2 12" stroke="#6FB2F2" stroke-width="4" fill="none" stroke-linecap="round"/>')
  };
  const TIEMPO={
    sol:`<svg viewBox="0 0 120 120"><g stroke="#FFB21E" stroke-width="7" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>`<path d="M60 14v12" transform="rotate(${a} 60 60)"/>`).join('')}</g><circle cx="60" cy="60" r="28" fill="url(#gSol)" stroke="#183153" stroke-width="4"/><circle cx="51" cy="57" r="3.5" fill="#183153"/><circle cx="69" cy="57" r="3.5" fill="#183153"/><path d="M50 68q10 9 20 0" stroke="#183153" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,
    nubes:`<svg viewBox="0 0 120 120"><path d="M34 86h56a18 18 0 0 0 0-36 26 26 0 0 0-49 6 15 15 0 0 0-7 30z" fill="url(#gNube)" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><path d="M22 54h20a9 9 0 0 0 0-18 13 13 0 0 0-24 3 7.5 7.5 0 0 0 4 15z" fill="#fff" stroke="#183153" stroke-width="3.5"/></svg>`,
    lluvia:`<svg viewBox="0 0 120 120"><path d="M32 70h56a18 18 0 0 0 0-36 26 26 0 0 0-49 6 15 15 0 0 0-7 30z" fill="#C7D6E2" stroke="#183153" stroke-width="4" stroke-linejoin="round"/>${[[40,84],[60,92],[80,84],[50,104],[72,106]].map(([x,y])=>`<path d="M${x} ${y-8}q-5 8 0 11q5-3 0-11z" fill="#3D8DF2" stroke="#183153" stroke-width="2"/>`).join('')}</svg>`,
    viento:`<svg viewBox="0 0 120 120"><g fill="none" stroke="#3DBBC9" stroke-width="7" stroke-linecap="round"><path d="M14 46h62a12 12 0 1 0-12-12"/><path d="M14 66h80a12 12 0 1 1-12 12"/><path d="M24 86h34"/></g><path d="M96 40l10-6-2 12z" fill="#2BB673" stroke="#183153" stroke-width="2.5" stroke-linejoin="round"/></svg>`
  };
  const CUERPO={
    ojos:`<svg viewBox="0 0 120 100"><g stroke="#183153" stroke-width="4"><path d="M8 50q22-28 44 0q-22 28-44 0z" fill="#fff"/><path d="M68 50q22-28 44 0q-22 28-44 0z" fill="#fff"/></g><circle cx="30" cy="50" r="10" fill="#4A7BC4"/><circle cx="90" cy="50" r="10" fill="#4A7BC4"/><circle cx="30" cy="50" r="5" fill="#183153"/><circle cx="90" cy="50" r="5" fill="#183153"/><circle cx="33" cy="46" r="2.5" fill="#fff"/><circle cx="93" cy="46" r="2.5" fill="#fff"/></svg>`,
    nariz:`<svg viewBox="0 0 120 110"><path d="M62 10q-6 40-26 62q-6 10 6 14q12 4 18-2q6 6 18 2q12-4 6-14q-14-20-22-62z" fill="url(#gPiel)" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><ellipse cx="48" cy="80" rx="5" ry="3" fill="#B87A55"/><ellipse cx="72" cy="80" rx="5" ry="3" fill="#B87A55"/><g fill="#FF5D8F"><circle cx="98" cy="22" r="6"/><circle cx="106" cy="30" r="6"/><circle cx="98" cy="38" r="6"/><circle cx="90" cy="30" r="6"/></g><circle cx="98" cy="30" r="4" fill="#FFC93C"/></svg>`,
    boca:`<svg viewBox="0 0 120 100"><path d="M14 46q46-26 92 0q-46 46-92 0z" fill="#E5484D" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><path d="M24 50q36 12 72 0q-6 6-6 8q-30 10-60 0q0-2-6-8z" fill="#fff"/><path d="M40 66q20 10 40 0" fill="#FF8A9A"/></svg>`,
    manos:`<svg viewBox="0 0 120 110"><g fill="url(#gPiel)" stroke="#183153" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"><path d="M22 96V52a6 6 0 0 1 12 0V40a6 6 0 0 1 12 0v12-20a6 6 0 0 1 12 0v40l6-8a6 6 0 0 1 10 6L60 96z" transform="rotate(-14 40 70)"/><path d="M98 96V52a6 6 0 0 0-12 0V40a6 6 0 0 0-12 0v12-20a6 6 0 0 0-12 0v40l-6-8a6 6 0 0 0-10 6L60 96z" transform="rotate(14 80 70)"/></g><g stroke="#FFC93C" stroke-width="4" stroke-linecap="round"><path d="M60 8v10M46 12l4 8M74 12l-4 8"/></g></svg>`
  };
  const jabon=`<svg viewBox="0 0 120 120">${SL(60,104,40)}<rect x="22" y="58" width="76" height="42" rx="16" fill="#9FD8F0" stroke="#183153" stroke-width="4"/><rect x="34" y="66" width="30" height="8" rx="4" fill="#fff" opacity=".7"/>${[[40,40,10],[66,30,14],[88,46,8],[54,14,7]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.7)" stroke="#5BB4DA" stroke-width="3"/>`).join('')}</svg>`;
  const ANIMALES={
    gato:`<svg viewBox="0 0 120 120">${SL(60,112,36)}<path d="M26 44l-4-30 24 16M94 44l4-30-24 16" fill="#FFB067" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="62" r="40" fill="#FFB067" stroke="#183153" stroke-width="4"/><path d="M60 22v14M48 24l4 12M72 24l-4 12" stroke="#E07B2C" stroke-width="4" stroke-linecap="round"/><ellipse cx="45" cy="58" rx="6" ry="8" fill="#183153"/><ellipse cx="75" cy="58" rx="6" ry="8" fill="#183153"/><circle cx="47" cy="55" r="2" fill="#fff"/><circle cx="77" cy="55" r="2" fill="#fff"/><path d="M55 72h10l-5 6z" fill="#FF5D8F"/><path d="M60 78q-6 8-12 4M60 78q6 8 12 4" stroke="#183153" stroke-width="3" fill="none" stroke-linecap="round"/><g stroke="#183153" stroke-width="2.5" stroke-linecap="round"><path d="M38 74l-20-2M38 80l-18 6M82 74l20-2M82 80l18 6"/></g></svg>`,
    perro:`<svg viewBox="0 0 120 120">${SL(60,112,36)}<circle cx="60" cy="62" r="38" fill="#D9A06B" stroke="#183153" stroke-width="4"/><path d="M28 34q-18 4-14 40q4 10 14 4z" fill="#8A5A34" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><path d="M92 34q18 4 14 40q-4 10-14 4z" fill="#8A5A34" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="80" rx="20" ry="14" fill="#F3D2AE"/><circle cx="46" cy="56" r="6" fill="#183153"/><circle cx="74" cy="56" r="6" fill="#183153"/><circle cx="48" cy="54" r="2" fill="#fff"/><circle cx="76" cy="54" r="2" fill="#fff"/><ellipse cx="60" cy="72" rx="8" ry="6" fill="#183153"/><path d="M60 78v6M52 86q8 6 16 0" stroke="#183153" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 88q0 10 6 10q6 0 4-10z" fill="#FF5D8F" stroke="#183153" stroke-width="2.5"/></svg>`,
    vaca:`<svg viewBox="0 0 120 120">${SL(60,112,36)}<path d="M30 30q-10-14-2-22M90 30q10-14 2-22" stroke="#F5E3B0" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="18" cy="46" rx="14" ry="8" fill="#fff" stroke="#183153" stroke-width="3.5"/><ellipse cx="102" cy="46" rx="14" ry="8" fill="#fff" stroke="#183153" stroke-width="3.5"/><ellipse cx="60" cy="58" rx="36" ry="38" fill="#fff" stroke="#183153" stroke-width="4"/><path d="M34 36q10-6 14 6q-8 10-16 4z" fill="#183153"/><path d="M78 60q14-4 16 10q-10 6-16-2z" fill="#183153"/><ellipse cx="60" cy="84" rx="26" ry="16" fill="#FFB3C1" stroke="#183153" stroke-width="4"/><ellipse cx="50" cy="84" rx="4" ry="5" fill="#183153"/><ellipse cx="70" cy="84" rx="4" ry="5" fill="#183153"/><circle cx="46" cy="56" r="5.5" fill="#183153"/><circle cx="74" cy="56" r="5.5" fill="#183153"/></svg>`,
    pato:`<svg viewBox="0 0 120 120">${SL(60,112,36)}<path d="M54 22q4-14 12-8q-6 2-6 10" fill="#FFD84A" stroke="#183153" stroke-width="3"/><circle cx="60" cy="58" r="36" fill="#FFE066" stroke="#183153" stroke-width="4"/><circle cx="48" cy="50" r="5.5" fill="#183153"/><circle cx="72" cy="50" r="5.5" fill="#183153"/><circle cx="50" cy="48" r="2" fill="#fff"/><circle cx="74" cy="48" r="2" fill="#fff"/><path d="M36 70q24-12 48 0q-24 14-48 0z" fill="#FF8A3D" stroke="#183153" stroke-width="4" stroke-linejoin="round"/><path d="M38 70h44" stroke="#183153" stroke-width="2.5"/><ellipse cx="34" cy="58" rx="6" ry="4" fill="#FF5D8F" opacity=".4"/><ellipse cx="86" cy="58" rx="6" ry="4" fill="#FF5D8F" opacity=".4"/></svg>`
  };
  const INSTRUMENTOS={
    castanuelas:`<svg viewBox="0 0 120 120">${SL(60,110,40)}<path d="M50 20q8-8 16 0" stroke="#E5484D" stroke-width="4" fill="none"/><path d="M26 54a22 26 0 1 1 44 0q0 30-22 30t-22-30z" fill="url(#gMadera)" stroke="#183153" stroke-width="4" transform="rotate(-12 48 60)"/><path d="M50 54a22 26 0 1 1 44 0q0 30-22 30t-22-30z" fill="url(#gMadera)" stroke="#183153" stroke-width="4" transform="rotate(12 72 60)"/><circle cx="48" cy="40" r="3" fill="#183153"/><circle cx="72" cy="40" r="3" fill="#183153"/><path d="M40 70q8 4 14 0M66 70q8 4 14 0" stroke="#fff" stroke-width="3" opacity=".4" fill="none"/></svg>`,
    pandereta:`<svg viewBox="0 0 120 120">${SL(60,110,40)}<circle cx="60" cy="58" r="42" fill="#F2C98A" stroke="#183153" stroke-width="5"/><circle cx="60" cy="58" r="32" fill="#FFF4DD" stroke="#D9A86A" stroke-width="3"/>${[0,60,120,180,240,300].map(a=>`<g transform="rotate(${a} 60 58)"><rect x="52" y="10" width="16" height="10" rx="3" fill="#F2C98A" stroke="#183153" stroke-width="2.5"/><circle cx="60" cy="15" r="5" fill="#D8DEE5" stroke="#183153" stroke-width="2"/></g>`).join('')}<path d="M44 42q8-6 18-6" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
    tambor:`<svg viewBox="0 0 120 120">${SL(60,112,40)}<path d="M22 42v44q38 24 76 0V42" fill="#E5484D" stroke="#183153" stroke-width="4"/><path d="M22 50l14 30 12-32 12 34 12-34 12 32 14-30" stroke="#FFC93C" stroke-width="4" fill="none" stroke-linejoin="round"/><ellipse cx="60" cy="42" rx="38" ry="14" fill="#FFF4DD" stroke="#183153" stroke-width="4"/><g stroke="#8A5A34" stroke-width="6" stroke-linecap="round"><path d="M30 8l26 30"/><path d="M92 8l-26 30"/></g><circle cx="30" cy="8" r="6" fill="#FFF4DD" stroke="#183153" stroke-width="2.5"/><circle cx="92" cy="8" r="6" fill="#FFF4DD" stroke="#183153" stroke-width="2.5"/></svg>`,
    guitarra:`<svg viewBox="0 0 120 120">${SL(60,114,34)}<g transform="rotate(30 60 60)"><rect x="54" y="2" width="12" height="54" rx="3" fill="#8A5A34" stroke="#183153" stroke-width="3.5"/><rect x="50" y="-6" width="20" height="14" rx="4" fill="#5C3A1E" stroke="#183153" stroke-width="3"/><path d="M60 46c-16 0-22 8-18 18 2 5-6 8-6 18 0 14 12 22 24 22s24-8 24-22c0-10-8-13-6-18 4-10-2-18-18-18z" fill="url(#gMadera)" stroke="#183153" stroke-width="4"/><circle cx="60" cy="74" r="8" fill="#3B2412"/><rect x="50" y="90" width="20" height="5" rx="2" fill="#3B2412"/><path d="M57 8v84M60 8v84M63 8v84" stroke="#F5E3B0" stroke-width="1"/></g></svg>`
  };
  const cangrejo=`<svg viewBox="0 0 120 120">${SL(60,110,40)}<g stroke="#183153" stroke-width="3.5" stroke-linecap="round"><path d="M28 80l-14 10M30 88l-10 14M92 80l14 10M90 88l10 14"/></g><path d="M22 52q-14-6-10-22q8 2 10 10q2-10 10-10q4 14-10 22z" fill="#E5484D" stroke="#183153" stroke-width="3.5" stroke-linejoin="round"/><path d="M98 52q14-6 10-22q-8 2-10 10q-2-10-10-10q-4 14 10 22z" fill="#E5484D" stroke="#183153" stroke-width="3.5" stroke-linejoin="round"/><path d="M30 60l-6-6M90 60l6-6" stroke="#183153" stroke-width="4"/><ellipse cx="60" cy="78" rx="34" ry="24" fill="#FF6B6B" stroke="#183153" stroke-width="4"/><path d="M50 56v-10M70 56v-10" stroke="#183153" stroke-width="3.5"/><circle cx="50" cy="44" r="6" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="70" cy="44" r="6" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="51" cy="45" r="2.5" fill="#183153"/><circle cx="71" cy="45" r="2.5" fill="#183153"/><path d="M50 82q10 8 20 0" stroke="#183153" stroke-width="3.5" fill="none"/><g fill="url(#gPiel)" stroke="#183153" stroke-width="3" stroke-linejoin="round"><path d="M100 18q12 4 14 18l-6 8-10-8-6 4-4-6 6-10z"/></g><path d="M6 20q4-8 10-4M4 34q6 2 8-4" stroke="#FF5D8F" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M40 28l6 4M60 22v6" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/></svg>`;
  const tarjetaPicto=(k,c)=>`<svg viewBox="0 0 120 120">${SL(60,112,38)}<rect x="14" y="10" width="92" height="92" rx="26" fill="${c}" stroke="#183153" stroke-width="4"/><g transform="translate(30 26) scale(2.5)" fill="none" stroke="#183153" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${P[k]}</g></svg>`;

  /* ---------- arrecife y utilidades ---------- */
  const corales=[
    `<g class="crece"><path d="M40 96V58M40 78q-18-6-20-28M40 70q18-6 18-30M40 60q-3-16 2-30" stroke="#FF5D8F" stroke-width="9" fill="none" stroke-linecap="round"/><g fill="#FF8FB1"><circle cx="20" cy="48" r="5"/><circle cx="58" cy="38" r="5"/><circle cx="42" cy="30" r="5"/></g></g>`,
    `<g class="crece"><path d="M40 96q-2-30 0-50" stroke="#2BB673" stroke-width="7" fill="none"/>${[-60,-30,0,30,60].map(a=>`<path d="M40 46q${a/3} -22 ${a/2.2} -34" stroke="#9B6BFF" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}<circle cx="40" cy="46" r="9" fill="#C3A3FF"/></g>`,
    `<g class="crece"><path d="M40 92l7-16 17-2-12-12 4-17-16 8-16-8 4 17-12 12 17 2z" fill="#FF8A3D" stroke="#D9581A" stroke-width="3" stroke-linejoin="round"/><g fill="#FFD7B0"><circle cx="40" cy="62" r="3"/><circle cx="32" cy="70" r="2"/><circle cx="48" cy="70" r="2"/></g></g>`,
    `<g class="crece"><path d="M40 96V60M40 76q-16-2-20-22M40 68q16-2 18-22" stroke="#FFC93C" stroke-width="10" fill="none" stroke-linecap="round"/><g fill="#FFE38A"><circle cx="20" cy="50" r="7"/><circle cx="58" cy="44" r="7"/><circle cx="40" cy="54" r="7"/></g></g>`,
    `<g class="crece"><path d="M18 96q-6-34 22-48q28 14 22 48z" fill="#3DBBC9" stroke="#16698A" stroke-width="3"/><path d="M40 50v44M28 60l8 34M52 60l-8 34" stroke="#16698A" stroke-width="2.5" opacity=".6"/></g>`
  ];
  arrecife.insertAdjacentHTML('afterbegin',corales.map(c=>`<svg class="coral" viewBox="0 0 80 100"><ellipse class="hueco" cx="40" cy="96" rx="20" ry="4"/>${c}</svg>`).join(''));
  const crecer=i=>{ const c=arrecife.querySelectorAll('.coral')[i]; if(c&&!c.classList.contains('on')){ c.classList.add('on'); jardinSuma(1); } };
  const azar=a=>a[Math.floor(Math.random()*a.length)];
  const mezcla=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
  const flecha='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- actividades ---------- */
  function pregunta({texto:t,opciones,esBien,alAcertar,pista,alTocar}){
    cara('feliz');
    nuevaZona(`<div class="opts">${opciones.map((o,i)=>`<button class="opt" type="button" id="op${i}" aria-label="${o.aria}"><span class="dib">${o.html}</span>${o.lbl?`<span class="lbl">${o.lbl}</span>`:''}</button>`).join('')}</div>`);
    decir(t);
    let fallos=0, fin=false;
    opciones.forEach((o,i)=>{ const b=$('#op'+i);
      b.addEventListener('click',()=>{
        if(fin) return; if(alTocar) alTocar(o);
        if(esBien(o)){
          fin=true; b.classList.remove('pista'); b.classList.add('bien'); zona.querySelectorAll('.opt').forEach(x=>x.disabled=true);
          if(!alTocar) acierto(); celebrar(b); anima('contento'); crecer(paso-1); alAcertar(o,b);
        } else {
          fallos++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); intento();
          cara('sorpresa'); decir(pista(o)); setTimeout(()=>cara('feliz'),1500);
          if(fallos>=2) opciones.forEach((p,j)=>{ if(esBien(p)) $('#op'+j).classList.add('pista'); });
        }
      });
    });
  }
  const may=s=>s[0].toUpperCase()+s.slice(1);

  const ACT={
    tiempo:{k:'tiempo',lbl:'El tiempo',run(){
      const n={sol:'Sol',nubes:'Nubes',lluvia:'Lluvia',viento:'Viento'};
      const r={sol:'¡Hace sol! Hoy podemos jugar en el patio.',nubes:'Hay nubes. El cielo está gris.',lluvia:'¡Llueve! Necesitamos el paraguas y las botas.',viento:'¡Hace viento! Las hojas vuelan, ¡fiuuu!'};
      pregunta({texto:'Mirad por la ventana. ¿Qué tiempo hace hoy?',opciones:Object.keys(TIEMPO).map(k=>({k,html:TIEMPO[k],lbl:n[k],aria:n[k]})),esBien:()=>true,pista:()=>'',alAcertar:o=>{ decir(r[o.k]); seguir(); }});
    }},
    colores:{k:'color',lbl:'Los colores',run(){
      pregunta({texto:`¡Ay, ay! He perdido mi calcetín ${colorDia}. ¿Me ayudáis a encontrarlo?`,opciones:mezcla(Object.keys(COLORES)).map(c=>({c,html:calcetin(c),aria:'calcetín '+c})),
        esBien:o=>o.c===colorDia,pista:o=>`Ese calcetín es ${o.c}. Yo busco el ${colorDia}.`,alAcertar:()=>{ decir(`¡Sí! Mi calcetín ${colorDia}. ¡Gracias, amigos!`); seguir(); }});
    }},
    peces:{k:'pez',lbl:'Contar',run(){
      const n=azar([1,2,3]), pal={1:'un pez',2:'dos peces',3:'tres peces'};
      pregunta({texto:`Quiero jugar con mis amigos del mar. ¿Dónde hay ${pal[n]}?`,opciones:mezcla([1,2,3]).map(k=>({k,html:peces(k),aria:pal[k]})),
        esBien:o=>o.k===n,pista:o=>`Ahí hay ${pal[o.k]}. Contad conmigo con el dedo.`,
        alAcertar:(o,b)=>{ decir(['Uno','dos','tres'].slice(0,n).join('… ')+'. ¡'+may(pal[n])+'!');
          b.querySelectorAll('g.p').forEach((el,i)=>setTimeout(()=>{ tono([440,880],'sine',.08,.06,.25); if(quieto()) return; el.style.transformBox='fill-box'; el.style.transformOrigin='center'; try{ el.animate([{transform:'scale(1)'},{transform:'scale(1.45)'},{transform:'scale(1)'}],{duration:520}); }catch(e){} },400+i*850));
          seguir(); }});
    }},
    pelotas:{k:'pelota',lbl:'Grande y pequeño',run(){
      const q=azar(['grande','pequeña']);
      pregunta({texto:`¡Vamos a jugar a la pelota! Dame la pelota ${q}.`,opciones:mezcla(['grande','pequeña']).map(t=>({t,html:pelota(t==='grande'?52:22),lbl:may(t),aria:'pelota '+t})),
        esBien:o=>o.t===q,pista:o=>`Esa pelota es ${o.t}. Yo quiero la ${q}.`,alAcertar:()=>{ decir(`¡Muy bien! La pelota ${q}. ¡Bota, bota, bota!`); seguir(); }});
    }},
    cuerpo:{k:'cuerpo',lbl:'Mi cuerpo',run(){
      const Q=[{k:'ojos',p:'¿Con qué miramos?',r:'¡Con los ojos! Tocaos los ojos.',l:'Ojos'},{k:'nariz',p:'¿Con qué olemos las flores?',r:'¡Con la nariz! Tocaos la nariz.',l:'Nariz'},{k:'boca',p:'¿Con qué comemos?',r:'¡Con la boca! Abrid la boca: ¡aaa!',l:'Boca'},{k:'manos',p:'¿Con qué damos palmas?',r:'¡Con las manos! Plas, plas, plas.',l:'Manos'}];
      const q=azar(Q);
      pregunta({texto:q.p,opciones:mezcla(Q).map(o=>({k:o.k,html:CUERPO[o.k],lbl:o.l,aria:o.l})),esBien:o=>o.k===q.k,pista:o=>`Esa es la parte del cuerpo «${Q.find(x=>x.k===o.k).l.toLowerCase()}». Probamos otra vez.`,alAcertar:()=>{ decir(q.r); seguir(); }});
    }},
    higiene:{k:'jabon',lbl:'Lavarse las manos',run(){
      pregunta({texto:'Antes de comer nos lavamos las manos. ¿Qué necesitamos?',opciones:mezcla([{k:'jabon',html:jabon,lbl:'Jabón'},{k:'pelota',html:pelota(36),lbl:'Pelota'},{k:'calcetin',html:calcetin('azul'),lbl:'Calcetín'}]).map(o=>({...o,aria:o.lbl})),
        esBien:o=>o.k==='jabon',pista:o=>`Con la ${o.lbl.toLowerCase()} no nos lavamos. ¿Qué hace burbujas?`,alAcertar:()=>{ decir('¡El jabón! Agua, jabón, frotamos, frotamos… ¡y aclaramos!'); seguir(); }});
    }},
    animales:{k:'pata',lbl:'Los animales',run(){
      const Q=[{k:'gato',s:'miau',l:'Gato'},{k:'perro',s:'guau',l:'Perro'},{k:'vaca',s:'muuu',l:'Vaca'},{k:'pato',s:'cuac',l:'Pato'}], q=azar(Q);
      pregunta({texto:`Escuchad: «${q.s}, ${q.s}». ¿Quién dice «${q.s}»?`,opciones:mezcla(Q).map(o=>({k:o.k,html:ANIMALES[o.k],lbl:o.l,aria:o.l})),
        esBien:o=>o.k===q.k,pista:o=>{ const a=Q.find(x=>x.k===o.k); return `El ${a.l.toLowerCase()} dice «${a.s}». ¿Quién dice «${q.s}»?`; },
        alAcertar:()=>{ decir(`¡El ${q.l.toLowerCase()}! Todos juntos: ${q.s}, ${q.s}.`); seguir(); }});
    }},
    instrumentos:{k:'nota',lbl:'Los instrumentos',run(){
      const Q=[{k:'castanuelas',l:'Castañuelas',a:'las castañuelas'},{k:'pandereta',l:'Pandereta',a:'la pandereta'},{k:'tambor',l:'Tambor',a:'el tambor'},{k:'guitarra',l:'Guitarra',a:'la guitarra'}], q=azar(Q);
      pregunta({texto:`¡Vamos a hacer música! ¿Dónde está ${q.a}?`,opciones:mezcla(Q).map(o=>({k:o.k,html:INSTRUMENTOS[o.k],lbl:o.l,aria:o.l})),
        alTocar:o=>INSTR[o.k](),esBien:o=>o.k===q.k,pista:o=>`Eso suena así porque es ${Q.find(x=>x.k===o.k).a}. Busco ${q.a}.`,
        alAcertar:()=>{ decir(`¡Sí, ${q.a}! Escuchad cómo suena.`); seguir(); }});
    }},
    ayudar:{k:'corazon',lbl:'Ayudar',run(){
      cara('triste');
      pregunta({texto:'Mi amigo el cangrejo se ha caído y está llorando. ¿Qué hacemos?',opciones:mezcla([{k:'ayudar',html:cangrejo,lbl:'Le ayudamos'},{k:'reir',html:CARAS.risa,lbl:'Nos reímos'}]).map(o=>({...o,aria:o.lbl})),
        esBien:o=>o.k==='ayudar',pista:()=>'Si nos reímos, el cangrejo se pone más triste. ¿Qué otra cosa podemos hacer?',
        alAcertar:()=>{ cara('feliz'); decir('¡Le ayudamos a levantarse y le damos un abrazo! Ahora el cangrejo está contento.'); seguir(); }});
      cara('triste');
    }},
    votar:{k:'estrella',lbl:'Lo que más me gustó',run(){
      const O=[{k:'color',l:'Los colores',c:'#FFE38A'},{k:'pez',l:'Los peces',c:'#BFEAF2'},{k:'pata',l:'Los animales',c:'#FFD3B3'},{k:'nota',l:'La música',c:'#DCCBFF'}];
      pregunta({texto:'¡Esta semana hemos jugado mucho! ¿Qué os ha gustado más?',opciones:O.map(o=>({k:o.k,html:tarjetaPicto(o.k,o.c),lbl:o.l,aria:o.l})),esBien:()=>true,pista:()=>'',
        alAcertar:o=>{ decir(`¡${O.find(x=>x.k===o.k).l}! A mí también me encanta.`); seguir(); }});
    }}
  };

  function movimiento(pic,frase,extra){
    cara('feliz');
    nuevaZona(`<div class="tarjeta-mov"><span class="pic">${icono(pic)}</span><p>${frase}</p></div>${extra||''}`);
  }
  const MOV={
    algas:{lbl:'Somos algas',run(){ movimiento('mover','De pie. Subimos los brazos muy arriba y nos movemos despacito, como las algas del mar.'); decir('¡A movernos! Somos algas: brazos arriba y nos movemos despacito, a un lado… y al otro.'); anima('contento'); hecho('¡Ya nos hemos movido!'); }},
    saltos:{lbl:'Saltos',run(){ movimiento('mover','De pie. Saltamos con Lolo tres veces: uno, dos y tres.'); decir('¡A movernos! Poneos de pie y saltad conmigo: uno, dos, tres.'); anima('salta'); hecho('¡Ya hemos saltado!'); }},
    cancion:{lbl:'Cabeza y pies',run(){ movimiento('cuerpo','Nos tocamos cabeza, hombros, rodillas y pies. Primero despacio y luego un poco más rápido.'); decir('¡A movernos! Tocad conmigo: cabeza, hombros, rodillas y pies.'); hecho('¡Ya lo hemos hecho!'); }},
    palmas:{lbl:'Palmas',run(){
      const n=azar([2,3]);
      movimiento('nota',`Escuchamos las palmas de Lolo y las repetimos: <b>${n} palmas</b>.`,
        `<svg class="palma" id="palma" viewBox="0 0 120 110" style="width:110px;justify-self:center">${CUERPO.manos.replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>`);
      const tocar=()=>{ for(let i=0;i<n;i++){ palmada(i*.6); setTimeout(()=>{ const p=$('#palma'); if(p&&!quieto()){ p.classList.remove('golpe'); void p.getBoundingClientRect(); p.classList.add('golpe'); } },i*600); } };
      decir(`¡A movernos! Escuchad mis palmas y repetidlas. ¡${may(['','una','dos','tres'][n])} palmas!`);
      setTimeout(tocar,1800);
      const f=document.createElement('div'); f.className='fila'; zona.appendChild(f);
      const b2=document.createElement('button'); b2.className='big sec'; b2.type='button'; b2.innerHTML='<span>Escuchar otra vez</span>'; b2.onclick=tocar; f.appendChild(b2);
      hecho('¡Lo hemos hecho!',f);
    }},
    respirar:{lbl:'Respirar',run(){
      movimiento('aire','Nos sentamos. Cogemos aire cuando el globo crece y lo soltamos cuando se hace pequeño.',`<div class="respira"><div class="globo"></div><p class="respTxt">Coge aire…</p></div>`);
      decir('Ahora nos sentamos y respiramos como Lolo. Cogemos aire… y lo soltamos despacito.');
      hecho('¡Ya estamos tranquilos!');
    }}
  };
  function hecho(t,cont){ boton(t,()=>{ crecer(paso-1); acierto(); anima('contento'); celebrar(arrecife); const b=zona.querySelector('.big:last-child'); if(b) b.disabled=true; setTimeout(()=>{ paso++; runStep(); },600); },true,cont); }

  const PUENTE={
    0:()=>`Buscad por la clase cosas de color <strong>${colorDia}</strong> y ponedlas en la alfombra. Después contad juntos: ¿hay una, dos o tres?`,
    1:()=>'Coged tres objetos de la clase. Los contamos juntos y los ordenamos del más grande al más pequeño.',
    2:()=>'Vamos al lavabo a lavarnos las manos con agua y jabón, cantando la canción de Lolo.',
    3:()=>'Sacad los instrumentos de la clase y repetid las palmas de Lolo con ellos.',
    4:()=>'Nos sentamos en círculo y cada uno le dice algo bonito al compañero de al lado. También vale dar la mano o un abrazo, si él quiere.'
  };

  const DIAS=[
    {n:'Lunes',c:'var(--lun)',acts:['tiempo','colores'],mov:'algas',r:'el día amarillo'},
    {n:'Martes',c:'var(--mar)',acts:['peces','pelotas'],mov:'saltos',r:'el día rosa'},
    {n:'Miércoles',c:'var(--mie)',acts:['cuerpo','higiene'],mov:'cancion',r:'el día verde'},
    {n:'Jueves',c:'var(--jue)',acts:['animales','instrumentos'],mov:'palmas',r:'el día morado'},
    {n:'Viernes',c:'var(--vie)',acts:['ayudar','votar'],mov:'respirar',r:'el día azul'}
  ];
  function agendaDe(d){
    const D=DIAS[d];
    return [{k:'hola',lbl:'Hola'},{k:'cara',lbl:'¿Cómo estás?'},{k:ACT[D.acts[0]].k,lbl:ACT[D.acts[0]].lbl},{k:ACT[D.acts[1]].k,lbl:ACT[D.acts[1]].lbl},{k:D.mov==='palmas'?'nota':D.mov==='respirar'?'aire':D.mov==='cancion'?'cuerpo':'mover',lbl:MOV[D.mov].lbl},{k:'fin',lbl:'Adiós'}];
  }
  function pintaAgenda(){
    if(modo!=='lolo') return;
    const a=agendaDe(dia);
    agendaEl.innerHTML=a.map((s,i)=>`${i?'<svg class="flecha-ag" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>':''}<div class="ag ${i<paso?'hecho':''} ${i===paso&&iniciado?'ahora':''}">${i===paso&&iniciado?'<span class="tag">Ahora</span>':''}${i===paso+1&&iniciado?'<span class="tag despues">Después</span>':''}<span class="pic">${icono(s.k)}</span><span>${s.lbl}</span></div>`).join('');
  }
  function ponDia(d){
    dia=d; const D=DIAS[d]; app.style.setProperty('--dia',D.c); $('#diaMarca').textContent=D.n; pintaAgenda();
    document.querySelectorAll('.dia').forEach((b,i)=>b.setAttribute('aria-pressed',i===d));
  }

  function nuevaZona(html=''){ zona.classList.remove('entra'); void zona.offsetWidth; zona.innerHTML=html; if(!quieto()) zona.classList.add('entra'); pintaAgenda(); }
  function boton(t,fn,pulso,cont,pic){
    const b=document.createElement('button'); b.className='big'+(pulso?' pulso':''); b.type='button';
    b.innerHTML=(pic?`<span class="mini">${icono(pic)}</span>`:'')+`<span>${t}</span>${flecha}`; b.addEventListener('click',fn);
    (cont||zona).appendChild(b);
    if(!quieto()&&b.animate) b.animate([{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'none'}],{duration:350,easing:'cubic-bezier(.3,1.6,.5,1)'}); return b;
  }
  function seguir(){ const sig=agendaDe(dia)[paso+1]; setTimeout(()=>boton('Ahora: '+sig.lbl,()=>{ paso++; runStep(); },true,null,sig.k),700); }

  let iniciado=false;
  function runStep(){
    const D=DIAS[dia], ag=agendaDe(dia);
    if(paso===0){
      cara('feliz'); nuevaZona();
      decir(`¡Hola, amigos! Hoy es ${D.n.toLowerCase()}, ${D.r}. Primero, ${ag[1].lbl.toLowerCase()}. Después, ${ag[2].lbl.toLowerCase()} y ${ag[3].lbl.toLowerCase()}. Luego nos movemos. Y al final, adiós.`);
      boton('Ahora: ¿Cómo estás?',()=>{ paso++; runStep(); },true,null,'cara');
    } else if(paso===1){
      const nom={feliz:'Alegre',triste:'Triste',enfado:'Enfadado',sorpresa:'Sorprendido'};
      const resp={feliz:'¡Estás alegre! Yo también estoy muy contento de veros.',triste:'Estás triste. Te mando un abrazo de pulpo, ¡con ocho brazos!',enfado:'Estás enfadado. Respiramos juntos: cogemos aire… y lo soltamos despacito.',sorpresa:'¡Estás sorprendido! ¡Oooh! Hoy van a pasar cosas divertidas.'};
      pregunta({texto:'¿Cómo estáis hoy?',opciones:['feliz','triste','enfado','sorpresa'].map(k=>({k,html:CARAS[k],lbl:nom[k],aria:nom[k]})),esBien:()=>true,pista:()=>'',alAcertar:o=>{ cara(o.k); decir(resp[o.k]); seguir(); }});
    } else if(paso===2||paso===3){
      ACT[D.acts[paso-2]].run();
    } else if(paso===4){
      MOV[D.mov].run();
    } else {
      cara('feliz');
      nuevaZona(`<div class="manos"><svg class="ic" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#fff"/><path d="M22 44V24a3 3 0 0 1 6 0v12M28 34V18a3 3 0 0 1 6 0v16M34 34V20a3 3 0 0 1 6 0v16M40 36v-8a3 3 0 0 1 6 0v10c0 8-6 14-14 14h-2c-5 0-8-2-11-6l-6-8a3 3 0 0 1 5-4l4 4" fill="#FFD7B0" stroke="#183153" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg><div><b>Ahora, sin pantalla</b><p>${PUENTE[dia]()}</p></div></div>
        <div class="fila"><span class="fin"><span class="c">${icono('fin').replace('stroke="currentColor"','stroke="#fff"')}</span>Se acabó Lolo por hoy</span></div>`);
      const prox = dia<4 ? `Mañana es ${DIAS[dia+1].n.toLowerCase()} y vuelvo.` : 'El lunes vuelvo.';
      decir(`¡Mirad nuestro arrecife! Ha crecido porque me habéis ayudado todos juntos. Por hoy, se acabó. ${prox} ¡Adiós, amigos!`);
      crecer(4); celebrar(arrecife);
      paso=6; pintaAgenda(); paso=5;
      document.querySelectorAll('.ag').forEach(a=>{ a.classList.add('hecho'); a.classList.remove('ahora'); a.querySelectorAll('.tag').forEach(t=>t.remove()); });
      const f=document.createElement('div'); f.className='fila'; zona.appendChild(f);
      boton('Volver al inicio',inicio,false,f);
    }
  }

  function inicio(){
    iniciado=false; paso=0; cara('duerme');
    arrecife.querySelectorAll('.coral').forEach(c=>c.classList.remove('on'));
    colorDia=azar(Object.keys(COLORES));
    nuevaZona(`<div class="semana" role="group" aria-label="Elegir el día">${DIAS.map((D,i)=>`<button class="dia" type="button" style="--c:${D.c}" aria-pressed="${i===dia}"><i></i>${D.n}<small>${ACT[D.acts[0]].lbl} · ${ACT[D.acts[1]].lbl}</small></button>`).join('')}</div>`);
    document.querySelectorAll('.dia').forEach((b,i)=>b.addEventListener('click',()=>ponDia(i)));
    texto.textContent='Shhh… Lolo está dormido. ¿Lo despertamos? Decid todos juntos: «¡Lolo, despierta!»';
    ultimo=texto.textContent;
    boton('Despertar a Lolo',()=>{ iniciado=true; cara('sorpresa'); anima('salta'); acierto(); setTimeout(runStep,quieto()?300:1000); },true);
    ponDia(dia);
  }

  /* ---------- herramientas ---------- */
  function aplicaCalma(){ app.classList.toggle('calma',calma); $('#btnTranquilo').setAttribute('aria-pressed',calma); try{ localStorage.setItem('lolo-calma',calma?'1':'0'); }catch(e){} }
  $('#btnTranquilo').addEventListener('click',()=>{ calma=!calma; aplicaCalma(); });
  $('#btnRepetir').addEventListener('click',()=>{ if(ultimo) decir(ultimo); });
  const vozCapa=$('#vozCapa');
  function ponVoz(on){ voz=on; $('#btnSonido').setAttribute('aria-pressed',voz); $('#txtVoz').textContent=voz?'Voz':'Sin voz';
    $('#ondas').style.display=voz?'':'none'; $('#mute').style.display=voz?'none':''; $('#vozOn').checked=voz;
    if(!voz){ try{ speechSynthesis.cancel(); }catch(e){} } }
  $('#btnSonido').addEventListener('click',()=>{ cargar(); vozCapa.hidden=false; $('#selVoz').focus(); });
  $('#vozOn').addEventListener('change',e=>ponVoz(e.target.checked));
  $('#selVoz').addEventListener('change',e=>{ vozEs=voces.find(v=>v.voiceURI===e.target.value)||vozEs; try{ localStorage.setItem('lolo-voz',e.target.value); }catch(err){} hablar('¡Hola! Soy Lolo. ¿Te gusta mi voz?'); });
  $('#probarVoz').addEventListener('click',()=>hablar('¡Hola, amigos! Soy Lolo, el pulpo. ¿Jugamos juntos?'));
  $('#cerrarVoz').addEventListener('click',()=>vozCapa.hidden=true);
  vozCapa.addEventListener('click',e=>{ if(e.target===vozCapa) vozCapa.hidden=true; });
  // texto de la respiración (rincón y viernes)
  let inhala=true; setInterval(()=>{ inhala=!inhala; document.querySelectorAll('.respTxt').forEach(p=>p.textContent=inhala?'Coge aire…':'Suelta el aire…'); },4000);
  const rincon=$('#rincon'), guia=$('#guia');
  let textoAntes='';
  $('#btnRincon').addEventListener('click',()=>{ textoAntes=ultimo; try{ speechSynthesis.cancel(); }catch(e){} rincon.hidden=false; $('#cerrarRincon').focus(); decir('Vamos a respirar juntos. Cogemos aire… y lo soltamos despacito.'); });
  $('#cerrarRincon').addEventListener('click',()=>{ rincon.hidden=true; if(textoAntes) decir(textoAntes); });
  $('#btnGuia').addEventListener('click',()=>{ guia.hidden=false; $('#cerrarGuia').focus(); });
  $('#cerrarGuia').addEventListener('click',()=>guia.hidden=true);
  guia.addEventListener('click',e=>{ if(e.target===guia) guia.hidden=true; });
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ guia.hidden=true; vozCapa.hidden=true; $('#menuCapa').hidden=true; } });

  /* ================= LA CAJA MISTERIOSA ================= */
  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const K='#183153';
  const TAPAS=[
    {n:'la estrella',c:'#FFC93C',s:'<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>'},
    {n:'el círculo',c:'#3D8DF2',s:'<circle cx="12" cy="12" r="9"/>'},
    {n:'el corazón',c:'#FF5D8F',s:'<path d="M12 21s-8.5-5.2-8.5-11.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8.5 2.8C20.5 15.8 12 21 12 21z"/>'},
    {n:'el triángulo',c:'#2BB673',s:'<path d="M12 3l9.5 17h-19z"/>'},
    {n:'el cuadrado',c:'#9B6BFF',s:'<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/>'},
    {n:'la luna',c:'#FF8A3D',s:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'}
  ];
  const RUT={
    veo:{lbl:'Veo',ic:'ojo',c:'#3DBBC9',fr:['¿Qué veis? ¿Qué colores hay?','Mirad bien. ¿Qué veis ahora? ¿Hay alguna forma?','¿Qué veis en esta ventanita? Señaladlo con el dedo.']},
    pienso:{lbl:'Pienso',ic:'bombilla',c:'#FFC93C',fr:['¿Qué pensáis que es? Todas las ideas valen.','¿Qué creéis que hay escondido en la caja?','Mmm… ¿Y ahora qué pensáis? ¿Alguien ha cambiado de idea?']},
    pregunto:{lbl:'Me pregunto',ic:'pregunta',c:'#9B6BFF',fr:['¿Qué os preguntáis? ¿Será un animal? ¿Será algo de comer?','Me pregunto si será grande o pequeño. ¿Y vosotros, qué os preguntáis?','¿Qué os gustaría saber de lo que hay en la caja?']}
  };
  const ORDEN=['veo','pienso','pregunto'];
  const sombraC=(cx,cy,rx)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*.09}" fill="#0B3550" opacity=".16"/>`;
  const OBJ=[
    {nombre:'una tortuga',pista:'Anda muy despacito y lleva su casa a cuestas.',preg:'Ahora me pregunto… ¿qué come la tortuga? ¿Dónde duerme? ¿Y vosotros, qué os preguntáis?',
     svg:`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#D4F2E0"/><circle cx="62" cy="58" r="30" fill="#FFE38A"/><path d="M0 238q100-24 200 0t200 0v62H0z" fill="#8FD19E"/>${sombraC(205,252,160)}
      <g stroke="${K}" stroke-width="5" stroke-linejoin="round"><path d="M76 212l-30 10 32 10z" fill="#9BD86A"/><rect x="104" y="196" width="44" height="56" rx="20" fill="#9BD86A"/><rect x="252" y="196" width="44" height="56" rx="20" fill="#9BD86A"/></g>
      <path d="M296 204q12-32 34-38" stroke="${K}" stroke-width="40" stroke-linecap="round" fill="none"/><path d="M296 204q12-32 34-38" stroke="#9BD86A" stroke-width="30" stroke-linecap="round" fill="none"/>
      <circle cx="336" cy="160" r="40" fill="#9BD86A" stroke="${K}" stroke-width="5"/><circle cx="348" cy="150" r="9" fill="${K}"/><circle cx="351" cy="147" r="3" fill="#fff"/><path d="M336 176q14 10 28 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="322" cy="170" rx="8" ry="5" fill="#FF5D8F" opacity=".4"/>
      <path d="M72 220q4-146 128-146t128 146z" fill="#3FA96B" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <g fill="#6CC48C" stroke="#2E8A55" stroke-width="3" stroke-linejoin="round"><path d="M200 102l28 16v32l-28 16-28-16v-32z"/><path d="M138 142l24 14v28l-24 14-24-14v-28z"/><path d="M262 142l24 14v28l-24 14-24-14v-28z"/><path d="M200 178l24 12v22h-48v-22z"/></g>
      <path d="M112 150q20-56 80-66" stroke="#fff" stroke-width="8" opacity=".35" fill="none" stroke-linecap="round"/>
      <rect x="62" y="210" width="276" height="22" rx="11" fill="#E8C66A" stroke="${K}" stroke-width="5"/></svg>`},
    {nombre:'una fresa',pista:'Es roja, dulce y tiene muchas semillitas por fuera.',preg:'Ahora me pregunto… ¿dónde crecen las fresas? ¿A quién le gustan? ¿Y vosotros, qué os preguntáis?',
     svg:`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#FFE3EA"/><g fill="#fff" opacity=".6">${[[40,40],[360,60],[60,200],[350,220],[300,30],[90,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8"/>`).join('')}</g>
      <ellipse cx="200" cy="266" rx="160" ry="24" fill="#fff" stroke="${K}" stroke-width="5"/>
      <path d="M200 262c-70-30-120-90-108-150 8-38 52-52 108-40 56-12 100 2 108 40 12 60-38 120-108 150z" fill="#F23B4F" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M128 118q10-26 44-30" stroke="#fff" stroke-width="10" opacity=".45" fill="none" stroke-linecap="round"/>
      <g fill="#FFE38A" stroke="#C9283A" stroke-width="1.5">${[[150,130],[200,112],[250,130],[126,165],[274,165],[150,205],[250,205],[176,234],[224,234],[200,254],[118,140],[282,140]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="6"/>`).join('')}</g>
      <circle cx="180" cy="168" r="8" fill="${K}"/><circle cx="220" cy="168" r="8" fill="${K}"/><circle cx="182" cy="165" r="2.5" fill="#fff"/><circle cx="222" cy="165" r="2.5" fill="#fff"/><path d="M188 186q12 12 24 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="164" cy="184" rx="9" ry="5" fill="#FF9EB0"/><ellipse cx="236" cy="184" rx="9" ry="5" fill="#FF9EB0"/>
      <path d="M200 80l-60-18 30 26-44 4 46 14-10 22 38-30 38 30-10-22 46-14-44-4 30-26z" fill="#2BB673" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M200 70q4-30 20-40" stroke="#2E8A55" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`},
    {nombre:'un elefante',pista:'Es muy grande, tiene las orejas enormes y una trompa muy larga.',preg:'Ahora me pregunto… ¿para qué usa la trompa el elefante? ¿Dónde vive? ¿Y vosotros, qué os preguntáis?',
     svg:`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#CFE9FF"/><g fill="#fff"><ellipse cx="70" cy="56" rx="42" ry="15"/><ellipse cx="332" cy="46" rx="46" ry="15"/></g><rect y="252" width="400" height="48" fill="#F5D596"/>
      <ellipse cx="110" cy="140" rx="78" ry="90" fill="#A9B4C6" stroke="${K}" stroke-width="6"/><ellipse cx="290" cy="140" rx="78" ry="90" fill="#A9B4C6" stroke="${K}" stroke-width="6"/><ellipse cx="116" cy="146" rx="50" ry="62" fill="#F4B6C8"/><ellipse cx="284" cy="146" rx="50" ry="62" fill="#F4B6C8"/>
      <ellipse cx="200" cy="140" rx="82" ry="86" fill="#BAC4D4" stroke="${K}" stroke-width="6"/>
      <path d="M164 196q-6 22 10 32q2-14 4-28z" fill="#FFF8E7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M236 196q6 22-10 32q-2-14-4-28z" fill="#FFF8E7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M182 188q-4 62 20 82q24 18 44-4q8-10-2-16q-10-4-16 4q-10 8-18-2q-10-14-8-64z" fill="#BAC4D4" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M186 214h20M188 232h20M194 250h16" stroke="#8D98AB" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="168" cy="128" rx="10" ry="13" fill="${K}"/><ellipse cx="232" cy="128" rx="10" ry="13" fill="${K}"/><circle cx="171" cy="123" r="3.5" fill="#fff"/><circle cx="235" cy="123" r="3.5" fill="#fff"/><ellipse cx="150" cy="160" rx="10" ry="6" fill="#FF9EB0" opacity=".7"/><ellipse cx="250" cy="160" rx="10" ry="6" fill="#FF9EB0" opacity=".7"/>
      <path d="M194 58q2-18 12-12M206 58q8-16 16-6" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M150 90q20-20 50-24" stroke="#fff" stroke-width="7" opacity=".4" fill="none" stroke-linecap="round"/></svg>`},
    {nombre:'una mariquita',pista:'Es un bichito pequeño, rojo con puntos negros, y puede volar.',preg:'Ahora me pregunto… ¿cuántos puntos tiene la mariquita? ¿Dónde vive? ¿Y vosotros, qué os preguntáis?',
     svg:`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E3F7D6"/>
      <path d="M20 262q110-210 360-170q-70 200-360 170z" fill="#5CCB78" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M34 256q170-84 330-156M150 202q0-40-20-70M240 158q10-40 0-74M300 128q30-10 50-40" stroke="#2E9E4F" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g stroke="${K}" stroke-width="5" stroke-linecap="round"><path d="M150 214l-16 22M200 224l-6 26M250 210l10 24"/></g>
      <path d="M306 100q12-30 32-34M290 96q-2-30 12-42" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="340" cy="64" r="8" fill="${K}"/><circle cx="304" cy="52" r="8" fill="${K}"/>
      <circle cx="302" cy="132" r="38" fill="${K}"/><circle cx="300" cy="122" r="10" fill="#fff"/><circle cx="324" cy="134" r="10" fill="#fff"/><circle cx="303" cy="124" r="4.5" fill="${K}"/><circle cx="327" cy="136" r="4.5" fill="${K}"/><path d="M302 150q10 6 18-2" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="200" cy="172" rx="102" ry="76" fill="#F23B3B" stroke="${K}" stroke-width="6" transform="rotate(-18 200 172)"/>
      <path d="M292 142L110 202" stroke="${K}" stroke-width="5"/>
      <g fill="${K}"><circle cx="186" cy="132" r="15"/><circle cx="244" cy="128" r="12"/><circle cx="148" cy="190" r="15"/><circle cx="214" cy="204" r="16"/><circle cx="262" cy="172" r="11"/><circle cx="126" cy="152" r="9"/></g>
      <path d="M126 134q30-34 84-40" stroke="#fff" stroke-width="8" opacity=".4" fill="none" stroke-linecap="round"/></svg>`},
    {nombre:'un helado',pista:'Está muy frío, es dulce y lo comemos en verano.',preg:'Ahora me pregunto… ¿de qué sabor será? ¿Por qué se derrite? ¿Y vosotros, qué os preguntáis?',
     svg:`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><defs><clipPath id="clipCono"><path d="M146 150l54 144 54-144z"/></clipPath></defs><rect width="400" height="300" fill="#FFF3C4"/>
      <g stroke-width="5" stroke-linecap="round">${[[60,60,'#FF5D8F'],[340,80,'#3DBBC9'],[80,220,'#2BB673'],[330,230,'#9B6BFF'],[300,30,'#FF8A3D'],[50,140,'#3D8DF2'],[360,160,'#FF5D8F']].map(([x,y,c],i)=>`<path d="M${x} ${y}l${i%2?10:-8} ${i%2?6:10}" stroke="${c}"/>`).join('')}</g>
      <path d="M146 150l54 144 54-144z" fill="#E8A75A" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <g clip-path="url(#clipCono)" stroke="#B9772F" stroke-width="4"><path d="M120 190l160-80M120 222l160-80M120 254l160-80M120 160l160 120M120 128l160 120M150 110l160 120"/></g>
      <circle cx="200" cy="82" r="52" fill="#9EE6C4" stroke="${K}" stroke-width="6"/><g fill="#6B4226">${[[180,64],[214,58],[198,90],[226,86],[172,96]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="3" transform="rotate(30 ${x} ${y})"/>`).join('')}</g>
      <path d="M126 158q-10-62 74-72q84 10 74 72q-14 12-24 0q-12 12-25 0q-12 12-25 0q-12 12-25 0q-12 12-25 0q-12 10-24 0z" fill="#FF9EC0" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="182" cy="122" r="7" fill="${K}"/><circle cx="218" cy="122" r="7" fill="${K}"/><circle cx="184" cy="119" r="2.4" fill="#fff"/><circle cx="220" cy="119" r="2.4" fill="#fff"/><path d="M190 136q10 10 20 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M150 112q10-20 34-24" stroke="#fff" stroke-width="7" opacity=".5" fill="none" stroke-linecap="round"/>
      <path d="M212 32q4-16 20-18" stroke="#2E8A55" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="210" cy="34" r="14" fill="#E5484D" stroke="${K}" stroke-width="4"/><circle cx="205" cy="29" r="4" fill="#fff" opacity=".7"/></svg>`}
  ];
  let cajaIdx=-1, abiertas=0, rPaso=-1, cajaFin=false, ideas=[];
  const usadas={};
  const cajaImg=$('#cajaImg'), tapasEl=$('#tapas');
  document.querySelectorAll('.rut').forEach(b=>{ b.querySelector('.ri').innerHTML=icono(RUT[b.dataset.r].ic); b.addEventListener('click',()=>pedir(b.dataset.r)); });
  const flechaAg='<svg class="flecha-ag" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
  function pintaRutina(){
    if(modo!=='caja') return;
    const items=[...ORDEN.map(k=>({k:RUT[k].ic,lbl:RUT[k].lbl})),{k:'estrella',lbl:'¡Lo vemos!'}];
    const cur=cajaFin?3:rPaso;
    agendaEl.innerHTML=items.map((s,i)=>`${i?flechaAg:''}<div class="ag ${cajaFin&&i<3?'hecho':''} ${i===cur?'ahora':''}">${i===cur?'<span class="tag">Ahora</span>':''}<span class="pic">${icono(s.k)}</span><span>${s.lbl}</span></div>`).join('');
    document.querySelectorAll('.rut').forEach(b=>{ b.classList.toggle('on',!cajaFin&&b.dataset.r===ORDEN[rPaso]); b.disabled=cajaFin; });
  }
  function frase(k){ const L=RUT[k].fr; usadas[k]=((usadas[k]??-1)+1)%L.length; return L[usadas[k]]; }
  function nuevaCaja(){
    let i; do{ i=Math.floor(Math.random()*OBJ.length); }while(i===cajaIdx);
    cajaIdx=i; abiertas=0; rPaso=-1; cajaFin=false; ideas=[]; pintaIdeas();
    cajaImg.innerHTML=OBJ[i].svg;
    tapasEl.innerHTML=TAPAS.map((t,j)=>`<button class="tapa" type="button" style="--c:${t.c}" data-j="${j}" aria-label="Abrir ${t.n}"><svg viewBox="0 0 24 24" fill="#fff">${t.s}</svg></button>`).join('');
    tapasEl.querySelectorAll('.tapa').forEach(b=>b.addEventListener('click',()=>abrir(b)));
    $('#btnPista').hidden=false; $('#btnDestapar').hidden=false; $('#btnOtra').hidden=true; $('#btnPreg').hidden=true;
    cara('sorpresa'); anima('salta');
    decir('¡Mirad! He traído una caja misteriosa. Dentro hay algo escondido. ¿Qué ventanita abrimos primero? ¿La estrella? ¿La luna?');
    pintaRutina();
  }
  function abrir(b){
    if(cajaFin||b.classList.contains('abierta')) return;
    b.classList.add('abierta'); b.disabled=true; abiertas++;
    tono([660,990],'sine',.1,.07,.3);
    if(abiertas>=TAPAS.length){ destapar(); return; }
    rPaso=(abiertas-1)%3; cara('feliz');
    decir(`¡Abrimos ${TAPAS[+b.dataset.j].n}! ${frase(ORDEN[rPaso])}`);
    pintaRutina();
  }
  function pedir(k){ if(cajaFin) return; rPaso=ORDEN.indexOf(k); cara('feliz'); decir(frase(k)); pintaRutina(); }
  function destapar(){
    cajaFin=true; tapasEl.querySelectorAll('.tapa').forEach(b=>{ b.classList.add('abierta'); b.disabled=true; });
    const o=OBJ[cajaIdx];
    acierto(); celebrar($('.caja-marco')); anima('contento'); cara('feliz'); jardinSuma(1);
    decir(`¡Es ${o.nombre}! ¿Alguien había pensado que era ${o.nombre}?`);
    $('#btnPista').hidden=true; $('#btnDestapar').hidden=true; $('#btnOtra').hidden=false; $('#btnPreg').hidden=false;
    pintaRutina();
  }
  function pintaIdeas(){
    const el=$('#ideas');
    el.innerHTML=ideas.length?ideas.map((d,i)=>`<button type="button" class="idea" style="--c:${RUT[d.k].c};rotate:${d.rot}deg" data-i="${i}" title="Tocar para quitar" aria-label="Quitar la idea ${esc(d.t)}">${icono(RUT[d.k].ic)}<span>${esc(d.t)}</span></button>`).join(''):'<p class="vacio">Aquí apuntamos lo que dicen los niños. Tocad una idea para quitarla.</p>';
    el.querySelectorAll('.idea').forEach(b=>b.addEventListener('click',()=>{ ideas.splice(+b.dataset.i,1); pintaIdeas(); }));
  }
  $('#formIdea').addEventListener('submit',e=>{ e.preventDefault(); const v=$('#inIdea').value.trim(); if(!v) return;
    ideas.push({t:v,k:rPaso>=0?ORDEN[rPaso]:'pienso',rot:(Math.random()*6-3).toFixed(1)}); $('#inIdea').value=''; pintaIdeas(); });
  $('#btnPista').addEventListener('click',()=>{ cara('feliz'); decir('Os doy una pista: '+OBJ[cajaIdx].pista); });
  $('#btnDestapar').addEventListener('click',destapar);
  $('#btnOtra').addEventListener('click',nuevaCaja);
  $('#btnPreg').addEventListener('click',()=>{ rPaso=2; decir(OBJ[cajaIdx].preg); });

  /* ================= MINIJUEGOS ================= */
  Object.assign(P,{
    j_cuenta:'<rect x="3" y="4" width="18" height="16" rx="4"/><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="800" fill="currentColor" stroke="none" font-family="Fredoka, sans-serif">123</text>',
    j_series:'<circle cx="5" cy="12" r="3"/><rect x="9.5" y="9" width="5" height="6" rx="1"/><circle cx="19" cy="12" r="3"/>',
    j_cestas:'<path d="M3 10h18l-2 10H5z"/><path d="M8 10l3-6M16 10l-3-6M7 14.5h10"/>',
    j_tamanos:'<circle cx="4.5" cy="17.5" r="2"/><circle cx="10.5" cy="15.5" r="4"/><circle cx="18" cy="13" r="5.5"/>',
    j_parejas:'<rect x="2.5" y="5" width="9" height="14" rx="2"/><rect x="12.5" y="5" width="9" height="14" rx="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/>',
    j_formas:'<circle cx="7" cy="7.5" r="3.5"/><path d="M17 3.5l4 7h-8z"/><rect x="3.5" y="14" width="7" height="7" rx="1"/><path d="M17 13.5l1.3 2.6 2.8.4-2 2 .5 2.8-2.6-1.4-2.6 1.4.5-2.8-2-2 2.8-.4z"/>'
  });
  const COL={rojo:'#FF5A5F',azul:'#3D8DF2',amarillo:'#FFC93C',verde:'#2BB673'};
  const colAdj=(c,f)=>f&&/o$/.test(c)?c.slice(0,-1)+'a':c;
  const FORMAS={
    circulo:{n:'círculo',pl:'círculos',d:'<circle cx="50" cy="50" r="42"/>'},
    cuadrado:{n:'cuadrado',pl:'cuadrados',d:'<rect x="10" y="10" width="80" height="80" rx="10"/>'},
    triangulo:{n:'triángulo',pl:'triángulos',d:'<path d="M50 8L94 88H6z"/>'},
    estrella:{n:'estrella',pl:'estrellas',f:1,d:'<path d="M50 6l12.6 26.5 29 3.6-21.3 20 5.5 28.7L50 70.7 24.2 84.8l5.5-28.7-21.3-20 29-3.6z"/>'},
    corazon:{n:'corazón',pl:'corazones',d:'<path d="M50 90S8 64 8 34A21 21 0 0 1 50 24a21 21 0 0 1 42 10c0 30-42 56-42 56z"/>'},
    rectangulo:{n:'rectángulo',pl:'rectángulos',d:'<rect x="6" y="24" width="88" height="52" rx="8"/>'}
  };
  const art=f=>FORMAS[f].f?'la':'el';
  const tokenSvg=(f,c)=>`<svg viewBox="-4 -4 108 108"><g fill="${COL[c]}" stroke="${K}" stroke-width="5" stroke-linejoin="round">${FORMAS[f].d}</g><ellipse cx="42" cy="38" rx="10" ry="6" fill="#fff" opacity=".45" transform="rotate(-25 42 38)"/></svg>`;
  const siluetaSvg=f=>`<svg viewBox="-4 -4 108 108"><g fill="rgba(24,49,83,.07)" stroke="#7D93A8" stroke-width="4" stroke-dasharray="9 7" stroke-linejoin="round">${FORMAS[f].d}</g></svg>`;
  const SERES={
    pez:{sg:'pez',pl:'peces',f:0,svg:`<svg viewBox="-36 -24 68 48">${pez(0,0,1)}</svg>`},
    concha:{sg:'concha',pl:'conchas',f:1,svg:`<svg viewBox="0 0 100 100"><path d="M50 86L14 46q-4-30 36-36q40 6 36 36z" fill="#FFB3C7" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M50 84L30 22M50 84V12M50 84L70 22M50 84L19 36M50 84L81 36" stroke="#E07A98" stroke-width="3.5"/><path d="M38 86h24l-4 8H42z" fill="#FFB3C7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="34" cy="30" rx="8" ry="4" fill="#fff" opacity=".5" transform="rotate(-30 34 30)"/></svg>`},
    estrella:{sg:'estrella de mar',pl:'estrellas de mar',f:1,svg:`<svg viewBox="0 0 100 100"><path d="M50 6c5 0 7 20 12 26s25 2 27 7-16 14-17 22 9 26 5 29-19-9-27-9-23 12-27 9 6-21 5-29S9 44 11 39s22-1 27-7S45 6 50 6z" fill="#FF8A3D" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><g fill="#FFD7B0"><circle cx="50" cy="22" r="3"/><circle cx="76" cy="40" r="3"/><circle cx="24" cy="40" r="3"/><circle cx="66" cy="78" r="3"/><circle cx="34" cy="78" r="3"/></g><circle cx="43" cy="46" r="4.5" fill="${K}"/><circle cx="57" cy="46" r="4.5" fill="${K}"/><path d="M44 56q6 5 12 0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`},
    pulpito:{sg:'pulpito',pl:'pulpitos',f:0,svg:`<svg viewBox="0 0 100 100"><g stroke="#E8641F" stroke-width="9" stroke-linecap="round" fill="none"><path d="M30 62q-8 18-2 30"/><path d="M43 68q-2 16-6 26"/><path d="M57 68q2 16 6 26"/><path d="M70 62q8 18 2 30"/></g><ellipse cx="50" cy="44" rx="34" ry="32" fill="url(#gLolo)" stroke="${K}" stroke-width="4"/><circle cx="40" cy="44" r="7" fill="#fff"/><circle cx="60" cy="44" r="7" fill="#fff"/><circle cx="41" cy="45" r="3.5" fill="${K}"/><circle cx="61" cy="45" r="3.5" fill="${K}"/><path d="M43 57q7 6 14 0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`},
    pelota:{sg:'pelota',pl:'pelotas',f:1,svg:pelota(52)}
  };
  const NUMW=['','uno','dos','tres','cuatro','cinco'];
  const cnt=(n,s)=>n===1?(s.f?'una ':'un ')+s.sg:NUMW[n]+' '+s.pl;
  const MANO=`<svg class="ic" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#fff"/><path d="M22 44V24a3 3 0 0 1 6 0v12M28 34V18a3 3 0 0 1 6 0v16M34 34V20a3 3 0 0 1 6 0v16M40 36v-8a3 3 0 0 1 6 0v10c0 8-6 14-14 14h-2c-5 0-8-2-11-6l-6-8a3 3 0 0 1 5-4l4 4" fill="#FFD7B0" stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const DORSO=`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#fff" opacity=".22"/><circle cx="22" cy="20" r="5" fill="#fff" opacity=".35"/><circle cx="80" cy="82" r="7" fill="#fff" opacity=".3"/><text x="50" y="66" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="46" fill="#fff">?</text></svg>`;
  const marca=(els,ms=2800)=>{ els.forEach(e=>e&&e.classList.add('pista')); setTimeout(()=>els.forEach(e=>e&&e.classList.remove('pista')),ms); };

  /* arrastrar o tocar */
  let seleccion=null;
  function sacude(el){ if(!el) return; el.classList.remove('sacude'); void el.offsetWidth; el.classList.add('sacude'); }
  function selecciona(el){ const era=seleccion===el; if(seleccion) seleccion.classList.remove('elegida'); seleccion=era?null:el; if(!era) el.classList.add('elegida'); }
  function arrastrable(el,soltar){
    el._drop=soltar;
    el.addEventListener('pointerdown',e=>{
      if(el.disabled||e.button>0) return;
      const sx=e.clientX, sy=e.clientY; let mov=false;
      try{ el.setPointerCapture(e.pointerId); }catch(err){}
      const move=ev=>{ const dx=ev.clientX-sx, dy=ev.clientY-sy;
        if(!mov&&Math.hypot(dx,dy)>10){ mov=true; el.classList.add('arrastrando'); if(seleccion){ seleccion.classList.remove('elegida'); seleccion=null; } }
        if(mov) el.style.transform=`translate(${dx}px,${dy}px) scale(1.1)`; };
      const up=ev=>{ el.removeEventListener('pointermove',move); el.removeEventListener('pointerup',up); el.removeEventListener('pointercancel',up);
        if(!mov) return;
        el._movido=true; setTimeout(()=>el._movido=false,80);
        el.style.visibility='hidden'; const t=document.elementFromPoint(ev.clientX,ev.clientY); el.style.visibility='';
        el.classList.remove('arrastrando'); el.style.transform='';
        const d=t&&t.closest('[data-destino]'); if(d) soltar(el,d); else sacude(el); };
      el.addEventListener('pointermove',move); el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up);
    });
    el.addEventListener('click',()=>{ if(el._movido||el.disabled) return; selecciona(el); });
  }
  document.addEventListener('click',e=>{
    const d=e.target.closest('[data-destino]'); if(!d||e.target.closest('.pieza:not([disabled])')) return;
    if(seleccion&&seleccion.isConnected){ const s=seleccion; s.classList.remove('elegida'); seleccion=null; s._drop(s,d); }
    else if(d.dataset.di) hablar(d.dataset.di);
  });
  document.addEventListener('keydown',e=>{ const d=e.target.closest&&e.target.closest('[data-destino]'); if(d&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); d.click(); } });

  const EST={};
  const IDS=['cuenta','series','cestas','tamanos','parejas','formas','cuento','robot','construye','jardin','quepasa','duo','escape','emociones','muevete','caza'];
  const zonaDe=id=>$('#panel-'+id+' .jz');
  const espera=ms=>new Promise(r=>setTimeout(r,ms));
  function botonSig(id){
    const s=EST[id], z=zonaDe(id), J=JUEGOS[id], ult=s.ronda>=(J.R||5)-1;
    setTimeout(()=>{ if(!z.isConnected) return; const f=document.createElement('div'); f.className='fila'; z.appendChild(f);
      boton(ult?'Terminar':'Seguimos',()=>{ if(ult) finJuego(id); else { s.ronda++; rondaJuego(id); } },true,f,ult?'fin':J.ic); },700);
  }
  function api(id){
    const s=EST[id], z=zonaDe(id);
    return { z,
      bien(){ tono([660,880],'sine',.1,.08,.3); },
      fallo(msg,ayuda){ s.fallos++; intento(); cara('sorpresa'); if(msg) decir(msg); setTimeout(()=>{ if(modo===id) cara('feliz'); },1500); if(s.fallos>=2&&ayuda) ayuda(); },
      ok(msg,el){
        if(s.resuelta) return; s.resuelta=true; s.hechas=s.ronda+1;
        acierto(); celebrar(el||z); anima('contento'); cara('feliz'); if(msg) decir(msg); pintaRondas(); jardinSuma(1);
        botonSig(id);
      },
      sigue(msg){ if(s.resuelta) return; s.resuelta=true; s.hechas=s.ronda+1; if(msg) decir(msg); pintaRondas(); botonSig(id); }
    };
  }
  function pintaRondas(){
    const s=EST[modo], J=JUEGOS[modo]; if(!s||!J) return;
    if(J.libre){ agendaEl.innerHTML=`<div class="ag ahora"><span class="tag">Ahora</span><span class="pic">${icono(J.ic)}</span><span>${J.titulo}</span></div>`; return; }
    const R=J.R||5;
    const items=[...Array(R)].map((_,i)=>({k:J.ic,lbl:J.etiq?J.etiq[i]:'Reto '+(i+1)})).concat([{k:'fin',lbl:'Fin'}]);
    const cur=s.fin?-1:(s.v===undefined&&J.elegir?-1:s.ronda), hechos=s.fin?R+1:s.hechas;
    agendaEl.innerHTML=items.map((it,i)=>`${i?flechaAg:''}<div class="ag ${i<hechos?'hecho':''} ${i===cur?'ahora':''}">${i===cur?'<span class="tag">Ahora</span>':''}${cur>=0&&i===cur+1&&!s.fin?'<span class="tag despues">Después</span>':''}<span class="pic">${icono(it.k)}</span><span>${it.lbl}</span></div>`).join('');
  }
  function rondaJuego(id){
    const s=EST[id], z=zonaDe(id); s.fallos=0; s.resuelta=false; seleccion=null;
    z.innerHTML=''; z.classList.remove('entra'); void z.offsetWidth; if(!quieto()) z.classList.add('entra');
    cara('feliz'); pintaRondas(); JUEGOS[id].ronda(s.ronda,api(id));
  }
  function empezarJuego(id){
    const J=JUEGOS[id]; EST[id]={ronda:0,hechas:0,fin:false};
    if(J.libre){ EST[id].libre=true; pintaRondas(); J.abrir(zonaDe(id)); return; }
    if(J.elegir){
      const z=zonaDe(id);
      z.innerHTML=`<div class="opts">${J.elegir.ops.map(o=>`<button class="opt" type="button" data-k="${o.k}"><span class="dib">${o.html}</span><span class="lbl">${o.lbl}</span></button>`).join('')}</div>`;
      pintaRondas(); cara('feliz'); decir(J.elegir.texto);
      z.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{ EST[id].v=b.dataset.k; rondaJuego(id); }));
      return;
    }
    rondaJuego(id);
  }
  function finJuego(id){
    const s=EST[id], J=JUEGOS[id], z=zonaDe(id); s.fin=true; pintaRondas(); paraMusica();
    cara('feliz'); anima('contento'); celebrar(z);
    z.innerHTML=`${J.resumen?J.resumen(s):''}<div class="manos">${MANO}<div><b>Ahora, sin pantalla</b><p>${J.puente}</p></div></div><div class="fila"><span class="fin"><span class="c">${icono('fin').replace('stroke="currentColor"','stroke="#fff"')}</span>Se acabó el juego</span></div>`;
    decir('¡Muy bien! Hemos terminado. Lo habéis hecho genial todos juntos.');
    const f=document.createElement('div'); f.className='fila'; z.appendChild(f); boton('Jugar otra vez',()=>empezarJuego(id),false,f);
  }

  /* jardín de la clase: logros compartidos (se guarda en este navegador) */
  let jardinMem=0; try{ jardinMem=parseInt(localStorage.getItem('lolo-jardin')||'0',10)||0; }catch(e){}
  function jardinPon(v){ jardinMem=v; try{ localStorage.setItem('lolo-jardin',String(v)); }catch(e){} const n=$('#jardinN'); if(n) n.textContent=v; }
  function jardinSuma(k){ jardinPon(jardinMem+k); const c=$('#chipJardin'); if(c&&!quieto()){ c.classList.remove('crece'); void c.offsetWidth; c.classList.add('crece'); } }

  /* música para las estatuas */
  let musT=null;
  function suenaMusica(){ paraMusica(); const nt=[523,587,659,523,659,698,784,659]; let i=0; musT=setInterval(()=>tono([nt[i++%nt.length]],'triangle',.08,.1,.25),320); }
  function paraMusica(){ if(musT){ clearInterval(musT); musT=null; } }

  const JUEGOS={
    cuenta:{titulo:'Cuenta y toca',ic:'j_cuenta',
      puente:'Coged entre una y cinco piezas de construcción y contadlas juntos, señalando cada una con el dedo.',
      ronda(n,a){
        const rg=[[1,3],[1,3],[2,4],[3,5],[3,5]][n], N=rg[0]+Math.floor(Math.random()*(rg[1]-rg[0]+1));
        const s=SERES[azar(['pez','concha','estrella','pulpito'])];
        const ops=[N,...mezcla([1,2,3,4,5].filter(x=>x!==N)).slice(0,2)].sort((x,y)=>x-y);
        a.z.innerHTML=`<div class="zona-cuenta">${Array.from({length:N},()=>`<button class="obj" type="button" aria-label="${s.sg}">${s.svg}</button>`).join('')}</div>
          <div class="nums">${ops.map(k=>`<button class="num" type="button" data-k="${k}" aria-label="${k}">${k}<span class="pts">${'<i></i>'.repeat(k)}</span></button>`).join('')}</div>`;
        let c=0;
        a.z.querySelectorAll('.obj').forEach(o=>o.addEventListener('click',()=>{ if(o.classList.contains('contado')) return; c++; o.classList.add('contado'); o.insertAdjacentHTML('beforeend',`<span class="badge">${c}</span>`); hablar(NUMW[c]||String(c)); tono([500+c*70],'sine',.08,.1,.25); }));
        a.z.querySelectorAll('.num').forEach(b=>b.addEventListener('click',()=>{
          if(EST.cuenta.resuelta) return; const k=+b.dataset.k;
          if(k===N){ b.classList.add('bien'); a.ok(`¡${may(cnt(N,s))}! Muy bien contado.`,b); }
          else { sacude(b); a.fallo(`Ahí pone ${NUMW[k]}. Contamos otra vez: tocad cada ${s.sg} con el dedo.`,()=>{
            marca([a.z.querySelector(`.num[data-k="${N}"]`)],4000); c=0;
            a.z.querySelectorAll('.obj').forEach(o=>{ o.classList.remove('contado'); const bd=o.querySelector('.badge'); if(bd) bd.remove(); }); }); }
        }));
        decir(`¿${s.f?'Cuántas':'Cuántos'} ${s.pl} hay? Tocad${s.f?'las':'los'} para contar${s.f?'las':'los'}.`);
      }},

    series:{titulo:'Series y patrones',ic:'j_series',
      puente:'Haced una fila en la alfombra alternando piezas de dos colores. Después, probad con los niños: de pie, sentado, de pie…',
      ronda(n,a){
        const [c1,c2,c3]=mezcla(Object.keys(COL)), [f1,f2]=mezcla(['circulo','cuadrado','triangulo','estrella','corazon']);
        let pat, crit, extra=null;
        if(n===0){ pat=[{f:f1,c:c1},{f:f1,c:c2}]; crit='color'; }
        else if(n===1){ pat=[{f:f1,c:c1},{f:f2,c:c1}]; crit='forma'; }
        else if(n===2){ pat=[{f:f1,c:c1,s:1},{f:f1,c:c1,s:.55}]; crit='tamano'; }
        else if(n===3){ pat=[{f:f1,c:c1},{f:f1,c:c2},{f:f1,c:c3}]; crit='color'; }
        else { const A={f:f1,c:c1},B={f:f2,c:c2}; pat=[A,A,B]; crit='forma'; extra={f:f2,c:c1}; }
        const L=6, seq=Array.from({length:L},(_,i)=>pat[i%pat.length]), visto=seq.slice(0,L-1), sol=seq[L-1];
        const nom=t=>crit==='color'?colAdj(t.c,FORMAS[t.f].f):crit==='forma'?FORMAS[t.f].n:(t.s===1?'grande':(FORMAS[t.f].f?'pequeña':'pequeño'));
        const unicos=[...new Map(pat.map(t=>[JSON.stringify(t),t])).values()]; if(extra) unicos.push(extra);
        const ops=mezcla(unicos);
        a.z.innerHTML=`<div class="serie">${visto.map(t=>`<span class="tok" style="--s:${t.s||1}">${tokenSvg(t.f,t.c)}</span>`).join('')}<span class="tok hueco" id="huecoS">?</span></div>
          <div class="opciones">${ops.map((t,i)=>`<button class="opcion" type="button" data-i="${i}" style="--s:${t.s||1}" aria-label="${nom(t)}">${tokenSvg(t.f,t.c)}</button>`).join('')}</div>`;
        const frase=visto.map(nom).join(', ');
        const igual=t=>JSON.stringify(t)===JSON.stringify(sol);
        a.z.querySelectorAll('.opcion').forEach(b=>b.addEventListener('click',()=>{
          if(EST.series.resuelta) return; const t=ops[+b.dataset.i];
          if(igual(t)){ const h=$('#huecoS'); h.classList.add('lleno'); h.style.setProperty('--s',t.s||1); h.innerHTML=tokenSvg(t.f,t.c); b.classList.add('bien'); a.ok(`¡Sí! ${frase}, ¡${nom(sol)}!`,h); }
          else { sacude(b); a.fallo(`Escuchad otra vez: ${frase}… ¿Qué va ahora?`,()=>marca([a.z.querySelectorAll('.opcion')[ops.findIndex(igual)]],4000)); }
        }));
        decir(`Mirad la fila: ${frase}… ¿Y ahora qué va?`);
      }},

    cestas:{titulo:'Clasifica en cestas',ic:'j_cestas',
      puente:'Poned dos o tres aros o cajas en la alfombra y clasificad juguetes reales de la clase por colores o por formas.',
      ronda(n,a){
        const cfg=[{k:'color',v:2},{k:'forma',v:2},{k:'tamano',v:2},{k:'color',v:3},{k:'forma',v:3}][n];
        const cs=mezcla(Object.keys(COL)), fs=mezcla(['circulo','cuadrado','triangulo','estrella','corazon']);
        let vals, items=[];
        if(cfg.k==='color'){ vals=cs.slice(0,cfg.v); vals.forEach((v,j)=>{ for(let i=0;i<2;i++) items.push({v,f:fs[(i*2+j)%fs.length],c:v,s:1}); }); }
        else if(cfg.k==='forma'){ vals=fs.slice(0,cfg.v); vals.forEach((v,j)=>{ for(let i=0;i<2;i++) items.push({v,f:v,c:cs[(i*2+j)%4],s:1}); }); }
        else { vals=['grande','pequeno']; const f=fs[0]; vals.forEach((v,j)=>{ for(let i=0;i<2;i++) items.push({v,f,c:cs[(i*2+j)%4],s:v==='grande'?1:.5}); }); }
        items=mezcla(items);
        const lblTxt=v=>cfg.k==='color'?colAdj(v,1):cfg.k==='forma'?'de los '+FORMAS[v].pl:(v==='grande'?'de los grandes':'de los pequeños');
        const lbl=v=>cfg.k==='color'?`<span class="sw" style="background:${COL[v]}"></span>${may(v)}`:cfg.k==='forma'?`<span class="sw" style="border:0">${siluetaSvg(v).replace('stroke-dasharray="9 7"','')}</span>${may(FORMAS[v].pl)}`:(v==='grande'?'<span class="sw g"></span>Grandes':'<span class="sw p"></span>Pequeños');
        const nomIt=it=>`${art(it.f)} ${FORMAS[it.f].n} ${colAdj(it.c,FORMAS[it.f].f)}`;
        a.z.innerHTML=`<div class="piezas">${items.map((it,i)=>`<button class="pieza" type="button" data-i="${i}" style="--s:${it.s}" aria-label="${nomIt(it)}">${tokenSvg(it.f,it.c)}</button>`).join('')}</div>
          <div class="cestas" style="--n:${vals.length}">${vals.map(v=>`<div class="dest cesta" data-destino data-v="${v}" role="button" tabindex="0" data-di="La cesta ${lblTxt(v)}" aria-label="Cesta ${lblTxt(v)}"><span class="etq">${lbl(v)}</span><div class="dentro"></div></div>`).join('')}</div>`;
        let quedan=items.length;
        const pregunta=it=>cfg.k==='color'?`¿De qué color es ${nomIt(it).split(' ').slice(0,2).join(' ')}?`:cfg.k==='forma'?'¿Qué forma tiene?':'¿Es grande o pequeño?';
        a.z.querySelectorAll('.pieza').forEach(p=>arrastrable(p,(el,d)=>{
          const it=items[+el.dataset.i];
          if(d.dataset.v===it.v){ el.disabled=true; d.querySelector('.dentro').appendChild(el); a.bien(); if(--quedan===0) a.ok('¡Todo ordenado! Cada cosa está en su cesta.',d.parentElement); }
          else { sacude(el); sacude(d); a.fallo(`Esa es la cesta ${lblTxt(d.dataset.v)}. ${pregunta(it)}`,()=>marca([a.z.querySelector(`.cesta[data-v="${it.v}"]`)])); }
        }));
        decir(cfg.k==='color'?'Lolo quiere ordenar sus juguetes. Poned cada uno en la cesta de su color. Podéis arrastrarlo, o tocarlo y luego tocar la cesta.'
          :cfg.k==='forma'?'Ahora ordenamos por formas. Cada juguete va a la cesta de su forma.':'Ahora, los grandes van a una cesta y los pequeños a otra.');
      }},

    tamanos:{titulo:'Grande, mediano, pequeño',ic:'j_tamanos',
      puente:'Buscad en la clase tres cosas parecidas de distinto tamaño (pelotas, vasos, peluches) y ordenadlas de pequeña a grande.',
      ronda(n,a){
        const s=SERES[['pelota','pez','estrella','concha','pulpito'][n]];
        const S=[.42,.7,1], L=s.f?['pequeña','mediana','grande']:['pequeño','mediano','grande'], ar=s.f?'la':'el';
        const orden=mezcla([0,1,2]);
        a.z.innerHTML=`<div class="piezas grandes">${orden.map(i=>`<button class="pieza" type="button" data-t="${i}" style="--s:${S[i]}" aria-label="${s.sg} ${L[i]}">${s.svg}</button>`).join('')}</div>
          <div class="escalera">${[0,1,2].map(i=>`<div class="dest peldano" data-destino data-t="${i}" role="button" tabindex="0" data-di="Aquí va ${ar} ${s.sg} ${L[i]}" aria-label="Sitio para ${L[i]}"><span class="sil" style="--s:${S[i]}">${n<3?s.svg:''}</span><span class="etq">${may(L[i])}</span></div>`).join('')}</div>`;
        let q=3;
        a.z.querySelectorAll('.pieza').forEach(p=>arrastrable(p,(el,d)=>{
          if(d.classList.contains('lleno')){ sacude(el); return; }
          const t=+el.dataset.t, dt=+d.dataset.t;
          if(t===dt){ el.disabled=true; d.querySelector('.sil').replaceWith(el); d.classList.add('lleno'); a.bien(); hablar(L[t]); if(--q===0) a.ok(`¡Muy bien! ${may(L[0])}, ${L[1]} y ${L[2]}.`,d.parentElement); }
          else { sacude(el); a.fallo(`Est${s.f?'a':'e'} ${s.sg} es ${L[t]}. Este sitio es para ${ar} ${L[dt]}.`,()=>marca([a.z.querySelector(`.peldano[data-t="${t}"]`)])); }
        }));
        decir(`Ordenamos ${s.f?'las':'los'} ${s.pl}: ${L[0]}, ${L[1]} y ${L[2]}. Llevad cada un${s.f?'a':'o'} a su sitio.`);
      }},

    parejas:{titulo:'Encuentra la pareja',ic:'j_parejas',
      puente:'Jugad al memory con cartas de papel en la alfombra, o buscad parejas de calcetines y zapatos.',
      ronda(n,a){
        const cfg=[['colores',2],['animales',3],['numeros',3],['animales',3],['mezcla',4]][n];
        const C=Object.keys(COL).map(c=>({id:'c'+c,nm:c,svg:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="${COL[c]}" stroke="${K}" stroke-width="5"/><ellipse cx="38" cy="36" rx="12" ry="7" fill="#fff" opacity=".45" transform="rotate(-25 38 36)"/></svg>`}));
        const An=Object.keys(ANIMALES).map(k=>({id:'a'+k,nm:k,svg:ANIMALES[k]}));
        const Nu=[1,2,3,4,5].map(k=>({id:'n'+k,nm:NUMW[k],svg:`<svg viewBox="0 0 100 100"><text x="50" y="62" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="58" fill="${K}">${k}</text><g fill="#FF8A3D">${Array.from({length:k},(_,i)=>`<circle cx="${50+(i-(k-1)/2)*13}" cy="84" r="5"/>`).join('')}</g></svg>`}));
        const caras=cfg[0]==='colores'?mezcla(C).slice(0,2):cfg[0]==='animales'?mezcla(An).slice(0,3):cfg[0]==='numeros'?mezcla(Nu).slice(0,3):[...mezcla(An).slice(0,2),mezcla(C)[0],mezcla(Nu)[0]];
        const mazo=mezcla([...caras,...caras]);
        a.z.innerHTML=`<div class="memoria" style="--c:${cfg[1]}">${mazo.map((c,i)=>`<button class="carta vuelta" type="button" data-i="${i}" aria-label="${c.nm}"><span class="in"><span class="cara dorso">${DORSO}</span><span class="cara frente">${c.svg}</span></span></button>`).join('')}</div>`;
        let jugable=false, abierta=null, bloqueo=false, hechas=0;
        const tk=EST.parejas.tk=Math.random();
        decir('Mirad bien dónde está cada dibujo… ¡Ahora se dan la vuelta! Buscad las parejas.');
        setTimeout(()=>{ if(EST.parejas.tk!==tk) return; a.z.querySelectorAll('.carta').forEach(c=>{ c.classList.remove('vuelta'); c.setAttribute('aria-label','Carta'); }); jugable=true; },3500);
        a.z.querySelectorAll('.carta').forEach(c=>c.addEventListener('click',()=>{
          if(!jugable||bloqueo||c.classList.contains('vuelta')) return;
          const d=mazo[+c.dataset.i]; c.classList.add('vuelta'); c.setAttribute('aria-label',d.nm); hablar(d.nm);
          if(!abierta){ abierta=c; return; }
          const o=abierta; abierta=null; bloqueo=true;
          if(mazo[+o.dataset.i].id===d.id){
            setTimeout(()=>{ o.classList.add('hecha'); c.classList.add('hecha'); a.bien(); hechas++; bloqueo=false;
              if(hechas===caras.length) a.ok('¡Habéis encontrado todas las parejas!',a.z.querySelector('.memoria')); else decir(`¡${may(d.nm)} y ${d.nm}! Son iguales.`); },600);
          } else {
            setTimeout(()=>a.fallo('No son iguales. Se dan la vuelta y probamos otra vez.'),600);
            setTimeout(()=>{ [o,c].forEach(x=>{ x.classList.remove('vuelta'); x.setAttribute('aria-label','Carta'); }); bloqueo=false; },1700);
          }
        }));
      }},

    formas:{titulo:'Formas geométricas',ic:'j_formas',
      puente:'Usad un encajable de formas, o recortad formas de cartón y buscad su silueta dibujada en un papel.',
      ronda(n,a){
        const set=[['circulo','cuadrado'],['circulo','triangulo','cuadrado'],['estrella','corazon','triangulo'],['circulo','cuadrado','triangulo','estrella'],['corazon','rectangulo','estrella','triangulo']][n];
        const cs=mezcla(Object.keys(COL)), sil=mezcla(set), pz=mezcla(set);
        a.z.innerHTML=`<div class="tablero" style="--n:${set.length}">${sil.map(f=>`<div class="dest silueta" data-destino data-v="${f}" role="button" tabindex="0" data-di="Aquí va ${art(f)} ${FORMAS[f].n}" aria-label="Silueta: ${FORMAS[f].n}">${siluetaSvg(f)}</div>`).join('')}</div>
          <div class="piezas">${pz.map((f,i)=>`<button class="pieza" type="button" data-v="${f}" aria-label="${FORMAS[f].n}">${tokenSvg(f,cs[i%4])}</button>`).join('')}</div>`;
        let q=set.length;
        a.z.querySelectorAll('.pieza').forEach(p=>arrastrable(p,(el,d)=>{
          if(d.classList.contains('lleno')){ sacude(el); return; }
          const f=el.dataset.v, df=d.dataset.v;
          if(f===df){ d.innerHTML=el.innerHTML; d.classList.add('lleno'); el.remove(); a.bien(); hablar(`${art(f)} ${FORMAS[f].n}`); if(--q===0) a.ok('¡Todas las formas están en su sitio!',d.parentElement); }
          else { sacude(el); sacude(d); a.fallo(`Esa silueta es ${art(df)} ${FORMAS[df].n}. ¿Dónde va ${art(f)} ${FORMAS[f].n}?`,()=>marca([a.z.querySelector(`.silueta[data-v="${f}"]`)])); }
        }));
        decir(n===0?'Cada forma tiene su sitio. Llevad cada forma a su silueta: arrastradla, o tocadla y luego tocad la silueta.':'¡Más formas! Llevad cada una a su silueta.');
      }}
  };

  /* ================= MÁS JUEGOS ================= */
  Object.assign(P,{
    j_cuento:'<path d="M3 5h6a3 3 0 0 1 3 2 3 3 0 0 1 3-2h6v14h-6a2 2 0 0 0-3 1 2 2 0 0 0-3-1H3z"/><path d="M12 7v13"/>',
    j_robot:'<rect x="5" y="8" width="14" height="11" rx="4"/><circle cx="9.5" cy="13" r="1.3" fill="currentColor"/><circle cx="14.5" cy="13" r="1.3" fill="currentColor"/><path d="M12 8V4.8"/><circle cx="12" cy="3.6" r="1.3"/>',
    j_construye:'<rect x="5" y="15" width="14" height="6" rx="1"/><rect x="7" y="9" width="10" height="6" rx="1"/><rect x="9.5" y="3" width="5" height="6" rx="1"/>',
    j_jardin:'<path d="M12 21v-8"/><path d="M12 15c-4 0-6-3-6-6 4 0 6 3 6 6zM12 13c0-4 3-6 6-6 0 4-3 6-6 6z"/><path d="M4 21h16"/>',
    j_quepasa:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
    j_duo:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 20c0-3 2.5-6 5.5-6 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5.5 3 5.5 6"/>',
    j_escape:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/>',
    j_emociones:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5q3.5 3 7 0"/><path d="M8 9.5h2M14 9.5h2"/>',
    j_muevete:'<circle cx="13" cy="4" r="2"/><path d="M8 9l4-2 3 3 3 1M12 7l-1 6 4 3v5M11 13l-4 3-3-1"/>',
    j_caza:'<path d="M4 20L14 10"/><path d="M15 9l1.4-4 1 3.6 3.6 1-3.6 1-1 3.6-1-3.6z"/><circle cx="7" cy="6" r="1"/><circle cx="19" cy="17" r="1"/>',
    flota:'<path d="M3 15c3 2 6 2 9 0s6-2 9 0"/><path d="M12 12V4M8 8l4-4 4 4"/>',
    hunde:'<path d="M3 8c3 2 6 2 9 0s6-2 9 0"/><path d="M12 11v9M8 16l4 4 4-4"/>',
    flecha_arriba:'<path d="M12 19V5M5 12l7-7 7 7"/>', flecha_abajo:'<path d="M12 5v14M5 12l7 7 7-7"/>',
    flecha_izquierda:'<path d="M19 12H5M12 5l-7 7 7 7"/>', flecha_derecha:'<path d="M5 12h14M12 5l7 7-7 7"/>',
    menu:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
    lolo:'<circle cx="12" cy="10" r="6"/><path d="M8 15l-2 5M11 16l-1 5M13 16l1 5M16 15l2 5"/><circle cx="10" cy="9.5" r=".8" fill="currentColor"/><circle cx="14" cy="9.5" r=".8" fill="currentColor"/>',
    caja:'<rect x="3.5" y="10" width="17" height="11" rx="2"/><path d="M2.5 7h19v3h-19zM12 7v14M12 7c-2-4-6-3.5-5 0M12 7c2-4 6-3.5 5 0"/>'
  });
  CARAS.miedo=carita('cMiedo','<ellipse cx="36" cy="42" rx="9" ry="11" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="36" cy="45" r="3.5" fill="#183153"/><ellipse cx="64" cy="42" rx="9" ry="11" fill="#fff" stroke="#183153" stroke-width="3"/><circle cx="64" cy="45" r="3.5" fill="#183153"/>','<path d="M26 26l14-5M74 26l-14-5" stroke="#183153" stroke-width="4" stroke-linecap="round"/><path d="M32 72q4-6 9 0t9 0 9 0 9 0" stroke="#183153" stroke-width="4" fill="none" stroke-linecap="round"/>');

  const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const encaja=(svg,x,y,w,h)=>svg.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const LOLO_MINI=SERES.pulpito.svg;
  const CANGREJO=`<svg viewBox="0 0 120 110"><g stroke="${K}" stroke-width="3.5" stroke-linecap="round"><path d="M28 80l-14 10M30 88l-10 14M92 80l14 10M90 88l10 14"/></g><path d="M22 52q-14-6-10-22q8 2 10 10q2-10 10-10q4 14-10 22z" fill="#E5484D" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M98 52q14-6 10-22q-8 2-10 10q-2-10-10-10q-4 14 10 22z" fill="#E5484D" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M30 60l-6-6M90 60l6-6" stroke="${K}" stroke-width="4"/><ellipse cx="60" cy="78" rx="34" ry="24" fill="#FF6B6B" stroke="${K}" stroke-width="4"/><path d="M50 56v-10M70 56v-10" stroke="${K}" stroke-width="3.5"/><circle cx="50" cy="44" r="6" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="70" cy="44" r="6" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="51" cy="45" r="2.5" fill="${K}"/><circle cx="71" cy="45" r="2.5" fill="${K}"/><path d="M50 82q10 8 20 0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;
  const CANGREJO_TRISTE=CANGREJO.replace('M50 82q10 8 20 0','M50 88q10-8 20 0');
  const MAPA=`<svg viewBox="0 0 100 80"><path d="M6 10l28-6 32 6 28-6v66l-28 6-32-6-28 6z" fill="#F5E3B0" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M34 4v66M66 10v66" stroke="#D9BC7A" stroke-width="3"/><path d="M16 58q14-20 30-10t30-22" stroke="#E5484D" stroke-width="4" stroke-dasharray="6 6" fill="none" stroke-linecap="round"/><path d="M74 16l9 9M83 16l-9 9" stroke="#E5484D" stroke-width="5" stroke-linecap="round"/></svg>`;
  const COFRE=`<svg viewBox="0 0 120 100"><rect x="10" y="44" width="100" height="50" rx="8" fill="#B8742F" stroke="${K}" stroke-width="5"/><path d="M10 50q0-38 50-38t50 38z" fill="#D18A3E" stroke="${K}" stroke-width="5"/><path d="M30 16v78M90 16v78" stroke="#8A5523" stroke-width="5" opacity=".5"/><rect x="10" y="44" width="100" height="10" fill="#FFC93C" stroke="${K}" stroke-width="4"/><rect x="51" y="46" width="18" height="24" rx="4" fill="#FFC93C" stroke="${K}" stroke-width="4"/></svg>`;
  const COFRE_ABIERTO=`<svg viewBox="0 0 120 110"><path d="M14 54L22 8h76l8 46z" fill="#D18A3E" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><g fill="#FFC93C" stroke="${K}" stroke-width="2.5">${[[34,50],[52,44],[70,48],[88,52],[44,56],[78,58]].map(([x,y])=>`<path d="M${x} ${y+8}l-9-10q0-8 9-9q9 1 9 9z"/>`).join('')}</g><g fill="#FFF3A8">${[[24,30],[96,26],[60,22]].map(([x,y])=>`<path d="M${x} ${y-6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/>`).join('')}</g><rect x="10" y="54" width="100" height="50" rx="8" fill="#B8742F" stroke="${K}" stroke-width="5"/><rect x="10" y="54" width="100" height="10" fill="#FFC93C" stroke="${K}" stroke-width="4"/><rect x="51" y="56" width="18" height="22" rx="4" fill="#FFC93C" stroke="${K}" stroke-width="4"/></svg>`;
  const ROCA=`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="86" rx="38" ry="6" fill="#0B3550" opacity=".15"/><path d="M14 80q-4-30 18-44q10-18 30-14q24 4 26 30q8 22-10 30z" fill="#A8B3C2" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M34 46q8-8 18-6" stroke="#fff" stroke-width="5" opacity=".5" fill="none" stroke-linecap="round"/></svg>`;
  const NUBE=`<svg viewBox="0 0 120 90"><path d="M26 72h66a20 20 0 0 0 0-40 28 28 0 0 0-53 6 17 17 0 0 0-13 34z" fill="#fff" stroke="#9DB3C6" stroke-width="4"/><path d="M40 50q8-10 20-10" stroke="#E1ECF1" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const ROBOT=`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="92" rx="30" ry="5" fill="#0B3550" opacity=".18"/><path d="M50 28V14" stroke="${K}" stroke-width="4"/><circle cx="50" cy="12" r="6" fill="#FF5D8F" stroke="${K}" stroke-width="3"/><rect x="16" y="28" width="68" height="56" rx="20" fill="#FFC93C" stroke="${K}" stroke-width="5"/><rect x="26" y="40" width="48" height="26" rx="10" fill="${K}"/><circle cx="40" cy="53" r="6" fill="#7EE8FF"/><circle cx="60" cy="53" r="6" fill="#7EE8FF"/><path d="M42 74q8 5 16 0" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="26" cy="86" r="7" fill="${K}"/><circle cx="74" cy="86" r="7" fill="${K}"/></svg>`;
  const FLOR=c=>`<svg viewBox="0 0 100 100"><path d="M50 94V52" stroke="#2BB673" stroke-width="7" stroke-linecap="round"/><path d="M50 78q-18-2-22-18q16 0 22 18z" fill="#2BB673"/>${[0,72,144,216,288].map(a=>`<ellipse cx="50" cy="20" rx="11" ry="15" fill="${c}" stroke="${K}" stroke-width="3" transform="rotate(${a} 50 36)"/>`).join('')}<circle cx="50" cy="36" r="11" fill="#FFC93C" stroke="${K}" stroke-width="3"/></svg>`;
  const FONDOS={
    arena:`<rect width="400" height="220" fill="#A8E6F0"/><circle cx="352" cy="42" r="24" fill="#FFE38A"/><path d="M0 160q100-22 200 0t200 0v60H0z" fill="#F5D596"/>`,
    cueva:`<rect width="400" height="220" fill="#2E2650"/><path d="M0 0h400v40q-60 30-120 10t-140 20T0 52z" fill="#1E1838"/><path d="M0 220v-50q50-20 110 0t130-10 160 20v40z" fill="#3E3468"/><g fill="#FFE38A" opacity=".8"><circle cx="60" cy="90" r="3"/><circle cx="330" cy="70" r="2.5"/><circle cx="250" cy="120" r="2"/><circle cx="160" cy="60" r="2"/></g>`,
    algas:`<rect width="400" height="220" fill="#7FD6C2"/>${[24,84,150,256,318,376].map((x,i)=>`<path d="M${x} 220q-14-40 0-80t0-80" stroke="${i%2?'#2E9E6E':'#1E7F57'}" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}<path d="M0 200h400v20H0z" fill="#E7C27F"/>`,
    tesoro:`<rect width="400" height="220" fill="#8FD8E8"/><g fill="#fff" opacity=".5"><circle cx="40" cy="40" r="6"/><circle cx="90" cy="80" r="4"/><circle cx="360" cy="60" r="5"/></g><path d="M0 150q100-24 200 0t200 0v70H0z" fill="#F5D596"/>`
  };
  const escena=(f,cosas)=>`<svg class="escena" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">${FONDOS[f]}${cosas.join('')}</svg>`;
  function votacion(cont,ops,alDecidir){
    const v={}; ops.forEach(o=>v[o.k]=0);
    cont.insertAdjacentHTML('beforeend',`<div class="votos">${ops.map(o=>`<div class="voto" data-k="${o.k}"><button class="opt voto-carta" type="button" aria-label="Votar: ${o.lbl}"><span class="dib">${o.html}</span><span class="lbl">${o.lbl}</span></button><div class="cuenta-votos"><span class="manitas"></span><b>0</b></div></div>`).join('')}</div>`);
    const box=cont.querySelector('.votos:last-of-type');
    box.querySelectorAll('.voto').forEach(el=>el.querySelector('button').addEventListener('click',()=>{ const k=el.dataset.k; v[k]++; el.querySelector('b').textContent=v[k]; el.querySelector('.manitas').insertAdjacentHTML('beforeend','<i></i>'); tono([560+v[k]*25],'sine',.06,.1,.15); }));
    const f=document.createElement('div'); f.className='fila'; cont.appendChild(f);
    boton('Contar los votos',()=>{
      const max=Math.max(...Object.values(v));
      if(max===0){ decir('Todavía no ha votado nadie. Venid a tocar el dibujo que elegís.'); return; }
      const g=ops.filter(o=>v[o.k]===max), w=g.length>1?azar(g):g[0];
      box.querySelectorAll('.voto').forEach(el=>el.classList.toggle('gana',el.dataset.k===w.k));
      box.querySelectorAll('button').forEach(b=>b.disabled=true); f.remove(); acierto(); alDecidir(w,g.length>1,v);
    },true,f,'estrella');
  }

  /* --- ¿Qué pasa si…? --- */
  const CORCHO=`<svg viewBox="0 0 100 100"><rect x="30" y="16" width="40" height="70" rx="10" fill="#D9A066" stroke="${K}" stroke-width="5"/><g fill="#A8692E">${[[42,30],[58,40],[44,56],[58,68],[46,76]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g></svg>`;
  const LLAVE=`<svg viewBox="0 0 100 100"><circle cx="30" cy="50" r="17" fill="none" stroke="${K}" stroke-width="14"/><path d="M47 50h40M76 50v14M88 50v10" stroke="${K}" stroke-width="14" stroke-linecap="round"/><circle cx="30" cy="50" r="17" fill="none" stroke="#FFC93C" stroke-width="8"/><path d="M47 50h40M76 50v14M88 50v10" stroke="#FFC93C" stroke-width="8" stroke-linecap="round"/></svg>`;
  const HOJA=`<svg viewBox="0 0 100 100"><path d="M18 82q0-62 64-66q4 62-64 66z" fill="#7EE08A" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M20 80q26-28 54-58" stroke="#2E9E4F" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  const MONEDA=`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="#FFC93C" stroke="${K}" stroke-width="5"/><circle cx="50" cy="50" r="21" fill="none" stroke="#E0A400" stroke-width="4"/><text x="50" y="60" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="28" fill="#B98200">1</text></svg>`;
  const ESPONJA=`<svg viewBox="0 0 100 100"><rect x="16" y="28" width="68" height="46" rx="9" fill="#FFE36E" stroke="${K}" stroke-width="5"/><g fill="#F2C12E">${[[30,40],[50,46],[68,38],[38,60],[62,62]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}</g></svg>`;
  const COSAS=[{n:'la piedra',svg:ROCA},{n:'el corcho',svg:CORCHO},{n:'la llave',svg:LLAVE},{n:'la hoja',svg:HOJA},{n:'la moneda',svg:MONEDA},{n:'la esponja',svg:ESPONJA}];
  const PINT={rojo:'#E5484D',amarillo:'#FFC93C',azul:'#3D7DF2',blanco:'#FFFFFF',naranja:'#FF9A3D',verde:'#3BB36A',morado:'#8E5BE8',rosa:'#FF9EC0',celeste:'#8FD0FF'};
  const MEZ=[['rojo','amarillo','naranja'],['azul','amarillo','verde'],['rojo','azul','morado'],['rojo','blanco','rosa'],['azul','blanco','celeste']];
  const GOTA=c=>`<svg viewBox="0 0 100 100"><path d="M50 8c22 0 40 16 40 40s-16 44-40 44-40-20-40-44 18-40 40-40z" fill="${PINT[c]}" stroke="${K}" stroke-width="5"/><ellipse cx="36" cy="32" rx="10" ry="6" fill="#fff" opacity=".5" transform="rotate(-25 36 32)"/></svg>`;
  const GOTA_Q=`<svg viewBox="0 0 100 100"><path d="M50 8c22 0 40 16 40 40s-16 44-40 44-40-20-40-44 18-40 40-40z" fill="#fff" stroke="#9DB3C6" stroke-width="5" stroke-dasharray="10 8"/><text x="50" y="66" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="44" fill="#9DB3C6">?</text></svg>`;
  const celdaR=(v,flo)=>flo?`<span class="mini-ic">${icono(v)}</span>${v==='flota'?'Flota':'Se hunde'}`:`<span class="sw2" style="background:${PINT[v]}"></span>${may(v)}`;
  function registroHTML(s){
    if(!s.reg||!s.reg.length) return ''; const flo=s.reg[0].tipo==='flota';
    return `<div class="registro"><b>Nuestro registro</b><div class="reg-scroll"><table><thead><tr><th>${flo?'Objeto':'Mezcla'}</th><th>Pensamos</th><th>Pasó</th><th></th></tr></thead><tbody>${s.reg.map(r=>`<tr><td>${flo?`<span class="mini">${r.svg}</span>`:`<span class="sw2" style="background:${PINT[r.c1]}"></span> + <span class="sw2" style="background:${PINT[r.c2]}"></span>`}</td><td>${celdaR(r.pred,flo)}</td><td>${celdaR(r.res,flo)}</td><td><b>${r.pred===r.res?'¡Acertamos!':'¡Sorpresa!'}</b></td></tr>`).join('')}</tbody></table></div></div>`;
  }

  /* --- Escape --- */
  const CANDADO=(c,ab)=>`<svg viewBox="0 0 60 74"><path d="M18 34V20a12 12 0 0 1 24 0v${ab?'-2':'14'}" fill="none" stroke="#9AA6B5" stroke-width="7" stroke-linecap="round" ${ab?'transform="translate(8 -10) rotate(14 30 20)"':''}/><rect x="8" y="32" width="44" height="36" rx="8" fill="${c}" stroke="${K}" stroke-width="4"/><circle cx="30" cy="46" r="5" fill="${ab?'#fff':K}"/><path d="M30 48v9" stroke="${ab?'#fff':K}" stroke-width="4" stroke-linecap="round"/></svg>`;
  const JAULA=ab=>`<svg viewBox="0 0 160 170"><rect x="8" y="150" width="144" height="14" rx="6" fill="#8A5A34" stroke="${K}" stroke-width="4"/>${encaja(ab?CANGREJO:CANGREJO_TRISTE,25,52,110,100)}<path d="M14 150V44q66-44 132 0v106" fill="none" stroke="#7D8A9C" stroke-width="6"/>${ab?`<g fill="#FFC93C">${[[30,40],[130,36],[80,14],[20,100],[142,96]].map(([x,y])=>`<path d="M${x} ${y-8}l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z"/>`).join('')}</g>`:`<g stroke="#7D8A9C" stroke-width="5">${[36,58,80,102,124].map(x=>`<path d="M${x} 32V150"/>`).join('')}</g>`}</svg>`;
  const LLAVE_F=f=>`<svg viewBox="0 0 170 100"><rect x="74" y="43" width="78" height="14" rx="7" fill="#FFC93C" stroke="${K}" stroke-width="4"/><path d="M128 57v16M146 57v12" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M128 57v16M146 57v12" stroke="#FFC93C" stroke-width="6" stroke-linecap="round"/>${encaja(tokenSvg(f,'amarillo'),2,10,80,80)}</svg>`;
  const NOMI={castanuelas:'las castañuelas',pandereta:'la pandereta',tambor:'el tambor',guitarra:'la guitarra'};

  /* --- Emociones --- */
  const HELADO_CAIDO=`<svg viewBox="0 0 120 100"><ellipse cx="56" cy="86" rx="46" ry="9" fill="#FF9EC0" opacity=".55"/><circle cx="50" cy="72" r="20" fill="#FF9EC0" stroke="${K}" stroke-width="4"/><path d="M66 60l40-22-6 32z" fill="#E8A75A" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></svg>`;
  const TARTA=`<svg viewBox="0 0 120 110"><rect x="18" y="52" width="84" height="44" rx="8" fill="#FFD3E0" stroke="${K}" stroke-width="4"/><path d="M18 64q10 10 21 0t21 0 21 0 21 0" fill="none" stroke="#FF5D8F" stroke-width="5"/><rect x="28" y="30" width="64" height="24" rx="6" fill="#FFF4DD" stroke="${K}" stroke-width="4"/>${[44,60,76].map(x=>`<rect x="${x-3}" y="12" width="6" height="18" rx="2" fill="#3DBBC9" stroke="${K}" stroke-width="2"/><path d="M${x} 2q5 5 0 9q-5-4 0-9z" fill="#FFC93C"/>`).join('')}<rect x="8" y="94" width="104" height="9" rx="4" fill="#fff" stroke="${K}" stroke-width="3"/></svg>`;
  const TORMENTA=`<svg viewBox="0 0 120 110"><path d="M26 60h64a18 18 0 0 0 0-36 26 26 0 0 0-49 6 15 15 0 0 0-15 30z" fill="#8F9BB0" stroke="${K}" stroke-width="4"/><path d="M62 62l-14 22h12l-8 22 24-30H62l8-14z" fill="#FFC93C" stroke="${K}" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const REGALO=`<svg viewBox="0 0 120 120"><rect x="24" y="68" width="72" height="44" rx="6" fill="#3DBBC9" stroke="${K}" stroke-width="4"/><path d="M60 68v44" stroke="#FFC93C" stroke-width="8"/><path d="M60 68l-12-6 24-6-24-6 24-6-12-6" fill="none" stroke="#7D8A9C" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="26" r="14" fill="#FFE066" stroke="${K}" stroke-width="4"/><circle cx="55" cy="24" r="2.5" fill="${K}"/><circle cx="65" cy="24" r="2.5" fill="${K}"/><path d="M54 30q6 5 12 0" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  const SITU=()=>[
    {nom:'el cangrejo Paco',quien:CANGREJO_TRISTE,cosa:HELADO_CAIDO,txt:'Al cangrejo Paco se le ha caído su helado al suelo.',emo:'triste',emoTxt:'triste',
     ay:[{t:'Le damos un abrazo',html:tarjetaPicto('corazon','#FFD3E0'),ok:1,r:'Un abrazo ayuda mucho cuando estamos tristes.'},{t:'Compartimos nuestro helado',html:OBJ[4].svg,ok:1,r:'Compartir es una forma preciosa de ayudar.'},{t:'Nos reímos de él',html:CARAS.risa,ok:0,r:'Si nos reímos, Paco se pondrá más triste. ¿Qué otra cosa podemos hacer?'}]},
    {nom:'la estrella de mar',quien:SERES.estrella.svg,cosa:TARTA,txt:'¡Es el cumpleaños de la estrella de mar y le han preparado una tarta!',emo:'feliz',emoTxt:'alegre',
     ay:[{t:'Le cantamos «Cumpleaños feliz»',html:tarjetaPicto('nota','#DCCBFF'),ok:1,r:'¡Cantar juntos hace la fiesta todavía más alegre!'},{t:'Le damos un abrazo',html:tarjetaPicto('corazon','#FFD3E0'),ok:1,r:'¡Un abrazo de cumpleaños!'}]},
    {nom:'el pato',quien:ANIMALES.pato,cosa:pelota(40),txt:'Un niño le ha quitado la pelota al pato sin pedírsela.',emo:'enfado',emoTxt:'enfadado',
     ay:[{t:'Respiramos y decimos: «Devuélvemela, por favor»',html:tarjetaPicto('aire','#BFEAF2'),ok:1,r:'Respirar nos calma, y pedir las cosas bien es lo mejor.'},{t:'Le pegamos',html:CARAS.enfado,ok:0,r:'Pegar hace daño. Cuando estamos enfadados, es mejor respirar y hablar.'}]},
    {nom:'el pez',quien:SERES.pez.svg,cosa:TORMENTA,txt:'Hay una tormenta con truenos muy fuertes. ¡Bum, bum!',emo:'miedo',emoTxt:'con miedo',
     ay:[{t:'Nos quedamos con él y le damos la mano',html:tarjetaPicto('hola','#FFE38A'),ok:1,r:'Cuando tenemos miedo, estar acompañados nos da seguridad.'},{t:'Le asustamos más',html:CARAS.sorpresa,ok:0,r:'Asustar a quien tiene miedo no le ayuda. ¿Qué otra cosa podemos hacer?'}]},
    {nom:'el gato',quien:ANIMALES.gato,cosa:REGALO,txt:'El gato abre una caja… ¡y sale un muelle saltarín! ¡Boing!',emo:'sorpresa',emoTxt:'sorprendido',
     ay:[{t:'Le preguntamos qué hay en la caja',html:tarjetaPicto('pregunta','#DCCBFF'),ok:1,r:'Preguntar y compartir la sorpresa es muy divertido.'},{t:'Jugamos juntos con el muelle',html:tarjetaPicto('hola','#FFE38A'),ok:1,r:'¡Una sorpresa compartida es el doble de divertida!'}]}
  ];

  /* --- Caza mágica --- */
  const PL=(id,c1,c2,extra)=>`<svg viewBox="0 0 120 120"><defs><radialGradient id="pl${id}" cx=".35" cy=".3"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><circle cx="60" cy="60" r="44" fill="url(#pl${id})" stroke="${K}" stroke-width="4"/>${extra}</svg>`;
  const PLANETAS={
    sol:{n:'el Sol',dato:'El Sol es una estrella enorme que nos da luz y calor.',svg:`<svg viewBox="0 0 120 120"><g stroke="#FFB21E" stroke-width="7" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>`<path d="M60 4v12" transform="rotate(${a} 60 60)"/>`).join('')}</g><circle cx="60" cy="60" r="38" fill="url(#gSol)" stroke="${K}" stroke-width="4"/><circle cx="48" cy="56" r="4.5" fill="${K}"/><circle cx="72" cy="56" r="4.5" fill="${K}"/><path d="M48 70q12 10 24 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`},
    tierra:{n:'la Tierra',dato:'La Tierra es nuestro planeta. Tiene mucha agua y aquí vivimos todos.',svg:PL('t','#9FE0FF','#2A7FD4','<path d="M34 40q12-8 20 0t6 14-12 8-10 12q-12-4-10-18z" fill="#5CCB78" stroke="#183153" stroke-width="3"/><path d="M70 72q10-6 18 2t-4 16q-12 2-16-6t2-12z" fill="#5CCB78" stroke="#183153" stroke-width="3"/><path d="M68 28q10 0 14 8-8 2-14-2z" fill="#fff" opacity=".8"/>')},
    luna:{n:'la Luna',dato:'La Luna sale por la noche y va cambiando de forma.',svg:PL('l','#FAFAFA','#B8BEC8','<g fill="#C9CFD8" stroke="#9AA3B0" stroke-width="2"><circle cx="44" cy="46" r="9"/><circle cx="74" cy="70" r="12"/><circle cx="70" cy="38" r="5"/><circle cx="46" cy="80" r="6"/></g>')},
    marte:{n:'Marte',dato:'Marte es el planeta rojo. Está lleno de polvo y de rocas.',svg:PL('m','#FFB38A','#C9482A','<g fill="#A63A20" opacity=".55"><circle cx="46" cy="50" r="8"/><circle cx="74" cy="72" r="10"/><circle cx="72" cy="40" r="4"/></g>')},
    saturno:{n:'Saturno',dato:'Saturno tiene unos anillos enormes a su alrededor.',svg:`<svg viewBox="0 0 120 120"><defs><radialGradient id="plsat" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF0C2"/><stop offset="1" stop-color="#D9A456"/></radialGradient></defs><path d="M10 66a50 14 -12 0 1 100-22" fill="none" stroke="#C9A06A" stroke-width="8" stroke-linecap="round"/><circle cx="60" cy="58" r="34" fill="url(#plsat)" stroke="${K}" stroke-width="4"/><path d="M30 50h60M28 64h64" stroke="#D9A456" stroke-width="4" opacity=".6"/><path d="M110 44a50 14 -12 0 1 -100 22" fill="none" stroke="#E8C48A" stroke-width="8" stroke-linecap="round"/></svg>`},
    jupiter:{n:'Júpiter',dato:'Júpiter es el planeta más grande de todos.',svg:PL('j','#F7E1C0','#C98B4E','<path d="M18 46h84M16 60h88M20 76h80" stroke="#B5743A" stroke-width="6" opacity=".55"/><ellipse cx="74" cy="70" rx="10" ry="6" fill="#D9573A"/>')}
  };
  const CAZA_AN={
    gato:{n:'un gato',dato:'Los gatos ven muy bien en la oscuridad.',svg:ANIMALES.gato},
    perro:{n:'un perro',dato:'Los perros tienen un olfato buenísimo.',svg:ANIMALES.perro},
    vaca:{n:'una vaca',dato:'La vaca come hierba y nos da la leche.',svg:ANIMALES.vaca},
    pato:{n:'un pato',dato:'Los patos nadan y también vuelan.',svg:ANIMALES.pato},
    pez:{n:'un pez',dato:'Los peces respiran debajo del agua.',svg:SERES.pez.svg},
    estrella:{n:'una estrella de mar',dato:'La estrella de mar tiene cinco brazos.',svg:SERES.estrella.svg}
  };

  /* --- Construye y jardín --- */
  const SOMBRA={rojo:['#FF9497','#C93A3F'],azul:['#86B6FF','#2A62C4'],amarillo:['#FFE08A','#D9A21E'],verde:['#7EDDA4','#1F8A52']};
  const BLOQUE=c=>`<svg viewBox="0 0 110 74"><path d="M8 20l14-14h80l-14 14z" fill="${SOMBRA[c][0]}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M88 20l14-14v46l-14 14z" fill="${SOMBRA[c][1]}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><rect x="8" y="20" width="80" height="46" rx="3" fill="${COL[c]}" stroke="${K}" stroke-width="4"/><path d="M16 29h22" stroke="#fff" stroke-width="5" opacity=".45" stroke-linecap="round"/></svg>`;
  const FLORC=['#FF5D8F','#9B6BFF','#FF8A3D','#3D8DF2','#E5484D','#FFC93C'];
  const PLANTA=(e,c)=>`<svg viewBox="0 0 100 110"><ellipse cx="50" cy="98" rx="34" ry="9" fill="#8A5A34"/><ellipse cx="50" cy="96" rx="24" ry="5" fill="#6B4226"/>${
    e===0?'<circle cx="50" cy="93" r="4" fill="#C79A5B"/>':
    e===1?'<path d="M50 96V80" stroke="#2BB673" stroke-width="5" stroke-linecap="round"/><path d="M50 84q-12-2-14-12q12 0 14 12zM50 84q12-2 14-12q-12 0-14 12z" fill="#5CCB78"/>':
    e===2?'<path d="M50 96V52" stroke="#2BB673" stroke-width="6" stroke-linecap="round"/><path d="M50 80q-18-2-22-16q16 0 22 16zM50 68q18-2 22-16q-16 0-22 16z" fill="#5CCB78"/><ellipse cx="50" cy="46" rx="8" ry="11" fill="'+c+'" stroke="'+K+'" stroke-width="3"/>':
    '<path d="M50 96V46" stroke="#2BB673" stroke-width="6" stroke-linecap="round"/><path d="M50 82q-18-2-22-16q16 0 22 16zM50 72q18-2 22-16q-16 0-22 16z" fill="#5CCB78"/>'+[0,72,144,216,288].map(a=>'<ellipse cx="50" cy="16" rx="10" ry="14" fill="'+c+'" stroke="'+K+'" stroke-width="3" transform="rotate('+a+' 50 32)"/>').join('')+'<circle cx="50" cy="32" r="10" fill="#FFC93C" stroke="'+K+'" stroke-width="3"/>'
  }</svg>`;
  const LOGROS=[{t:'Hemos recogido la clase',ic:'j_cestas',d:'Habéis recogido la clase'},{t:'Nos hemos ayudado',ic:'corazon',d:'Os habéis ayudado'},{t:'Hemos escuchado',ic:'ojo',d:'Habéis escuchado muy bien'},{t:'Hemos compartido',ic:'hola',d:'Habéis compartido'}];

  Object.assign(JUEGOS,{
    cuento:{titulo:'El cuento que decidimos',ic:'j_cuento',R:5,etiq:['Empieza','Decisión 1','Decisión 2','Decisión 3','Final'],
      puente:'Dramatizad el cuento: unos niños son Lolo, otros el cangrejo Paco y otros los peces. Después, dibujad el final que más os haya gustado.',
      resumen:s=>s.el?`<p class="texto-cuento">Esta vez elegimos ${s.el.camino==='cueva'?'la cueva oscura':'el bosque de algas'}, ${s.el.ayuda==='tirar'?'tirar todos juntos de la red':'llamar a la tortuga'} y ${s.el.final==='abrir'?'abrir el cofre enseguida':'esperar a los amigos'}. ¿Qué pasaría si eligiéramos lo contrario?</p>`:'',
      ronda(n,a){
        const s=EST.cuento; if(n===0) s.el={};
        const T=(html,txt)=>{ if(html) a.z.insertAdjacentHTML('beforeend',html); decir(txt); };
        const amigos=[encaja(SERES.pez.svg,250,40,90,60),encaja(SERES.estrella.svg,300,110,70,70)];
        if(n===0){ T(escena('arena',[encaja(LOLO_MINI,60,64,130,130),encaja(MAPA,214,98,120,96)]),'Un día, Lolo encontró en la arena un mapa del tesoro. ¡El tesoro estaba al otro lado del mar!'); a.sigue(); }
        else if(n===1){
          T('','Para llegar había dos caminos. ¿Vamos por la cueva oscura o por el bosque de algas? ¡Votad!');
          votacion(a.z,[{k:'cueva',lbl:'La cueva oscura',html:escena('cueva',[encaja(LOLO_MINI,150,80,100,100)])},{k:'algas',lbl:'El bosque de algas',html:escena('algas',[encaja(LOLO_MINI,150,80,100,100)])}],
            (w,emp)=>{ s.el.camino=w.k; a.sigue((emp?'¡Empate! La concha mágica decide: ':'¡Habéis elegido ')+w.lbl.toLowerCase()+'!'); });
        } else if(n===2){
          const c=s.el.camino, red=`<g stroke="#C9A36A" stroke-width="3">${[0,1,2,3,4,5].map(i=>`<path d="M${236+i*22} 98l-8 108"/>`).join('')}${[0,1,2,3,4].map(i=>`<path d="M224 ${106+i*22}h134"/>`).join('')}</g>`;
          const luz=c==='cueva'?[encaja(`<svg viewBox="-40 -30 80 60"><circle r="28" fill="#FFF3A8" opacity=".4"/>${pez(0,0,.8)}</svg>`,150,30,90,68)]:[];
          T(escena(c,[encaja(LOLO_MINI,40,90,110,110),...luz,encaja(CANGREJO_TRISTE,230,96,124,112),red]),(c==='cueva'?'En la cueva estaba muy oscuro, pero unos peces linterna les dieron luz. ':'Las algas les hacían cosquillas. ¡Ji, ji, ji! ')+'De repente, oyeron llorar a alguien. ¡Era el cangrejo Paco, atrapado en una red! ¿Cómo le ayudamos?');
          votacion(a.z,[{k:'tirar',lbl:'Tiramos todos juntos de la red',html:tarjetaPicto('hola','#FFE38A')},{k:'tortuga',lbl:'Llamamos a la tortuga para que corte la red',html:OBJ[0].svg}],
            (w,emp)=>{ s.el.ayuda=w.k; a.sigue((emp?'¡Empate! La concha mágica decide: ':'¡Habéis decidido: ')+w.lbl.toLowerCase()+'!'); });
        } else if(n===3){
          const t1=s.el.ayuda==='tirar'?'Lolo y sus amigos tiraron todos juntos: ¡una, dos y tres! Y la red se soltó.':'La tortuga llegó despacito y cortó la red con mucho cuidado.';
          T(escena('tesoro',[encaja(LOLO_MINI,24,86,104,104),encaja(CANGREJO,124,112,90,82),encaja(COFRE,250,96,124,104)]),t1+' Paco, muy contento, se fue con ellos. ¡Y por fin encontraron el cofre del tesoro! ¿Lo abrimos ya o esperamos a que lleguen todos los amigos?');
          votacion(a.z,[{k:'abrir',lbl:'Lo abrimos ya',html:COFRE_ABIERTO},{k:'esperar',lbl:'Esperamos a los amigos',html:escena('tesoro',[encaja(COFRE,40,100,120,100),...amigos])}],
            (w,emp)=>{ s.el.final=w.k; a.sigue((emp?'¡Empate! La concha mágica decide: ':'¡Habéis elegido: ')+w.lbl.toLowerCase()+'!'); });
        } else {
          const fin=s.el.final==='abrir'?'Lolo abrió el cofre… ¡y estaba lleno de conchas brillantes! Pensó en sus amigos y repartió las conchas con todos.':'Llegaron todos los amigos y abrieron el cofre juntos… ¡Estaba lleno de conchas brillantes, y había una para cada uno!';
          T(escena('tesoro',[encaja(LOLO_MINI,24,86,104,104),encaja(COFRE_ABIERTO,130,80,130,120),...amigos]),fin+` Después volvieron a casa por ${s.el.camino==='cueva'?'la cueva de los peces linterna':'el bosque de algas'}. Y colorín colorado, este cuento se ha acabado.`);
          a.ok(null,a.z.querySelector('.escena'));
        }
      }},

    robot:{titulo:'El robot perdido',ic:'j_robot',
      puente:'Ahora, con vuestro robot de suelo: copiad el programa en el robot y comprobad si llega a la flor del tapete.',
      ronda(n,a){
        const L=[{s:[0,1],m:[2,1],r:[]},{s:[1,0],m:[1,3],r:[]},{s:[0,0],m:[2,2],r:[[1,0],[0,2]]},{s:[0,3],m:[4,0],r:[[1,3],[2,1],[3,2]]},{s:[4,3],m:[0,0],r:[[3,3],[2,2],[1,1],[3,0]]}][n];
        const C=5,F=4, esRoca=(x,y)=>L.r.some(([p,q])=>p===x&&q===y), fuera=(x,y)=>x<0||y<0||x>=C||y>=F;
        const NOM={arriba:'arriba',abajo:'abajo',izquierda:'izquierda',derecha:'derecha'}, D={arriba:[0,-1],abajo:[0,1],izquierda:[-1,0],derecha:[1,0]};
        a.z.innerHTML=`<div class="robot-wrap"><div class="mapa" style="--c:${C}">${Array.from({length:C*F},(_,i)=>{ const x=i%C,y=Math.floor(i/C); return `<div class="celda" data-x="${x}" data-y="${y}">${esRoca(x,y)?ROCA:(x===L.m[0]&&y===L.m[1]?FLOR('#FF5D8F'):'')}</div>`; }).join('')}<div class="robi">${ROBOT}</div></div>
          <div class="ctrl"><div class="flechas">${['','arriba','','izquierda','*','derecha','','abajo',''].map(d=>d==='*'?`<span class="centro">${icono('j_robot')}</span>`:d?`<button class="flecha" type="button" data-d="${d}" aria-label="${d}">${icono('flecha_'+d)}</button>`:'<span></span>').join('')}</div>
          <div class="programa" aria-label="Programa del robot"></div>
          <div class="fila"><button class="big sec peq" type="button" data-acc="borrar"><span>Quitar la última</span></button><button class="big peq" type="button" data-acc="go"><span>¡Adelante!</span></button></div></div></div>`;
        const robi=a.z.querySelector('.robi'), mapa=a.z.querySelector('.mapa'), progEl=a.z.querySelector('.programa'), prog=[]; let pos=[...L.s], corriendo=false;
        const pon=(x,y)=>{ const c=a.z.querySelector(`.celda[data-x="${x}"][data-y="${y}"]`); if(!c) return; robi.style.left=c.offsetLeft+'px'; robi.style.top=c.offsetTop+'px'; robi.style.width=c.offsetWidth+'px'; };
        const pinta=()=>{ progEl.innerHTML=prog.length?prog.map(d=>`<span class="paso-p">${icono('flecha_'+d)}</span>`).join(''):'<span class="vacio">Tocad las flechas para hacer el programa.</span>'; };
        pinta(); requestAnimationFrame(()=>pon(...pos)); try{ new ResizeObserver(()=>pon(...pos)).observe(mapa); }catch(e){}
        const reinicia=()=>setTimeout(()=>{ pos=[...L.s]; pon(...pos); },900);
        function bfs(){ const k=(x,y)=>x+','+y, prev={[k(...L.s)]:null}, q=[[...L.s]];
          while(q.length){ const [x,y]=q.shift(); if(x===L.m[0]&&y===L.m[1]) break; for(const [dx,dy] of Object.values(D)){ const nx=x+dx, ny=y+dy; if(fuera(nx,ny)||esRoca(nx,ny)||k(nx,ny) in prev) continue; prev[k(nx,ny)]=[x,y]; q.push([nx,ny]); } }
          const r=[]; let c=[...L.m]; while(c){ r.push(c); c=prev[k(...c)]; } return r; }
        const ayuda=()=>bfs().forEach(([x,y])=>{ const c=a.z.querySelector(`.celda[data-x="${x}"][data-y="${y}"]`); if(c) c.classList.add('ruta'); });
        a.z.querySelectorAll('.flecha').forEach(b=>b.addEventListener('click',()=>{ if(corriendo||EST.robot.resuelta) return; if(prog.length>=10){ decir('El programa ya es muy largo. Probad a ponerlo en marcha.'); return; } prog.push(b.dataset.d); hablar(NOM[b.dataset.d]); pinta(); }));
        a.z.querySelector('[data-acc="borrar"]').addEventListener('click',()=>{ if(!corriendo){ prog.pop(); pinta(); } });
        a.z.querySelector('[data-acc="go"]').addEventListener('click',async()=>{
          if(corriendo||EST.robot.resuelta) return; if(!prog.length){ decir('Primero ponemos flechas en el programa.'); return; }
          corriendo=true; pos=[...L.s]; pon(...pos); await espera(300);
          for(let i=0;i<prog.length;i++){
            progEl.querySelectorAll('.paso-p').forEach((e,j)=>e.classList.toggle('activo',j===i));
            const [dx,dy]=D[prog[i]], nx=pos[0]+dx, ny=pos[1]+dy;
            if(fuera(nx,ny)||esRoca(nx,ny)){ sacude(robi); corriendo=false; a.fallo('¡Uy! El robot se ha chocado. Miramos el programa y lo arreglamos.',ayuda); reinicia(); return; }
            pos=[nx,ny]; pon(nx,ny); tono([520],'square',.04,.1,.12); await espera(quieto()?750:550);
          }
          corriendo=false; progEl.querySelectorAll('.paso-p').forEach(e=>e.classList.remove('activo'));
          if(pos[0]===L.m[0]&&pos[1]===L.m[1]) a.ok(`¡El robot ha llegado a la flor! El programa es: ${prog.map(d=>NOM[d]).join(', ')}. Ahora probadlo con el robot de verdad.`,robi);
          else { a.fallo('El robot no ha llegado a la flor. ¿Qué flechas faltan o sobran?',ayuda); reinicia(); }
        });
        decir(n===0?'Robi el robot quiere llegar a la flor. Tocad las flechas para hacer el camino y después pulsad «¡Adelante!».':'Otro camino para Robi. ¡Cuidado con las rocas!');
      }},

    construye:{titulo:'Toca, construye y comprueba',ic:'j_construye',
      puente:'Dejad los bloques en el rincón de construcción con estas torres como tarjetas modelo, para que sigan copiándolas.',
      ronda(n,a){
        const N=[2,3,3,4,5][n], fila=n===2, mod=Array.from({length:N},()=>azar(Object.keys(COL)));
        a.z.innerHTML=`<div class="modelo"><div class="torre ${fila?'fila-b':''}">${mod.map(c=>`<span class="bloque">${BLOQUE(c)}</span>`).join('')}</div></div><div class="pasos-c"></div>`;
        decir(`Con vuestros bloques de verdad, construid ${fila?'este tren':'esta torre'} de ${NUMW[N]} bloques. ${fila?'De izquierda a derecha':'De abajo arriba'}: ${mod.join(', ')}.`);
        const pc=a.z.querySelector('.pasos-c'), f=document.createElement('div'); f.className='fila'; pc.appendChild(f);
        boton('¡Ya lo hemos construido!',()=>{ f.remove(); comprobar(); },true,f,'j_construye');
        function comprobar(){
          decir('¡Vamos a comprobarlo! Mirad vuestra construcción y tocad cada bloque que esté igual que en la pizarra.');
          pc.innerHTML=`<div class="checks">${mod.map((c,i)=>`<button class="chk" type="button" data-i="${i}"><span class="sw" style="background:${COL[c]}"></span>${fila?'Bloque '+(i+1):(i===0?'Abajo':(i===N-1?'Arriba':'Bloque '+(i+1)))}: ${c}<span class="box"></span></button>`).join('')}</div>`;
          let hechos=0;
          pc.querySelectorAll('.chk').forEach(b=>b.addEventListener('click',()=>{ if(b.classList.contains('ok')) return; b.classList.add('ok'); b.querySelector('.box').innerHTML=CHECK; a.bien(); hablar(mod[+b.dataset.i]);
            if(++hechos===N) a.ok(`¡Es igual que el modelo! ¡${fila?'Un tren perfecto':'Una torre perfecta'}!`,a.z.querySelector('.torre')); }));
          const f2=document.createElement('div'); f2.className='fila'; pc.appendChild(f2);
          boton('Algo no es igual',()=>{ decir('¡No pasa nada! Miramos el modelo otra vez, cambiamos el bloque y volvemos a comprobar.'); marca([a.z.querySelector('.modelo')],2500); },false,f2).classList.add('sec');
        }
      }},

    jardin:{titulo:'El jardín de la clase',ic:'j_jardin',libre:true,puente:'',
      abrir(z){
        const pts=jardinMem, T=36, n=Math.min(pts,T), est=i=>Math.max(0,Math.min(3,n-i*3));
        z.innerHTML=`<div class="jardin-info"><b>${pts} ${pts===1?'logro':'logros'}</b><span>conseguidos entre todos</span><span class="barra-prog" role="img" aria-label="${n} de ${T}"><i style="width:${n/T*100}%"></i></span></div>
          <div class="jardin-grid">${Array.from({length:12},(_,i)=>`<span class="planta">${PLANTA(est(i),FLORC[i%FLORC.length])}</span>`).join('')}</div>
          <p class="vacio">Cada reto que superáis en cualquier juego hace crecer el jardín. También podéis apuntar aquí logros de la clase:</p>
          <div class="logros">${LOGROS.map((l,i)=>`<button class="logro" type="button" data-i="${i}">${icono(l.ic)}${l.t}</button>`).join('')}</div>
          <div class="fila"><button class="big sec peq" type="button" data-acc="nuevo"><span>Empezar un jardín nuevo</span></button></div>`;
        z.querySelectorAll('.logro').forEach(b=>b.addEventListener('click',()=>{ jardinSuma(1); acierto(); anima('contento'); celebrar(b); decir(`¡${LOGROS[+b.dataset.i].d}! El jardín crece un poquito más.`); setTimeout(()=>{ if(modo==='jardin') JUEGOS.jardin.abrir(z,true); },1000); }));
        const nb=z.querySelector('[data-acc="nuevo"]'); let conf=false;
        nb.addEventListener('click',()=>{ if(!conf){ conf=true; nb.querySelector('span').textContent='¿Seguro? Toca otra vez para empezar de cero'; setTimeout(()=>{ conf=false; if(nb.isConnected) nb.querySelector('span').textContent='Empezar un jardín nuevo'; },4000); return; }
          jardinPon(0); decir('Empezamos un jardín nuevo. ¡A sembrar!'); JUEGOS.jardin.abrir(z,true); });
        if(!arguments[1]) decir(pts>=T?'¡El jardín está lleno de flores! Lo hemos conseguido entre todos.':`Este es nuestro jardín. Llevamos ${pts} ${pts===1?'logro':'logros'} juntos. ¡Cada logro lo hace crecer!`);
      }},

    quepasa:{titulo:'¿Qué pasa si…?',ic:'j_quepasa',
      elegir:{texto:'¿Qué experimento hacemos hoy?',ops:[{k:'flota',lbl:'¿Flota o se hunde?',html:`<svg viewBox="0 0 120 100"><path d="M14 30v50q0 12 12 12h68q12 0 12-12V30" fill="#9BE0F0" stroke="${K}" stroke-width="4"/><path d="M14 42q23 8 46 0t46 0" fill="none" stroke="#fff" stroke-width="4"/>${encaja(CORCHO,30,14,36,36)}${encaja(ROCA,62,56,36,36)}</svg>`},{k:'color',lbl:'¿Qué color sale?',html:`<svg viewBox="0 0 120 100">${encaja(GOTA('azul'),6,20,50,50)}${encaja(GOTA('amarillo'),64,20,50,50)}<text x="60" y="56" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="${K}">+</text></svg>`}]},
      puente:'Dejad el barreño de agua o las pinturas en un rincón para que sigan probando con otros objetos y colores.',
      resumen:s=>registroHTML(s),
      ronda(n,a){
        const s=EST.quepasa; if(n===0) s.reg=[];
        if(s.v==='flota'){
          if(n===0) s.orden=mezcla(COSAS).slice(0,5);
          const c=s.orden[n];
          a.z.innerHTML=`<div class="exp"><div class="tanque"><span class="cosa">${c.svg}</span></div><div class="exp-lado"></div></div>`;
          const lado=a.z.querySelector('.exp-lado');
          decir(`Tenemos ${c.n}. ¿Qué pensáis? ¿Flotará o se hundirá? ¡Votad!`);
          votacion(lado,[{k:'flota',lbl:'Flota',html:tarjetaPicto('flota','#BFEAF2')},{k:'hunde',lbl:'Se hunde',html:tarjetaPicto('hunde','#C9D6F2')}],w=>{
            const pred=w.k; lado.innerHTML='';
            decir(`Pensamos que ${pred==='flota'?'flotará':'se hundirá'}. ¡Ahora lo probamos de verdad! Meted ${c.n} en el agua. ¿Qué ha pasado?`);
            lado.insertAdjacentHTML('beforeend',`<div class="opts">${[['flota','Ha flotado'],['hunde','Se ha hundido']].map(([k,l])=>`<button class="opt" type="button" data-k="${k}"><span class="dib">${tarjetaPicto(k,k==='flota'?'#BFEAF2':'#C9D6F2')}</span><span class="lbl">${l}</span></button>`).join('')}</div>`);
            lado.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{
              if(EST.quepasa.resuelta||b.disabled) return; const res=b.dataset.k;
              a.z.querySelector('.cosa').classList.add(res); s.reg.push({svg:c.svg,pred,res,tipo:'flota'});
              lado.querySelectorAll('.opt').forEach(x=>x.disabled=true); b.classList.add('bien');
              setTimeout(()=>{ lado.insertAdjacentHTML('beforeend',registroHTML(s)); a.ok(pred===res?`¡Acertamos! ${may(c.n)} ${res==='flota'?'flota':'se hunde'}.`:`¡Sorpresa! Pensábamos otra cosa, pero ${c.n} ${res==='flota'?'flota':'se hunde'}. ¡Así aprendemos!`); },1300);
            }));
          });
        } else {
          const [c1,c2,r]=MEZ[n], ops=mezcla([r,...mezcla(['naranja','verde','morado','rosa','celeste'].filter(x=>x!==r)).slice(0,2)]);
          a.z.innerHTML=`<div class="mezcla"><span class="gota">${GOTA(c1)}</span><span class="signo">+</span><span class="gota">${GOTA(c2)}</span><span class="signo">=</span><span class="gota" id="gRes">${GOTA_Q}</span></div><div class="exp-lado"></div>`;
          const lado=a.z.querySelector('.exp-lado');
          decir(`Si mezclamos ${c1} y ${c2}, ¿qué color saldrá? ¡Votad!`);
          votacion(lado,ops.map(k=>({k,lbl:may(k),html:GOTA(k)})),w=>{
            const pred=w.k; lado.innerHTML='';
            decir(`Pensamos que saldrá ${pred}. ¡Ahora mezclamos las pinturas de verdad! ¿Qué color ha salido?`);
            lado.insertAdjacentHTML('beforeend',`<div class="opts">${ops.map(k=>`<button class="opt" type="button" data-k="${k}"><span class="dib">${GOTA(k)}</span><span class="lbl">${may(k)}</span></button>`).join('')}</div>`);
            lado.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{
              if(EST.quepasa.resuelta||b.disabled) return; const res=b.dataset.k;
              const g=a.z.querySelector('#gRes'); g.innerHTML=GOTA(res); if(!quieto()) g.classList.add('aparece');
              s.reg.push({c1,c2,pred,res,tipo:'color'}); lado.querySelectorAll('.opt').forEach(x=>x.disabled=true); b.classList.add('bien');
              setTimeout(()=>{ lado.insertAdjacentHTML('beforeend',registroHTML(s)); a.ok(pred===res?`¡Acertamos! ${may(c1)} y ${c2} hacen ${res}.`:`¡Sorpresa! Ha salido ${res}. ¡Así aprendemos!`,g); },900);
            }));
          });
        }
      }},

    duo:{titulo:'Juego a dúo',ic:'j_duo',
      puente:'Jugad por parejas con piezas de verdad: uno elige el color y el otro la forma, y lo construyen juntos.',
      ronda(n,a){
        const cs=Object.keys(COL), fs=['circulo','cuadrado','triangulo','estrella'], t={c:azar(cs),f:azar(fs)}, oculto=n>=3;
        const nombre=`${art(t.f)} ${FORMAS[t.f].n} ${colAdj(t.c,FORMAS[t.f].f)}`;
        a.z.innerHTML=`<div class="duo">
          <div class="mitad j1"><h4><span class="av">${SERES.pez.svg}</span>Jugador 1: el color</h4><div class="bts">${cs.map(c=>`<button class="bd" type="button" data-c="${c}" aria-label="${c}"><span class="sw" style="background:${COL[c]}"></span></button>`).join('')}</div></div>
          <div class="objetivo"><span class="etq">Lolo necesita</span><div class="tgt">${oculto?'<span class="q">?</span>':tokenSvg(t.f,t.c)}</div><b>${oculto?'¡Escuchad!':may(nombre)}</b></div>
          <div class="mitad j2"><h4><span class="av">${SERES.estrella.svg}</span>Jugador 2: la forma</h4><div class="bts">${fs.map(f=>`<button class="bd" type="button" data-f="${f}" aria-label="${FORMAS[f].n}">${siluetaSvg(f).replace('stroke-dasharray="9 7"','').replace('rgba(24,49,83,.07)','#DCE4EC')}</button>`).join('')}</div></div></div>`;
        let sc=null, sf=null; const tgt=a.z.querySelector('.tgt');
        const prueba=()=>{
          if(!sc||!sf||EST.duo.resuelta) return; const okc=sc===t.c, okf=sf===t.f;
          if(okc&&okf){ tgt.innerHTML=tokenSvg(t.f,t.c); a.ok(`¡Lo habéis conseguido juntos! ${may(nombre)}.`,tgt); return; }
          a.fallo(okc?'El color está bien, pero la forma no. ¡Jugador 2, prueba otra vez!':okf?'La forma está bien, pero el color no. ¡Jugador 1, prueba otra vez!':'Ni el color ni la forma. ¡Probad otra vez juntos!',
            ()=>marca([okc?null:a.z.querySelector(`[data-c="${t.c}"]`),okf?null:a.z.querySelector(`[data-f="${t.f}"]`)]));
          if(!okc){ sc=null; a.z.querySelectorAll('[data-c]').forEach(x=>x.classList.remove('sel')); }
          if(!okf){ sf=null; a.z.querySelectorAll('[data-f]').forEach(x=>x.classList.remove('sel')); }
        };
        a.z.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>{ sc=b.dataset.c; a.z.querySelectorAll('[data-c]').forEach(x=>x.classList.toggle('sel',x===b)); hablar(sc); prueba(); }));
        a.z.querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{ sf=b.dataset.f; a.z.querySelectorAll('[data-f]').forEach(x=>x.classList.toggle('sel',x===b)); hablar(FORMAS[sf].n); prueba(); }));
        decir(`${oculto?'Escuchad bien. ':''}Lolo necesita ${nombre}. El jugador 1 elige el color y el jugador 2, la forma. ¡Solo lo conseguís juntos!`);
      }},

    escape:{titulo:'Mini-escape de colores',ic:'j_escape',R:4,etiq:['Candado 1','Candado 2','Candado 3','¡Rescate!'],
      puente:'Preparad una caja con tres candados o pinzas de colores y esconded dentro un peluche para rescatarlo entre todos.',
      ronda(n,a){
        const s=EST.escape; if(n===0) s.abiertos=0;
        const CC=['#E5484D','#FFC93C','#3D8DF2'];
        a.z.innerHTML=`<div class="jaula-wrap"><div class="jaula">${JAULA(false)}</div><div class="candados">${CC.map((c,i)=>CANDADO(c,i<s.abiertos)).join('')}</div></div><div class="reto-esc"></div>`;
        const r=a.z.querySelector('.reto-esc');
        const abre=msg=>{ s.abiertos++; a.z.querySelector('.candados').innerHTML=CC.map((c,i)=>CANDADO(c,i<s.abiertos)).join(''); a.ok(msg,a.z.querySelector('.candados')); };
        if(n===0){
          const seq=Array.from({length:3},()=>azar(Object.keys(COL)));
          r.innerHTML=`<div class="nota-c"><span class="etq">La nota de Paco</span>${seq.map(c=>`<i style="background:${COL[c]}"></i>`).join('')}</div><div class="huecos">${seq.map(()=>'<i></i>').join('')}</div><div class="colbts">${Object.keys(COL).map(c=>`<button class="colbt" type="button" data-c="${c}" style="background:${COL[c]}" aria-label="${c}"></button>`).join('')}</div>`;
          let ent=[]; const hs=[...r.querySelectorAll('.huecos i')];
          r.querySelectorAll('.colbt').forEach(b=>b.addEventListener('click',()=>{
            if(EST.escape.resuelta||ent.length>=seq.length) return; const c=b.dataset.c; ent.push(c); hablar(c);
            hs[ent.length-1].style.background=COL[c]; hs[ent.length-1].style.borderStyle='solid';
            if(ent.length===seq.length){
              if(ent.join()===seq.join()) abre('¡Clic! ¡El primer candado se ha abierto!');
              else { a.fallo('Ese no es el orden. Miramos otra vez la nota de Paco: '+seq.join(', ')+'.',()=>marca([r.querySelector('.nota-c')])); setTimeout(()=>{ ent=[]; hs.forEach(h=>{ h.style.background=''; h.style.borderStyle=''; }); },800); }
            }
          }));
          decir('¡Oh, no! El cangrejo Paco está encerrado con tres candados. Para abrir el primero, tocad los colores en el mismo orden que la nota.');
        } else if(n===1){
          const fs=mezcla(['circulo','cuadrado','triangulo','estrella','corazon']).slice(0,3), f=fs[0], ops=mezcla(fs);
          r.innerHTML=`<div class="cerradura"><span class="etq">La cerradura</span><span class="hole">${siluetaSvg(f)}</span></div><div class="opts">${ops.map(k=>`<button class="opt" type="button" data-f="${k}" aria-label="Llave con forma de ${FORMAS[k].n}"><span class="dib">${LLAVE_F(k)}</span></button>`).join('')}</div>`;
          r.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{ if(EST.escape.resuelta) return; const k=b.dataset.f;
            if(k===f){ b.classList.add('bien'); abre('¡Clic! ¡La llave encaja! Segundo candado abierto.'); }
            else { sacude(b); a.fallo(`Esa llave tiene forma de ${FORMAS[k].n}, y la cerradura tiene forma de ${FORMAS[f].n}.`,()=>marca([r.querySelector(`[data-f="${f}"]`)])); } }));
          decir('Para el segundo candado necesitamos la llave que encaja. Mirad bien la forma de la cerradura.');
        } else if(n===2){
          const ks=mezcla(Object.keys(INSTRUMENTOS)).slice(0,3), k=ks[0], ops=mezcla(ks);
          r.innerHTML=`<div class="fila" style="justify-content:center"><button class="big peq" type="button" data-acc="oir"><span>Escuchar el sonido</span></button></div><div class="opts">${ops.map(x=>`<button class="opt" type="button" data-k="${x}" aria-label="${NOMI[x]}"><span class="dib">${INSTRUMENTOS[x]}</span></button>`).join('')}</div>`;
          const oir=()=>INSTR[k](); r.querySelector('[data-acc="oir"]').addEventListener('click',oir); setTimeout(()=>{ if(r.isConnected) oir(); },2600);
          r.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{ if(EST.escape.resuelta) return; const x=b.dataset.k;
            if(x===k){ b.classList.add('bien'); abre(`¡Clic! ¡Era ${NOMI[k]}! Tercer candado abierto.`); }
            else { INSTR[x](); sacude(b); a.fallo('Ese instrumento suena distinto. Escuchad otra vez el sonido.',()=>marca([r.querySelector(`[data-k="${k}"]`)])); } }));
          decir('El último candado se abre con un sonido. Escuchad bien y elegid el instrumento que suena.');
        } else {
          r.innerHTML='<p class="texto-cuento" style="text-align:center">Tocad la jaula para abrir la puerta.</p>';
          const j=a.z.querySelector('.jaula'); j.classList.add('tocable'); j.setAttribute('role','button'); j.tabIndex=0; j.setAttribute('aria-label','Abrir la jaula');
          const rescate=()=>{ if(EST.escape.resuelta) return; j.innerHTML=JAULA(true); a.ok('¡Libre! ¡Habéis rescatado al cangrejo Paco! Gracias, amigos.',j); };
          j.addEventListener('click',rescate); j.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); rescate(); } });
          decir('¡Los tres candados están abiertos! Tocad la jaula para liberar a Paco.');
        }
      }},

    emociones:{titulo:'Las emociones de Lolo',ic:'j_emociones',
      puente:'En la asamblea, cada niño enseña con la cara cómo se siente hoy, y entre todos pensamos cómo ayudar a quien está triste o enfadado.',
      ronda(n,a){
        const s=EST.emociones; if(n===0) s.orden=mezcla(SITU());
        const sit=s.orden[n], EMO={feliz:'Alegre',triste:'Triste',enfado:'Enfadado',miedo:'Con miedo',sorpresa:'Sorprendido'};
        a.z.innerHTML=`<div class="situacion">${sit.quien}${sit.cosa}</div><div class="fase"></div>`;
        const fase=a.z.querySelector('.fase');
        fase.innerHTML=`<div class="opts">${Object.keys(EMO).map(k=>`<button class="opt" type="button" data-k="${k}" aria-label="${EMO[k]}"><span class="dib">${CARAS[k]}</span><span class="lbl">${EMO[k]}</span></button>`).join('')}</div>`;
        decir(`${sit.txt} ¿Cómo se siente ${sit.nom}?`);
        let paso2=false;
        fase.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{
          if(paso2) return; const k=b.dataset.k;
          if(k===sit.emo){ paso2=true; b.classList.add('bien'); a.bien(); cara(sit.emo==='miedo'?'sorpresa':sit.emo); decir(`Sí, ${sit.nom} se siente ${sit.emoTxt}. ¿Cómo le podemos ayudar?`); setTimeout(ayudas,1400); }
          else { sacude(b); a.fallo('Mirad su cara y pensad: si os pasara a vosotros, ¿cómo os sentiríais?',()=>marca([fase.querySelector(`[data-k="${sit.emo}"]`)])); }
        }));
        function ayudas(){
          fase.innerHTML=`<div class="opts">${sit.ay.map((o,i)=>`<button class="opt" type="button" data-i="${i}"><span class="dib">${o.html}</span><span class="lbl">${o.t}</span></button>`).join('')}</div><div class="fila"><button class="big sec peq" type="button" data-acc="idea"><span>Tenemos otra idea</span></button></div>`;
          fase.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{ if(EST.emociones.resuelta) return; const o=sit.ay[+b.dataset.i];
            if(o.ok){ b.classList.add('bien'); a.ok(`¡Buena idea! ${o.r}`,b); } else { sacude(b); a.fallo(o.r); } }));
          fase.querySelector('[data-acc="idea"]').addEventListener('click',()=>{ if(!EST.emociones.resuelta) a.ok('¡Qué buena idea! Vamos a probarla. Pensar en cómo ayudar a los demás nos hace mejores amigos.'); });
        }
      }},

    muevete:{titulo:'Muévete y responde',ic:'j_muevete',
      puente:'Salid al patio o al gimnasio y repetid los juegos sin pantalla: la maestra dice un número o un animal y todos se mueven.',
      ronda(n,a){
        const tipo=['numero','animal','senal','estatuas','animal'][n], s=EST.muevete; if(n===0) s.usados=[];
        const listo=t=>{ if(a.z.querySelector('[data-listo]')) return; const f=document.createElement('div'); f.className='fila'; f.dataset.listo=1; a.z.appendChild(f); boton(t||'¡Lo hemos hecho!',()=>{ paraMusica(); f.remove(); a.ok('¡Muy bien! ¡Qué bien os movéis!'); },true,f,'mover'); };
        const extra=(t,fn)=>{ const f=document.createElement('div'); f.className='fila'; a.z.appendChild(f); const b=document.createElement('button'); b.className='big sec peq'; b.type='button'; b.innerHTML=`<span>${t}</span>`; b.onclick=fn; f.appendChild(b); return b; };
        if(tipo==='numero'){
          const N=2+Math.floor(Math.random()*3);
          a.z.innerHTML=`<div class="carta-mov"><span class="grande">${N}</span><span class="pts-g">${'<i></i>'.repeat(N)}</span><p class="texto-cuento">Saltamos ${NUMW[N]} veces</p></div>`;
          decir(`¡De pie! Saltamos ${NUMW[N]} veces. Contamos juntos.`);
          extra('Contar con Lolo',()=>{ for(let i=1;i<=N;i++) setTimeout(()=>{ hablar(NUMW[i]); palmada(0); },i*900); }); listo();
        } else if(tipo==='animal'){
          const AM=[{k:'gato',t:'Andamos a gatas como un gato y decimos «miau».'},{k:'perro',t:'Movemos la colita como un perro y decimos «guau».'},{k:'vaca',t:'Andamos muy despacito como una vaca y decimos «muuu».'},{k:'pato',t:'Andamos como un pato, con los brazos como alas: «cuac, cuac».'}];
          const op=AM.filter(x=>!s.usados.includes(x.k)), an=azar(op.length?op:AM); s.usados.push(an.k);
          a.z.innerHTML=`<div class="carta-mov">${ANIMALES[an.k]}<p class="texto-cuento">${an.t}</p></div>`; decir('¡A movernos! '+an.t); listo();
        } else if(tipo==='senal'){
          a.z.innerHTML=`<div class="reglas"><span class="regla"><i style="background:${COL.rojo}"></i>Rojo: saltamos</span><span class="regla"><i style="background:${COL.azul}"></i>Azul: nos sentamos</span><span class="regla"><i style="background:${COL.amarillo}"></i>Amarillo: aplaudimos</span></div><div class="carta-mov"><span class="senal"></span></div>`;
          decir('Mirad las reglas. Cuando salga un color, hacemos lo que dice. ¿Preparados?'); let k=0;
          extra('Sacar un color',()=>{ const c=azar(['rojo','azul','amarillo']); a.z.querySelector('.senal').style.background=COL[c]; tono([300,400,500],'triangle',.08,.08,.15); decir({rojo:'¡Rojo! ¡Saltamos!',azul:'¡Azul! ¡Nos sentamos!',amarillo:'¡Amarillo! ¡Aplaudimos!'}[c]); if(++k>=3) listo(); });
        } else {
          a.z.innerHTML=`<div class="carta-mov"><span class="ic-grande">${icono('nota')}</span><p class="texto-cuento">Cuando suena la música, bailamos. Cuando para… ¡estatuas!</p></div>`;
          decir('Cuando suena la música, bailamos. Cuando para… ¡estatuas! Nadie se mueve.'); let k=0;
          extra('Poner música',()=>{ suenaMusica(); hablar('¡A bailar!'); });
          extra('¡Estatuas!',()=>{ paraMusica(); decir('¡Estatuas! Nadie se mueve… muy bien.'); if(++k>=2) listo(); });
        }
      }},

    caza:{titulo:'Caza mágica',ic:'j_caza',
      elegir:{texto:'¿Qué vamos a cazar hoy con la varita mágica?',ops:[{k:'animales',lbl:'Animales',html:ANIMALES.gato},{k:'planetas',lbl:'Planetas',html:PLANETAS.saturno.svg}]},
      puente:'Dibujad el animal o el planeta que más os ha gustado y escondedlo por la clase para que otro grupo lo encuentre.',
      ronda(n,a){
        const s=EST.caza, BANCO=s.v==='planetas'?PLANETAS:CAZA_AN; if(n===0) s.lista=mezcla(Object.keys(BANCO)).slice(0,5);
        const it=BANCO[s.lista[n]], sitio=Math.floor(Math.random()*6);
        a.z.innerHTML=`<div class="caza"><div class="portal"></div><div class="escondites">${Array.from({length:6},(_,i)=>`<button class="esc" type="button" data-i="${i}" aria-label="Escondite ${i+1}" disabled>${s.v==='planetas'?NUBE:ROCA}</button>`).join('')}</div></div>`;
        const portal=a.z.querySelector('.portal'), escs=[...a.z.querySelectorAll('.esc')];
        decir('Preparad la varita mágica… Decid todos juntos: «¡Abracadabra!»');
        const f=document.createElement('div'); f.className='fila'; a.z.appendChild(f);
        boton('¡Abracadabra!',()=>{ f.remove(); portal.innerHTML=`<div class="holo aparece">${it.svg}</div>`; tono([523,659,784,1047,1319],'sine',.12,.09,.5); decir(`¡Ha aparecido ${it.n}! ${it.dato}`);
          setTimeout(()=>{ if(!a.z.isConnected) return; const f2=document.createElement('div'); f2.className='fila'; a.z.appendChild(f2);
            boton('¡Que se esconda!',()=>{ f2.remove(); portal.innerHTML=''; escs.forEach(e=>e.disabled=false); decir(`¡${may(it.n)} se ha escondido detrás de ${s.v==='planetas'?'una nube':'una roca'}! ¿Dónde está? Tocad para buscar.`); },true,f2); },1600);
        },true,f,'j_caza');
        escs.forEach((e,i)=>e.addEventListener('click',()=>{
          if(EST.caza.resuelta||e.classList.contains('visto')) return;
          if(i===sitio){ e.innerHTML=`<span class="encontrado aparece">${it.svg}</span>`; a.ok(`¡Lo habéis encontrado! Es ${it.n}.`,e); }
          else { e.classList.add('visto'); sacude(e); a.fallo('¡Aquí no está! Buscad en otro sitio.',()=>marca([escs[sitio]])); }
        }));
      }}
  });

  /* ================= MENÚ POR CATEGORÍAS Y EDADES ================= */
  const CATS=[
    {t:'Rutinas y asamblea',c:'#FF8A3D',ids:['lolo','jardin','muevete']},
    {t:'Lenguaje, cuentos y emociones',c:'#9B6BFF',ids:['caja','cuento','emociones']},
    {t:'Lógica y matemáticas',c:'#3D8DF2',ids:['cuenta','series','cestas','tamanos','parejas','formas']},
    {t:'Retos y cooperación',c:'#FF5D8F',ids:['duo','escape','robot']},
    {t:'Ciencia y manipulación',c:'#2BB673',ids:['quepasa','construye','caza']}
  ];
  const INFO={
    lolo:{t:'La visita de Lolo',ic:'lolo',e:[3,4],d:'Asamblea con Lolo: una rutina distinta para cada día de la semana.'},
    jardin:{e:[3,4,5],d:'Un jardín de toda la clase que crece con cada logro del grupo.'},
    muevete:{e:[3,4,5],d:'Saltar números, imitar animales, señales de colores y estatuas.'},
    caja:{t:'La caja misteriosa',ic:'caja',e:[3,4,5],d:'Una imagen escondida y la rutina Veo, Pienso, Me pregunto.'},
    cuento:{e:[3,4,5],d:'Un cuento con tres decisiones que vota toda la clase.'},
    emociones:{e:[3,4,5],d:'Reconocer cómo se sienten los personajes y pensar cómo ayudarles.'},
    cuenta:{e:[3,4],d:'Contar objetos del 1 al 5 y elegir el número.'},
    series:{e:[4,5],d:'Completar series de colores, formas y tamaños.'},
    cestas:{e:[3,4],d:'Clasificar juguetes por color, forma o tamaño.'},
    tamanos:{e:[3,4],d:'Ordenar de pequeño a grande.'},
    parejas:{e:[3,4,5],d:'Memory de colores, animales y números.'},
    formas:{e:[3,4,5],d:'Encajar cada forma en su silueta.'},
    duo:{e:[4,5],d:'Dos niños, cada uno con su mitad de la pantalla: solo ganan juntos.'},
    escape:{e:[4,5],d:'Tres candados de colores, formas y sonidos para rescatar a Paco.'},
    robot:{e:[4,5],d:'Programar con flechas el camino de un robot, en pantalla y con el robot de suelo.'},
    quepasa:{e:[4,5],d:'Predecir, probar y registrar: flotar y hundirse, mezclar colores.'},
    construye:{e:[3,4,5],d:'Copiar torres con bloques de verdad y comprobarlas en la pizarra.'},
    caza:{e:[3,4,5],d:'Animales y planetas que aparecen por arte de magia y se esconden.'}
  };
  const tituloDe=id=>INFO[id].t||JUEGOS[id].titulo, icDe=id=>INFO[id].ic||JUEGOS[id].ic, catDe=id=>CATS.find(c=>c.ids.includes(id));
  const edadTxt=e=>e.length===1?`${e[0]} años`:`${e[0]}–${e[e.length-1]} años`;
  let filtroEdad=0; try{ filtroEdad=+(localStorage.getItem('lolo-edad')||0)||0; }catch(e){}
  function pintaMenu(){
    $('#menuCats').innerHTML=CATS.map(c=>{ const ids=c.ids.filter(id=>!filtroEdad||INFO[id].e.includes(filtroEdad)); if(!ids.length) return '';
      return `<section class="cat" style="--catc:${c.c}"><h3><i></i>${c.t}</h3><div class="cat-grid">${ids.map(id=>`<button class="jcard" type="button" data-m="${id}" ${id===modo?'aria-current="true"':''}><span class="ti">${icono(icDe(id))}</span><span><b>${tituloDe(id)}</b><p>${INFO[id].d}</p><span class="ed">${edadTxt(INFO[id].e)}</span></span></button>`).join('')}</div></section>`; }).join('');
    document.querySelectorAll('.edad-f').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.e===filtroEdad));
  }
  function pintaActual(){ const c=catDe(modo); $('#actualIc').innerHTML=icono(icDe(modo)); $('#actualT').textContent=tituloDe(modo); $('#actualC').textContent=`${c.t} · ${edadTxt(INFO[modo].e)}`; $('.actual').style.setProperty('--catc',c.c); }
  const menuCapa=$('#menuCapa');
  $('#btnMenu').addEventListener('click',()=>{ pintaMenu(); menuCapa.hidden=false; const a=menuCapa.querySelector('.jcard[aria-current="true"]')||menuCapa.querySelector('.jcard'); if(a) a.focus(); });
  $('#cerrarMenu').addEventListener('click',()=>menuCapa.hidden=true);
  menuCapa.addEventListener('click',e=>{ if(e.target===menuCapa){ menuCapa.hidden=true; return; } const j=e.target.closest('.jcard'); if(j){ menuCapa.hidden=true; ponModo(j.dataset.m); } const f=e.target.closest('.edad-f'); if(f){ filtroEdad=+f.dataset.e; try{ localStorage.setItem('lolo-edad',filtroEdad); }catch(err){} pintaMenu(); } });
  $('#chipJardin').addEventListener('click',()=>ponModo('jardin'));
  jardinPon(jardinMem);
  $('#panelCaja').insertAdjacentHTML('afterend',IDS.map(id=>`<section class="panel juego" id="panel-${id}" aria-label="${JUEGOS[id].titulo}" hidden><div class="bocadillo"><span class="quien">Lolo</span><p class="txt" aria-live="polite"></p></div><div class="zona jz"></div></section>`).join(''));

  /* últimos juegos abiertos, para la portada */
  function registraReciente(m){ try{ const r=JSON.parse(localStorage.getItem('lolo-recientes')||'[]').filter(x=>x!==m); r.unshift(m); localStorage.setItem('lolo-recientes',JSON.stringify(r.slice(0,6))); }catch(e){} }

  /* ---------- cambiar de juego ---------- */
  const MODOS=['lolo','caja',...IDS];
  let caraLolo='duerme';
  const panelDe=m=>m==='lolo'?$('#panelLolo'):m==='caja'?$('#panelCaja'):$('#panel-'+m);
  function ponModo(m){
    if(m===modo||!MODOS.includes(m)) return;
    try{ speechSynthesis.cancel(); }catch(e){}
    paraMusica();
    if(modo==='lolo') caraLolo=lolo.dataset.cara;
    if(seleccion){ seleccion.classList.remove('elegida'); seleccion=null; }
    modo=m;
    app.classList.toggle('modo-caja',m!=='lolo');
    document.querySelectorAll('.panel').forEach(p=>p.hidden=p!==panelDe(m));
    texto=m==='lolo'?$('#texto'):m==='caja'?$('#textoCaja'):panelDe(m).querySelector('.txt');
    pintaActual(); registraReciente(m);
    if(m==='lolo'){ cara(caraLolo); pintaAgenda(); ultimo=texto.textContent; }
    else if(m==='caja'){ if(cajaIdx<0) nuevaCaja(); else { cara('feliz'); pintaRutina(); ultimo=texto.textContent; } }
    else if(JUEGOS[m].libre){ EST[m]=EST[m]||{libre:true}; cara('feliz'); pintaRondas(); JUEGOS[m].abrir(zonaDe(m)); }
    else if(!EST[m]) empezarJuego(m);
    else { cara('feliz'); pintaRondas(); ultimo=texto.textContent; }
    try{ history.replaceState(null,'','#'+m); }catch(e){}
  }
  addEventListener('hashchange',()=>{ const m=location.hash.slice(1); ponModo(MODOS.includes(m)?m:'lolo'); });


  const hoy=new Date().getDay(); dia=(hoy>=1&&hoy<=5)?hoy-1:0;
  aplicaCalma();
  inicio();
  pintaActual();
  { const m=location.hash.slice(1); if(m&&m!=='lolo') ponModo(m); else if(m==='lolo') registraReciente('lolo'); }

  /* Modo sin conexión: guarda la aplicación en la pizarra tras la primera visita */
  if('serviceWorker' in navigator && location.protocol!=='file:'){
    addEventListener('load',()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
  }
})();
