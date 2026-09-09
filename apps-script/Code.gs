const TZ='America/Sao_Paulo';
const SHEET_NAMES = {
  LEADS: 'Leads', DIAG: 'Diagnosticos', ANSWERS: 'Respostas', EVENTS: 'Interacoes',
  EVOLUTION: 'Evolucao', CONTEXT: 'Indicadores'
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'context') return response_(e, {ok:true, updatedAt:formatDate_(new Date(),'dd/MM/yyyy HH:mm:ss'), items:getContext_()});
    if (action === 'health') return response_(e, {ok:true, service:'Radar de Evolução', timestamp:formatDate_(new Date(),'dd/MM/yyyy HH:mm:ss'), timezone:TZ});
    if (action === 'diagnosisStatus') return response_(e, diagnosisStatus_(String(e.parameter.diagnosticoId||'')));
    if (action === 'eventStatus') return response_(e, eventStatus_(String(e.parameter.eventId||'')));
    return response_(e, {ok:true, service:'Radar de Evolução'});
  } catch (err) { return response_(e, {ok:false,error:String(err)}); }
}

function doPost(e) {
  try {
    const raw=(e&&e.postData&&e.postData.contents)||'{}';
    if(raw.length>500000) throw new Error('Payload excede o limite permitido.');
    const payload=JSON.parse(raw);
    const action=payload.action||'';
    if(action==='saveDiagnosis') return json(saveDiagnosis_(payload.session));
    if(action==='saveEvent') return json(saveEvent_(payload.event));
    return json({ok:false,error:'Ação não reconhecida'});
  } catch(err){return json({ok:false,error:String(err)});}
}

function setup(){
  const ss=getSpreadsheet_();
  ss.setSpreadsheetTimeZone(TZ);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());
  ensureSheet_(ss,SHEET_NAMES.LEADS,['Lead_ID','Data_Cadastro','Nome','Empresa','Email','WhatsApp','Cargo','Origem','Consentimento','Ultimo_Contato','Proxima_Acao','Status_Comercial']);
  ensureSheet_(ss,SHEET_NAMES.DIAG,['Diagnostico_ID','Data','Lead_ID','Indice_Geral','Nivel','Pessoas','Pensamento_Critico','Decisao','Processos','Tecnologia_IA','Dados','Aprendizagem','Inovacao','Principal_Forca','Principal_Atencao','PDF_Gerado','PDF_Baixado','WhatsApp_Acionado','Foco_Interesse']);
  ensureSheet_(ss,SHEET_NAMES.ANSWERS,['Diagnostico_ID','Data','Lead_ID','Pergunta','Dimensao','Resposta_0a4']);
  ensureSheet_(ss,SHEET_NAMES.EVENTS,['Data','Diagnostico_ID','Lead_ID','Evento','Detalhe','Evento_ID']);
  ensureSheet_(ss,SHEET_NAMES.EVOLUTION,['Data','Lead_ID','Diagnostico_ID','Empresa','Indice_Geral','Nivel','Pessoas','Pensamento_Critico','Decisao','Processos','Tecnologia_IA','Dados','Aprendizagem','Inovacao']);
  ensureSheet_(ss,SHEET_NAMES.CONTEXT,['Scope','Value','Title','Detail','Source','URL','Updated_At','Active']);
  formatSheets_(ss);
  return 'Abas preparadas e fuso definido como '+TZ+'.';
}

