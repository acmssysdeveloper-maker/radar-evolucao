window.RadarApi={
  send:async function(payload){
    const endpoint=(window.RADAR_CONFIG&&window.RADAR_CONFIG.API_ENDPOINT)||'';
    if(!endpoint)return{ok:false,mode:'local',error:'API_ENDPOINT não configurado'};
    const body=JSON.stringify(payload);
    try{
      await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body,keepalive:true});
      return{ok:true,mode:'apps-script',acknowledged:false};
    }catch(e){return{ok:false,error:String(e)}}
  },
  event:async function(event){return this.send({action:'saveEvent',event})},
  configured:function(){return !!(((window.RADAR_CONFIG&&window.RADAR_CONFIG.API_ENDPOINT)||'').trim());}
};
