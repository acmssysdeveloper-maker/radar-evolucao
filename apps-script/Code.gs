const SHEET_NAMES = {
  LEADS: 'Leads',
  DIAG: 'Diagnosticos',
  ANSWERS: 'Respostas',
  EVENTS: 'Interacoes',
  EVOLUTION: 'Evolucao',
  CONTEXT: 'Indicadores'
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'context') return json({ok:true, updatedAt:new Date().toISOString(), items:getContext_()});
    if (action === 'health') return json({ok:true, service:'Radar de Evolução',timestamp:new Date().toISOString()});
    return json({ok:true, service:'Radar de Evolução'});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const action = payload.action || '';
    if (action === 'saveDiagnosis') return json(saveDiagnosis_(payload.session));
    if (action === 'saveEvent') return json(saveEvent_(payload.event));
    return json({ok:false,error:'Ação não reconhecida'});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.getActive();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  ensureSheet_(ss, SHEET_NAMES.LEADS, ['Lead_ID','Data_Cadastro','Nome','Empresa','Email','WhatsApp','Cargo','Origem','Consentimento','Ultimo_Contato','Proxima_Acao','Status_Comercial']);
  ensureSheet_(ss, SHEET_NAMES.DIAG, ['Diagnostico_ID','Data','Lead_ID','Indice_Geral','Nivel','Pessoas','Pensamento_Critico','Decisao','Processos','Tecnologia_IA','Dados','Aprendizagem','Inovacao','Principal_Forca','Principal_Atencao','PDF_Gerado','PDF_Baixado','WhatsApp_Acionado','Foco_Interesse']);
  ensureSheet_(ss, SHEET_NAMES.ANSWERS, ['Diagnostico_ID','Data','Lead_ID','Pergunta','Dimensao','Resposta_0a4']);
  ensureSheet_(ss, SHEET_NAMES.EVENTS, ['Data','Diagnostico_ID','Lead_ID','Evento','Detalhe']);
  ensureSheet_(ss, SHEET_NAMES.EVOLUTION, ['Data','Lead_ID','Diagnostico_ID','Empresa','Indice_Geral','Nivel','Pessoas','Pensamento_Critico','Decisao','Processos','Tecnologia_IA','Dados','Aprendizagem','Inovacao']);
  ensureSheet_(ss, SHEET_NAMES.CONTEXT, ['Scope','Value','Title','Detail','Source','URL','Updated_At','Active']);
  return 'Abas preparadas.';
}

function saveDiagnosis_(session) {
  const lock=LockService.getScriptLock();
  lock.waitLock(10000);
  try { return saveDiagnosisUnlocked_(session); } finally { lock.releaseLock(); }
}

function saveDiagnosisUnlocked_(session) {
  if(!session || !session.id) throw new Error('Diagnóstico sem ID.');
  const ss = getSpreadsheet_();
  setup();
  const lead = session.lead || {};
  validateLead_(lead);
  const diagSheet = ss.getSheetByName(SHEET_NAMES.DIAG);
  const existingDiagRow = findDiagRow_(diagSheet, session.id);
  if(existingDiagRow){
    const row = diagSheet.getRange(existingDiagRow,1,1,19).getValues()[0];
    return {ok:true,diagnosticoId:session.id,leadId:String(row[2]||''),existingDiagnosis:true,existingLead:true};
  }

  const now = new Date();
  const leadSheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  const newLeadId = 'LEAD-' + Utilities.getUuid().slice(0,8).toUpperCase();
  const existing = findLead_(leadSheet, lead);
  const finalLeadId = existing || newLeadId;
  if(!existing){
    leadSheet.appendRow([finalLeadId, now, lead.name||'', lead.company||'', lead.email||'', lead.phone||'', lead.role||'', lead.source||'Landing page', 'SIM', now, 'Retorno diagnóstico', 'Novo']);
  } else {
    const row=findLeadRow_(leadSheet, finalLeadId);
    if(row>1){
      leadSheet.getRange(row,3,1,6).setValues([[lead.name||'',lead.company||'',lead.email||'',lead.phone||'',lead.role||'',lead.source||'Landing page']]);
      leadSheet.getRange(row,10).setValue(now);
      leadSheet.getRange(row,11).setValue('Retorno diagnóstico');
    }
  }

  const sc = session.scores || {overall:0,dimensions:{}};
  const dim = sc.dimensions || {};
  const names = session.insight || {high:[],low:[]};
  diagSheet.appendRow([
    session.id, now, finalLeadId, Number(sc.overall||0), session.level ? session.level.name : '',
    Number(dim.humano||0), Number(dim.critico||0), Number(dim.decisao||0), Number(dim.processos||0),
    Number(dim.tecnologia||0), Number(dim.dados||0), Number(dim.aprendizagem||0), Number(dim.inovacao||0),
    names.high && names.high[0] ? names.high[0].d.short : '', names.low && names.low[0] ? names.low[0].d.short : '', 'NÃO','NÃO','NÃO', String(lead.focus||'')
  ]);

  const evolutionSheet=ss.getSheetByName(SHEET_NAMES.EVOLUTION);
  evolutionSheet.appendRow([now,finalLeadId,session.id,lead.company||'',Number(sc.overall||0),session.level ? session.level.name : '',Number(dim.humano||0),Number(dim.critico||0),Number(dim.decisao||0),Number(dim.processos||0),Number(dim.tecnologia||0),Number(dim.dados||0),Number(dim.aprendizagem||0),Number(dim.inovacao||0)]);

  const ansSheet = ss.getSheetByName(SHEET_NAMES.ANSWERS);
  (session.questions||[]).forEach((q,i)=>ansSheet.appendRow([session.id,now,finalLeadId,q.text||('Pergunta '+(i+1)),q.dimension||'',Number(q.value)]));
  const eventSheet = ss.getSheetByName(SHEET_NAMES.EVENTS);
  eventSheet.appendRow([now,session.id,finalLeadId,'diagnostico_concluido','Avaliação concluída']);
  eventSheet.appendRow([now,session.id,finalLeadId,'lead_registrado',existing?'Cadastro vinculado ao lead existente':'Cadastro criado pelo relatório']);
  if(lead.focus) eventSheet.appendRow([now,session.id,finalLeadId,'foco_de_interesse',String(lead.focus)]);
  return {ok:true,diagnosticoId:session.id,leadId:finalLeadId,existingLead:!!existing,existingDiagnosis:false};
}

