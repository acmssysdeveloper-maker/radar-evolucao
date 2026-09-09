(function(){
  const KEY='radarEvolucaoSession';
  function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function set(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function createId(){
    const suffix=(window.crypto&&typeof crypto.randomUUID==='function')?crypto.randomUUID().split('-')[0].toUpperCase():Math.random().toString(36).slice(2,8).toUpperCase();
    return 'RE-'+new Date().getFullYear()+'-'+suffix;
  }
  function scoreLevel(score){
    const s=Number(score)||0;
    if(s<2.5)return RADAR_DATA.levels[0];
    if(s<4.5)return RADAR_DATA.levels[1];
    if(s<6.5)return RADAR_DATA.levels[2];
    if(s<8.3)return RADAR_DATA.levels[3];
    return RADAR_DATA.levels[4];
  }
  function scoresFromAnswers(answers){
    const by={}; RADAR_DATA.dimensions.forEach(d=>by[d.id]=[]);
    RADAR_DATA.questions.forEach((q,i)=>{const v=Number(answers[i]); if(Number.isFinite(v)&&v>=0&&v<=4)by[q[0]].push(v)});
    const dim={};
    RADAR_DATA.dimensions.forEach(d=>{const values=by[d.id]||[]; dim[d.id]=values.length?Math.round(((values.reduce((a,b)=>a+b,0)/values.length)*2.5)*10)/10:0});
    const vals=Object.values(dim);
    const overall=vals.length?Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*10)/10:0;
    return {dimensions:dim,overall};
  }
  function insight(scores){
    const arr=RADAR_DATA.dimensions.map(d=>({d,score:Number(scores.dimensions[d.id]||0)})).sort((a,b)=>b.score-a.score);
    const high=arr.slice(0,2), low=arr.slice(-3).reverse();
    return {high,low,summary:`Sua maior força relativa está em ${high.map(x=>x.d.short.toLowerCase()).join(' e ')}. Os pontos que merecem atenção prioritária aparecem em ${low.map(x=>x.d.short.toLowerCase()).join(', ')}.`};
  }
  function serialize(session){return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(session)))))}
  function deserialize(s){try{return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(s)))))}catch(e){return null}}
  function whatsappUrl(session){
    const num=(window.RADAR_CONFIG&&RADAR_CONFIG.WHATSAPP_NUMBER)||'';
    const focus=session.focusChoice?` O ponto que mais me chamou atenção foi ${session.focusChoice}.`:''; const msg=`Olá, Antonio Cesar. Fiz o Radar de Evolução da minha empresa. ID ${session.id}. Resultado geral: ${fmt(session.scores.overall)}/10 - nível ${session.level.name}. Meus principais pontos de atenção foram ${session.insight.low.slice(0,3).map(x=>x.d.short).join(', ')}.${focus} Gostaria de conversar sobre o resultado.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }
  function fmt(n){return Number(n||0).toFixed(1).replace('.',',')}
  window.RadarCore={KEY,get,set,createId,scoreLevel,scoresFromAnswers,insight,serialize,deserialize,whatsappUrl,fmt};
})();