function saveDiagnosis_(session){
  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try{return saveDiagnosisUnlocked_(session);}finally{lock.releaseLock();}
}
function saveDiagnosisUnlocked_(session){
  if(!session||!session.id) throw new Error('Diagnóstico sem ID.');
  const ss=getSpreadsheet_(); setup();
  const lead=session.lead||{}; validateLead_(lead);
  const diagSheet=ss.getSheetByName(SHEET_NAMES.DIAG);
  const existingDiagRow=findDiagRow_(diagSheet,session.id);
  if(existingDiagRow){const row=diagSheet.getRange(existingDiagRow,1,1,19).getValues()[0]; return {ok:true,diagnosticoId:session.id,leadId:String(row[2]||''),existingDiagnosis:true,existingLead:true};}
  const now=new Date(); const leadSheet=ss.getSheetByName(SHEET_NAMES.LEADS);
  const newLeadId='LEAD-'+Utilities.getUuid().slice(0,8).toUpperCase();
  const existing=findLead_(leadSheet,lead); const finalLeadId=existing||newLeadId;
  if(!existing){
    leadSheet.appendRow([finalLeadId,now,safe_(lead.name,120),safe_(lead.company,160),safe_(lead.email,180),safe_(lead.phone,40),safe_(lead.role,120),safe_(lead.source,60),'SIM',now,'Retorno diagnóstico','Novo']);
  }else{
    const row=findLeadRow_(leadSheet,finalLeadId); if(row>1){
      leadSheet.getRange(row,3,1,6).setValues([[safe_(lead.name,120),safe_(lead.company,160),safe_(lead.email,180),safe_(lead.phone,40),safe_(lead.role,120),safe_(lead.source,60)]]);
      leadSheet.getRange(row,10).setValue(now); leadSheet.getRange(row,11).setValue('Retorno diagnóstico');
    }
  }
  const ans=session.questions||[]; const ansSheet=ss.getSheetByName(SHEET_NAMES.ANSWERS); if(ans.length!==24) throw new Error('Diagnóstico incompleto: respostas não totalizam 24.');
  const calc=recalculateScores_(ans); const sc=calc.scores; const dim=sc.dimensions; const names=buildInsight_(dim);
  diagSheet.appendRow([session.id,now,finalLeadId,sc.overall,calc.level.name,dim.humano,dim.critico,dim.decisao,dim.processos,dim.tecnologia,dim.dados,dim.aprendizagem,dim.inovacao,names.high[0].d.short,names.low[0].d.short,'NÃO','NÃO','NÃO',safe_(lead.focus,120)]);
  ss.getSheetByName(SHEET_NAMES.EVOLUTION).appendRow([now,finalLeadId,session.id,safe_(lead.company,160),sc.overall,calc.level.name,dim.humano,dim.critico,dim.decisao,dim.processos,dim.tecnologia,dim.dados,dim.aprendizagem,dim.inovacao]);
  ans.forEach(q=>ansSheet.appendRow([session.id,now,finalLeadId,safe_(q.text,500),safe_(q.dimension,120),Number(q.value)]));
  const ev=ss.getSheetByName(SHEET_NAMES.EVENTS);
  appendEvent_(ev,session.id,finalLeadId,'diagnostico_concluido','Avaliação concluída');
  appendEvent_(ev,session.id,finalLeadId,'lead_registrado',existing?'Cadastro vinculado ao lead existente':'Cadastro criado pelo relatório');
  if(lead.focus) appendEvent_(ev,session.id,finalLeadId,'foco_de_interesse',safe_(lead.focus,120));
  return {ok:true,diagnosticoId:session.id,leadId:finalLeadId,existingLead:!!existing,existingDiagnosis:false};
}

