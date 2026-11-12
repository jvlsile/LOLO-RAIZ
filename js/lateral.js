/* LOLO-RAIZ · menú lateral de iconos (acordado en docs/decisiones-ui.md).
   Se inyecta en Hoy, Asamblea, Registro, Planificación, Preparar y Juegos. */
(function(){
  var P={
    hoy:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15l2.5 2.5L16 13"/>',
    asamblea:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>',
    juegos:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
    fichas:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    registro:'<path d="M5 4h14v16H5z"/><path d="M5 9h14M5 14h14M10 4v16"/>',
    plan:'<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
    preparar:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    pantalla:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  var ITEMS=[['hoy','Hoy','hoy.html'],['asamblea','Asamblea','asamblea.html'],['juegos','Juegos','jugar.html'],['fichas','Fichas','fichas.html'],['registro','Registro','registro.html'],['plan','Planificación','planificacion.html']];
  var pag=(location.pathname.split('/').pop()||'index.html');
  var activo={'hoy.html':'hoy','asamblea.html':'asamblea','jugar.html':'juegos','registro.html':'registro','planificacion.html':'plan','preparar.html':'preparar'}[pag];
  function svg(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+P[k]+'</svg>';}
  function it(k,t,h,extra){return '<a class="lat-it'+(extra||'')+'" href="'+h+'"'+(k===activo?' aria-current="page"':'')+'>'+svg(k)+'<span>'+(t==='Planificación'?'<b class="lat-l">Planificación</b><b class="lat-c">Plan</b>':t)+'</span></a>';}
  var nav=document.createElement('nav');
  nav.className='lateral';nav.id='lateral';nav.setAttribute('aria-label','Menú principal');
  var h='<a class="lat-logo" href="./" aria-label="Ir al inicio"><img src="icons/icon-192.png" alt="" width="46" height="46"></a>';
  ITEMS.forEach(function(x){h+=it(x[0],x[1],x[2]);});
  h+='<span class="lat-sep"></span>';
  if(pag==='jugar.html')h+='<button type="button" class="lat-it lat-pant" id="latPantalla" aria-pressed="false">'+svg('pantalla')+'<span>Pantalla completa</span></button>';
  h+=it('preparar','Preparar','preparar.html',' lat-peq');
  nav.innerHTML=h;
  document.body.classList.add('con-lateral');
  document.body.insertBefore(nav,document.body.firstChild);
  var b=document.getElementById('latPantalla');
  if(b){
    var salir=document.createElement('button');
    salir.type='button';salir.className='lat-salir';salir.hidden=true;salir.setAttribute('aria-label','Salir de pantalla completa');
    salir.innerHTML=svg('pantalla');
    document.body.appendChild(salir);
    function pon(v){document.body.classList.toggle('pantalla-completa',v);b.setAttribute('aria-pressed',String(v));salir.hidden=!v;}
    b.addEventListener('click',function(){pon(true);});
    salir.addEventListener('click',function(){pon(false);});
  }
})();