function saveEvent_(event){
  const ss=getSpreadsheet_(); setup();
  if(!event || !event.type) throw new Error('Evento inválido.');
  let leadId=String(event.leadId||'');
  const diagId=String(event.diagnosticoId||'');
  const diagSheet=ss.getSheetByName(SHEET_NAMES.DIAG);
  if(!leadId && diagId){
    const row=findDiagRow_(diagSheet,diagId);
    if(row) leadId=String(diagSheet.getRange(row,3).getValue()||'');
  }
  const now=new Date(event.at||new Date());
  const sh=ss.getSheetByName(SHEET_NAMES.EVENTS);
  sh.appendRow([now,diagId,leadId,String(event.type),JSON.stringify(event)]);
  if(diagId){
    const row=findDiagRow_(diagSheet,diagId);
    if(row){
      if(event.type==='pdf_imprimir_iniciado') diagSheet.getRange(row,16).setValue('SIM');
      if(event.type==='whatsapp_acionado') diagSheet.getRange(row,18).setValue('SIM');
    }
  }
  if(leadId && (event.type==='whatsapp_acionado' || event.type==='pdf_imprimir_iniciado')){
    const leadSheet=ss.getSheetByName(SHEET_NAMES.LEADS);
    const lr=findLeadRow_(leadSheet,leadId);
    if(lr>1) leadSheet.getRange(lr,10).setValue(now);
  }
  return {ok:true,leadId:leadId};
}

function validateLead_(lead){
  if(String(lead.name||'').trim().length<2) throw new Error('Nome inválido.');
  if(String(lead.company||'').trim().length<2) throw new Error('Empresa/negócio inválido.');
  if(!/^\S+@\S+\.\S+$/.test(String(lead.email||'').trim())) throw new Error('E-mail inválido.');
}

function findDiagRow_(sheet, diagId){
  if(sheet.getLastRow()<2) return 0;
  const values=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
  for(let i=0;i<values.length;i++) if(String(values[i][0])===String(diagId)) return i+2;
  return 0;
}

function findLead_(sheet, lead){
  if(sheet.getLastRow()<2) return '';
  const values=sheet.getDataRange().getValues();
  const email=String(lead.email||'').trim().toLowerCase();
  const phone=String(lead.phone||'').replace(/\D/g,'');
  const company=String(lead.company||'').trim().toLowerCase();
  for(let i=1;i<values.length;i++){
    const row=values[i];
    const rEmail=String(row[4]||'').trim().toLowerCase();
    const rPhone=String(row[5]||'').replace(/\D/g,'');
    const rCompany=String(row[3]||'').trim().toLowerCase();
    if(email && company && rEmail===email && rCompany===company) return String(row[0]);
    if(phone && company && rPhone===phone && rCompany===company) return String(row[0]);
    if(email && !company && rEmail===email) return String(row[0]);
  }
  return '';
}

function findLeadRow_(sheet, leadId){
  const values=sheet.getRange(2,1,Math.max(sheet.getLastRow()-1,0),1).getValues();
  for(let i=0;i<values.length;i++) if(String(values[i][0])===String(leadId)) return i+2;
  return 0;
}

function getContext_(){
  const ss=getSpreadsheet_();
  const sh=ss.getSheetByName(SHEET_NAMES.CONTEXT);
  if(!sh || sh.getLastRow()<2) return [];
  const rows=sh.getRange(2,1,sh.getLastRow()-1,8).getValues();
  return rows.filter(r=>String(r[7]).toUpperCase()!=='NÃO' && String(r[7]).toUpperCase()!=='NAO' && r[2]).map(r=>({scope:r[0],value:r[1],title:r[2],detail:r[3],source:r[4],url:r[5],updatedAt:r[6]}));
}


function getSpreadsheet_(){
  const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if(id) return SpreadsheetApp.openById(id);
  const ss=SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.getActive();
  if(ss) PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

function ensureSheet_(ss,name,headers){
  let sh=ss.getSheetByName(name);
  if(!sh) sh=ss.insertSheet(name);
  if(sh.getLastRow()===0){ sh.appendRow(headers); return sh; }
  const existing=sh.getRange(1,1,1,Math.max(sh.getLastColumn(),headers.length)).getValues()[0].map(x=>String(x||''));
  headers.forEach((h,i)=>{ if(!existing[i]) sh.getRange(1,i+1).setValue(h); });
  return sh;
}
function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