function saveEvent_(event){
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    if(!event||!event.type) throw new Error('Evento inválido.');
    const ss=getSpreadsheet_(); setup(); const sh=ss.getSheetByName(SHEET_NAMES.EVENTS);
    const eventId=safe_(event.id,80)||('EVT-'+Utilities.getUuid());
    if(findEventRow_(sh,eventId)) return {ok:true,eventId:eventId,duplicate:true};
    let leadId=String(event.leadId||''); const diagId=String(event.diagnosticoId||'');
    if(!leadId&&diagId){const row=findDiagRow_(ss.getSheetByName(SHEET_NAMES.DIAG),diagId);if(row)leadId=String(ss.getSheetByName(SHEET_NAMES.DIAG).getRange(row,3).getValue()||'');}
    appendEvent_(sh,diagId,leadId,String(event.type),JSON.stringify(event),eventId);
    if(diagId){const ds=ss.getSheetByName(SHEET_NAMES.DIAG),row=findDiagRow_(ds,diagId);if(row){if(event.type==='pdf_imprimir_iniciado')ds.getRange(row,16).setValue('SIM');if(event.type==='whatsapp_acionado')ds.getRange(row,18).setValue('SIM');if(event.type==='pdf_relatorio_liberado')ds.getRange(row,17).setValue('SIM');}} 
    if(leadId&&(event.type==='whatsapp_acionado'||event.type==='pdf_imprimir_iniciado')){const ls=ss.getSheetByName(SHEET_NAMES.LEADS),lr=findLeadRow_(ls,leadId);if(lr>1)ls.getRange(lr,10).setValue(new Date());}
    return {ok:true,eventId:eventId,leadId:leadId};
  }finally{lock.releaseLock();}
}

function appendEvent_(sh,diagId,leadId,type,detail,eventId){sh.appendRow([new Date(),diagId,leadId,type,detail,eventId||('EVT-'+Utilities.getUuid())]);}
function diagnosisStatus_(diagId){if(!diagId)return {ok:false,found:false};const sh=getSpreadsheet_().getSheetByName(SHEET_NAMES.DIAG);const row=findDiagRow_(sh,diagId);if(!row)return {ok:true,found:false,diagnosticoId:diagId};return {ok:true,found:true,diagnosticoId:diagId,leadId:String(sh.getRange(row,3).getValue()||''),existingLead:true};}
function eventStatus_(eventId){if(!eventId)return {ok:false,found:false};const sh=getSpreadsheet_().getSheetByName(SHEET_NAMES.EVENTS);const row=findEventRow_(sh,eventId);return {ok:true,found:!!row,eventId:eventId};}

function recalculateScores_(questions){
  const allowed={
    'Desenvolvimento humano':'humano','Pensamento crítico':'critico','Capacidade de decisão':'decisao','Processos e melhoria':'processos','Tecnologia e IA':'tecnologia','Dados e inteligência':'dados','Aprendizagem e adaptação':'aprendizagem','Inovação e evolução':'inovacao'
  };
  const by={}; Object.values(allowed).forEach(k=>by[k]=[]);
  questions.forEach(q=>{
    const key=allowed[String(q.dimension||'')]; const v=Number(q.value);
    if(!key || !Number.isInteger(v) || v<0 || v>4) throw new Error('Resposta inválida no diagnóstico.');
    by[key].push(v);
  });
  Object.keys(by).forEach(k=>{if(by[k].length!==3)throw new Error('Cada dimensão deve conter exatamente 3 respostas.');});
  const dim={}; Object.keys(by).forEach(k=>{const avg=by[k].reduce((a,b)=>a+b,0)/3;dim[k]=Math.round(avg*2.5*10)/10;});
  const overall=Math.round((Object.values(dim).reduce((a,b)=>a+b,0)/8)*10)/10;
  return {scores:{dimensions:dim,overall:overall},level:scoreLevelServer_(overall)};
}
function scoreLevelServer_(s){if(s<2.5)return {name:'Reativo'};if(s<4.5)return {name:'Organizado'};if(s<6.5)return {name:'Estruturado'};if(s<8.3)return {name:'Adaptativo'};return {name:'Evolutivo'};}
function buildInsight_(dim){const defs=[['humano','Pessoas'],['critico','Pensamento'],['decisao','Decisão'],['processos','Processos'],['tecnologia','Tecnologia'],['dados','Dados'],['aprendizagem','Aprendizagem'],['inovacao','Inovação']].map(x=>({d:{id:x[0],short:x[1]},score:Number(dim[x[0]]||0)})).sort((a,b)=>b.score-a.score);return {high:defs.slice(0,2),low:defs.slice(-3).reverse()};}

