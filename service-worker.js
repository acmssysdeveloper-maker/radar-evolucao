const CACHE='radar-evolucao-v2-3-3';
const ASSETS=['./','./index.html','./sobre.html','./radar.html','./diagnostico.html','./resultado.html','./relatorio.html','./contato.html','./privacidade.html','./config.js','./css/styles.css','./js/data.js','./js/core.js','./js/api.js','./js/contexto.js','./manifest.webmanifest','./assets/icon-192.svg','./assets/icon-512.svg','./assets/pdf-showcase.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isNavigation=e.request.mode==='navigate' || e.request.destination==='document';
  if(isNavigation){
    e.respondWith(fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res}).catch(()=>caches.match('./index.html'))));
});
