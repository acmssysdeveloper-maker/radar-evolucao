(function(){
  const KEY='radarEvolucaoSession';
  function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function set(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function createId(){return 'RE-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,8).toUpperCase()}
  function scoreLevel(score){return RADAR_DATA.levels.find(l=>score>=l.min&&score<=l.max)||RADAR_DATA.levels[0]}
  function scoresFromAnswers(answers){
    const by={}; RADAR_DATA.dimensions.forEach(d=>by[d.id]=[]);
    RADAR_DATA.questions.forEach((q,i)=>{const v=Number(answers[i]); if(Number.isFinite(v))by[q[0]].push(v)});
    const dim={}; Object.keys(by).forEach(k=>{dim[k]=by[k].length?((by[k].reduce((a,b)=>a+b,0)/by[k].length)*2.5):0});
    const overall=Object.values(dim).reduce((a,b)=>a+b,0)/RADAR_DATA.dimensions.length;
    return {dimensions:dim,overall};
  }
  function insight(scores){
    const arr=RADAR_DATA.dimensions.map(d=>({d,score:scores.dimensions[d.id]})).sort((a,b)=>b.score-a.score);
    const high=arr.slice(0,2), low=arr.slice(-3).reverse();
    return {high,low,summary:`Sua maior força relativa está em ${high.map(x=>x.d.short.toLowerCase()).join(' e ')}. Os pontos que merecem atenção prioritária aparecem em ${low.map(x=>x.d.short.toLowerCase()).join(', ')}.`}
  }
  function serialize(session){return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(session)))))}
  function deserialize(s){try{return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(s)))))}catch(e){return null}}
  function whatsappUrl(session){
    const num=(window.RADAR_CONFIG&&RADAR_CONFIG.WHATSAPP_NUMBER)||'';
    const msg=`Olá, Antonio Cesar. Fiz o Radar de Evolução da minha empresa. Resultado geral: ${session.scores.overall.toFixed(1).replace('.',',')}/10 — nível ${session.level.name}. Meus principais pontos de atenção foram ${session.insight.low.slice(0,3).map(x=>x.d.short).join(', ')}. Gostaria de conversar sobre o resultado.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }
  function fmt(n){return Number(n||0).toFixed(1).replace('.',',')}
  window.RadarCore={KEY,get,set,createId,scoreLevel,scoresFromAnswers,insight,serialize,deserialize,whatsappUrl,fmt};
})();