function validateLead_(lead){
  if(lead.consent!==true) throw new Error('Consentimento não informado.');
  if(String(lead.name||'').trim().length<2) throw new Error('Nome inválido.');
  if(String(lead.company||'').trim().length<2) throw new Error('Empresa/negócio inválido.');
  if(!/^\S+@\S+\.\S+$/.test(String(lead.email||'').trim())) throw new Error('E-mail inválido.');
}
function safe_(v,max){let s=String(v==null?'':v).trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');return s.slice(0,max);}
function findDiagRow_(sheet,diagId){if(!sheet||sheet.getLastRow()<2)return 0;const vals=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();for(let i=0;i<vals.length;i++)if(String(vals[i][0])===String(diagId))return i+2;return 0;}
function findEventRow_(sheet,eventId){if(!sheet||sheet.getLastRow()<2)return 0;const col=sheet.getLastColumn()>=6?6:5;const vals=sheet.getRange(2,col,sheet.getLastRow()-1,1).getValues();for(let i=0;i<vals.length;i++)if(String(vals[i][0])===String(eventId))return i+2;return 0;}
function findLead_(sheet,lead){if(sheet.getLastRow()<2)return '';const values=sheet.getDataRange().getValues();const email=String(lead.email||'').trim().toLowerCase();const phone=String(lead.phone||'').replace(/\D/g,'');const company=String(lead.company||'').trim().toLowerCase();for(let i=1;i<values.length;i++){const row=values[i];const rEmail=String(row[4]||'').trim().toLowerCase();const rPhone=String(row[5]||'').replace(/\D/g,'');const rCompany=String(row[3]||'').trim().toLowerCase();if(email&&company&&rEmail===email&&rCompany===company)return String(row[0]);if(phone&&company&&rPhone===phone&&rCompany===company)return String(row[0]);}return '';}
function findLeadRow_(sheet,leadId){if(sheet.getLastRow()<2)return 0;const values=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();for(let i=0;i<values.length;i++)if(String(values[i][0])===String(leadId))return i+2;return 0;}
function getContext_(){const ss=getSpreadsheet_(),sh=ss.getSheetByName(SHEET_NAMES.CONTEXT);if(!sh||sh.getLastRow()<2)return[];const rows=sh.getRange(2,1,sh.getLastRow()-1,8).getValues();return rows.filter(r=>String(r[7]).toUpperCase()!=='NÃO'&&String(r[7]).toUpperCase()!=='NAO'&&r[2]).map(r=>({scope:r[0],value:r[1],title:r[2],detail:r[3],source:r[4],url:r[5],updatedAt:r[6]}));}
function getSpreadsheet_(){const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');if(id)return SpreadsheetApp.openById(id);const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw new Error('Planilha não configurada. Execute setup() na planilha do CRM.');PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());return ss;}
function ensureSheet_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);if(sh.getLastRow()===0){sh.appendRow(headers);return sh;}const existing=sh.getRange(1,1,1,Math.max(sh.getLastColumn(),headers.length)).getValues()[0].map(x=>String(x||''));headers.forEach((h,i)=>{if(!existing[i])sh.getRange(1,i+1).setValue(h);});return sh;}
function formatSheets_(ss){[['Leads','B:B'],['Diagnosticos','B:B'],['Respostas','B:B'],['Interacoes','A:A'],['Evolucao','A:A']].forEach(([n,col])=>{const sh=ss.getSheetByName(n);if(sh)sh.getRange(col).setNumberFormat('dd/MM/yyyy HH:mm:ss');});}
function formatDate_(date,pattern){return Utilities.formatDate(date,TZ,pattern);}
function response_(e,obj){const cb=e&&e.parameter&&e.parameter.callback;if(cb&&/^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(cb))return ContentService.createTextOutput(cb+'('+JSON.stringify(obj)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);return json(obj);}
function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
