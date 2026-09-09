window.RADAR_CONTEXT = {
  updatedAt: '09/09/2026',
  intro: 'O cenário muda rápido. Estes dados existem para colocar o diagnóstico em contexto — não para fabricar urgência.',
  sources: [
    {scope:'Mundo', title:'63% dos empregadores apontam lacunas de competências como principal barreira à transformação', value:'63%', detail:'O World Economic Forum também projeta mudança em quase 40% das competências essenciais até 2030.', source:'World Economic Forum — Future of Jobs Report 2025', url:'https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/'},
    {scope:'Mundo', title:'77% dos empregadores planejam qualificar trabalhadores em resposta à IA', value:'77%', detail:'A resposta mais comum à transformação tecnológica é o upskilling, segundo o levantamento do WEF.', source:'World Economic Forum — Future of Jobs Report 2025', url:'https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/'},
    {scope:'Mundo', title:'Mais de 1 em cada 3 jovens trabalhadores está em ocupações com exposição média ou alta à mudança de tarefas por IA', value:'>1/3', detail:'O WEF destaca o impacto crescente da IA nas trajetórias de entrada e desenvolvimento profissional.', source:'World Economic Forum — AI and the Future of Entry-Level Work, 2026', url:'https://www.weforum.org/publications/artificial-intelligence-and-the-future-of-entry-level-work-a-framework-for-safeguarding-and-reinventing-early-career-pathways/'},
    {scope:'Brasil', title:'Quase 9 em cada 10 empresas pretendem desenvolver competências da força de trabalho', value:'≈90%', detail:'No Brasil, empresas pesquisadas pelo WEF apontaram o desenvolvimento de talentos como resposta à mudança do mercado.', source:'World Economic Forum — Future of Jobs Report 2025, recorte Brasil', url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/5-region-economy-and-industry-insights/'},
    {scope:'Brasil', title:'59,2% das empresas industriais utilizam apenas uma ou duas tecnologias digitais', value:'59,2%', detail:'A CNI aponta baixa intensidade de digitalização como um dos desafios da indústria brasileira.', source:'CNI — Inovação para impulsionar a competitividade industrial no Brasil, 2025/2026', url:'https://www.cni.portaldaindustria.com.br/atuacao/inovacao'},
    {scope:'Brasil', title:'47,6% das empresas brasileiras relatam dificuldades para inovar', value:'47,6%', detail:'O dado reforça que adquirir tecnologia não é o mesmo que transformar capacidade de inovação em prática.', source:'CNI — Inovação para impulsionar a competitividade industrial no Brasil', url:'https://www.cni.portaldaindustria.com.br/atuacao/inovacao'},
    {scope:'Brasil', title:'61% das indústrias inovaram nos últimos três anos', value:'61%', detail:'Entre as que inovaram, 38% apontaram aumento de produtividade como principal resultado; 69% concentraram esforços em melhoria de processos.', source:'CNI — Pesquisa de inovação, 25/03/2026', url:'https://noticias.portaldaindustria.com.br/noticias/inovacao-e-tecnologia/61-das-industrias-no-brasil-inovaram-nos-ultimos-3-anos-revela-cni/'},
    {scope:'Brasil', title:'74% das empresas industriais investiram em máquinas novas em 2025, mas robotização foi alvo principal para apenas 9%', value:'74% / 9%', detail:'A CNI mostra que renovação de equipamentos não significa, automaticamente, transformação tecnológica profunda.', source:'CNI — Sondagem Especial nº 105, 05/08/2026', url:'https://imprensa.portaldaindustria.com.br/posicionamentos/cni-industria-compra-maquinas-novas-mas-investimento-em-automatizacao-segue-baixo/'}
  ]
};

(function(){
  function esc(x){return String(x).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[c]));}
  function render(target, items){
    if(!target) return;
    const selected = items.slice(0,6);
    target.innerHTML = `<div class="context-head"><div><div class="eyebrow">Cenário em contexto</div><h2>O problema não é apenas acompanhar a mudança. É conseguir transformar mudança em capacidade.</h2><p>${esc(window.RADAR_CONTEXT.intro)}</p></div><div class="context-update">Atualizado em<br><strong>${esc(window.RADAR_CONTEXT.updatedAt)}</strong></div></div>
      <div class="context-grid">${selected.map((d,i)=>`<article class="context-card"><div class="context-scope">${esc(d.scope)}</div><div class="context-value">${esc(d.value)}</div><h3>${esc(d.title)}</h3><p>${esc(d.detail)}</p><a href="${esc(d.url)}" target="_blank" rel="noopener">Fonte: ${esc(d.source)}</a></article>`).join('')}</div>
      <details class="context-more"><summary>Ver mais dados do contexto</summary><div class="context-more-grid">${items.slice(6).map(d=>`<article class="context-card compact"><div class="context-scope">${esc(d.scope)}</div><div class="context-value">${esc(d.value)}</div><h3>${esc(d.title)}</h3><p>${esc(d.detail)}</p><a href="${esc(d.url)}" target="_blank" rel="noopener">Fonte: ${esc(d.source)}</a></article>`).join('')}</div><p class="context-note">Os dados acima são indicadores de contexto. Eles não determinam, sozinhos, que uma empresa precise contratar consultoria. A decisão deve partir do diagnóstico da realidade da própria organização.</p></details>`;
  }
  async function init(){
    const targets=document.querySelectorAll('[data-context-panel]');
    if(!targets.length) return;
    let data=window.RADAR_CONTEXT.sources;
    const endpoint=window.RADAR_CONFIG&&RADAR_CONFIG.CONTEXT_ENDPOINT;
    if(endpoint){try{const r=await fetch(endpoint+'?action=context',{cache:'no-store'});const j=await r.json();if(j&&j.ok&&Array.isArray(j.items))data=j.items}catch(e){}}
    targets.forEach(t=>render(t,data));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
