(function(){
  function endpoint(){return (window.RADAR_CONFIG&&RADAR_CONFIG.API_ENDPOINT||'').trim()}
  function wait(ms){return new Promise(r=>setTimeout(r,ms))}
  function jsonp(params, timeoutMs=7000){
    return new Promise((resolve,reject)=>{
      const ep=endpoint();
      if(!ep)return reject(new Error('API_ENDPOINT não configurado'));
      const cb='__radar_cb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
      const script=document.createElement('script');
      const cleanup=()=>{delete window[cb];script.remove()};
      const timer=setTimeout(()=>{cleanup();reject(new Error('Tempo limite ao consultar o CRM.'))},timeoutMs);
      window[cb]=(data)=>{clearTimeout(timer);cleanup();resolve(data)};
      const url=new URL(ep);
      Object.entries(params||{}).forEach(([k,v])=>url.searchParams.set(k,String(v)));
      url.searchParams.set('callback',cb);
      url.searchParams.set('_',String(Date.now()));
      script.src=url.toString();
      script.async=true;
      script.onerror=()=>{clearTimeout(timer);cleanup();reject(new Error('Não foi possível consultar o CRM.'))};
      document.head.appendChild(script);
    });
  }
  async function post(payload){
    const ep=endpoint();
    if(!ep)return{ok:false,mode:'local',error:'API_ENDPOINT não configurado'};
    try{
      await fetch(ep,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),keepalive:true});
      return{ok:true,submitted:true,acknowledged:false};
    }catch(e){return{ok:false,error:String(e)}}
  }
  async function sendDiagnosis(payload){
    const diagId=payload&&payload.session&&payload.session.id;
    const sent=await post(payload);
    if(!sent.ok)return sent;
    if(!diagId)return{ok:false,error:'Diagnóstico sem ID para confirmação.'};
    for(let attempt=0;attempt<4;attempt++){
      await wait(attempt===0?900:1400);
      try{
        const check=await jsonp({action:'diagnosisStatus',diagnosticoId:diagId});
        if(check&&check.ok&&check.found) return{ok:true,confirmed:true,leadId:check.leadId||'',diagnosticoId:diagId,existingLead:!!check.existingLead};
      }catch(e){}
    }
    return{ok:false,submitted:true,unconfirmed:true,error:'O envio foi realizado, mas o CRM não confirmou o registro a tempo. Você pode tentar novamente sem duplicar o diagnóstico.'};
  }
  async function event(event){
    const eventId=(event&&event.id)||('EVT-'+Date.now()+'-'+Math.random().toString(36).slice(2,8).toUpperCase());
    const payload={action:'saveEvent',event:Object.assign({},event,{id:eventId})};
    const sent=await post(payload);
    if(!sent.ok)return sent;
    for(let attempt=0;attempt<3;attempt++){
      await wait(attempt===0?500:900);
      try{const check=await jsonp({action:'eventStatus',eventId});if(check&&check.ok&&check.found)return{ok:true,confirmed:true,eventId}}catch(e){}
    }
    return{ok:false,submitted:true,unconfirmed:true,eventId,error:'Evento enviado sem confirmação.'};
  }
  window.RadarApi={
    send:post,
    sendDiagnosis,
    event,
    configured:()=>!!endpoint()
  };
})();
