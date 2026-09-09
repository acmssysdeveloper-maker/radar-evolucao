const SHEET_NAMES = {
  LEADS: 'Leads',
  DIAG: 'Diagnosticos',
  ANSWERS: 'Respostas',
  EVENTS: 'Interacoes',
  CONTEXT: 'Indicadores'
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'context') return json({ok:true, updatedAt:new Date().toISOString(), items:getContext_()});
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
    return json({ok:false,error:'Ação não reconhecida'});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, SHEET_NAMES.LEADS, ['Lead_ID','Data_Cadastro','Nome','Empresa','Email','WhatsApp','Cargo','Origem','Consentimento','Ultimo_Contato','Proxima_Acao','Status_Comercial']);
  ensureSheet_(ss, SHEET_NAMES.DIAG, ['Diagnostico_ID','Data','Lead_ID','Indice_Geral','Nivel','Pessoas','Pensamento_Critico','Decisao','Processos','Tecnologia_IA','Dados','Aprendizagem','Inovacao','Principal_Forca','Principal_Atencao','PDF_Gerado','PDF_Baixado','WhatsApp_Acionado']);
  ensureSheet_(ss, SHEET_NAMES.ANSWERS, ['Diagnostico_ID','Data','Lead_ID','Pergunta','Dimensao','Resposta_0a4']);
  ensureSheet_(ss, SHEET_NAMES.EVENTS, ['Data','Diagnostico_ID','Lead_ID','Evento','Detalhe']);
  ensureSheet_(ss, SHEET_NAMES.CONTEXT, ['Scope','Value','Title','Detail','Source','URL','Updated_At','Active']);
  return 'Abas preparadas.';
}

function saveDiagnosis_(session) {
  const ss = SpreadsheetApp.getActive();
  setup();
  const diagId = session.id || Utilities.getUuid();
  const lead = session.lead || {};
  const leadId = 'LEAD-' + Utilities.getUuid().slice(0,8).toUpperCase();
  const now = new Date();
  const leadSheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  leadSheet.appendRow([leadId, now, lead.name||'', lead.company||'', lead.email||'', lead.phone||'', lead.role||'', lead.source||'Landing page', 'SIM', '', 'Retorno diagnóstico', 'Novo']);

  const sc = session.scores || {overall:0,dimensions:{}};
  const dim = sc.dimensions || {};
  const names = session.insight || {high:[],low:[]};
  const diagSheet = ss.getSheetByName(SHEET_NAMES.DIAG);
  diagSheet.appendRow([diagId, now, leadId, sc.overall||0, session.level ? session.level.name : '', dim.humano||0, dim.critico||0, dim.decisao||0, dim.processos||0, dim.tecnologia||0, dim.dados||0, dim.aprendizagem||0, dim.inovacao||0, names.high && names.high[0] ? names.high[0].d.short : '', names.low && names.low[0] ? names.low[0].d.short : '', 'NÃO', 'NÃO', 'NÃO']);

  const ansSheet = ss.getSheetByName(SHEET_NAMES.ANSWERS);
  (session.answers||[]).forEach((answer, i)=>{
    const q = (session.questions || [])[i] || {};
    const question = q.text || 'Pergunta '+(i+1);
    const dimName = q.dimension || '';
    ansSheet.appendRow([diagId, now, leadId, question, dimName, Number(answer)]);
  });

  const eventSheet = ss.getSheetByName(SHEET_NAMES.EVENTS);
  (session.events||[]).forEach(ev=>eventSheet.appendRow([new Date(ev.at||now),diagId,leadId,ev.type||'',JSON.stringify(ev)]));
  eventSheet.appendRow([now,diagId,leadId,'lead_registrado','Cadastro realizado pelo relatório']);
  return {ok:true,diagnosticoId:diagId,leadId:leadId};
}

function getContext_(){
  const ss=SpreadsheetApp.getActive();
  const sh=ss.getSheetByName(SHEET_NAMES.CONTEXT);
  if(!sh || sh.getLastRow()<2) return [];
  const rows=sh.getRange(2,1,sh.getLastRow()-1,8).getValues();
  return rows.filter(r=>String(r[7]).toUpperCase()!=='NÃO' && String(r[7]).toUpperCase()!=='NAO' && r[2]).map(r=>({scope:r[0],value:r[1],title:r[2],detail:r[3],source:r[4],url:r[5],updatedAt:r[6]}));
}

function ensureSheet_(ss,name,headers){
  let sh=ss.getSheetByName(name);
  if(!sh) sh=ss.insertSheet(name);
  if(sh.getLastRow()===0) sh.appendRow(headers);
  return sh;
}
function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
