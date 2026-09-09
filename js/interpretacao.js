(function(){
  const ORDER = ['humano','critico','decisao','processos','tecnologia','dados','aprendizagem','inovacao'];
  const SECONDARY_PRIORITY = ['critico','processos','dados','decisao','tecnologia','aprendizagem','inovacao'];
  const BAN = ['silenc','sussurr','horizonte','mágic','magico','revolucionário','revolucionario'];

  function num(v){ const n=Number(v); return Number.isFinite(n)?Math.max(0,Math.min(10,n)):0; }
  function fmt(v){ return (window.RadarCore&&RadarCore.fmt)?RadarCore.fmt(v):(num(v).toFixed(1).replace('.',',')); }
  function dimMap(scores){
    return ORDER.reduce((acc,id)=>{ acc[id]=num(scores&&scores.dimensions&&scores.dimensions[id]); return acc; },{});
  }
  function items(scores){
    const m=dimMap(scores);
    return RADAR_DATA.dimensions.map(d=>({d,score:m[d.id]}));
  }
  function byId(scores,id){ return dimMap(scores)[id]; }
  function minBy(ids,m){ return ids.slice().sort((a,b)=>m[a]-m[b])[0]; }
  function label(id){
    const d=RADAR_DATA.dimensions.find(x=>x.id===id); return d?d.name.toLowerCase():id;
  }
  function pattern(scores){
    const m=dimMap(scores);
    if(m.humano<4.5 && m.processos<4.5) return 'Base humana e operacional a fortalecer';
    if(m.humano<5.5 && m.aprendizagem>=6.5) return 'Aprendizagem maior que autonomia';
    if(m.critico<5.5 && m.decisao>=6.5) return 'Decisão à frente do pensamento crítico';
    if(m.tecnologia>=6.5 && m.dados<5.5) return 'Tecnologia à frente dos dados';
    if(m.dados<5.5 && m.processos<5.5) return 'Dados ainda pouco incorporados ao processo';
    if(m.aprendizagem>=6.5 && m.inovacao<5.5) return 'Aprendizagem maior que experimentação';
    const spread=Math.max.apply(null,ORDER.map(id=>m[id]))-Math.min.apply(null,ORDER.map(id=>m[id]));
    if(spread<=1.5) return 'Capacidades relativamente equilibradas';
    return 'Capacidades em estágios diferentes';
  }
  function humanParagraph(m){
    if(m.humano<4.5){
      return `O primeiro olhar recai sobre o desenvolvimento humano. Com ${fmt(m.humano)}, as respostas sugerem uma base que merece atenção antes de ampliar mudanças em outras frentes. Vale observar quanto da autonomia, do conhecimento e da capacidade de resolver problemas está de fato nas pessoas e quanto ainda depende de orientação ou de indivíduos específicos.`;
    }
    if(m.humano<6.5){
      return `O desenvolvimento humano aparece em ${fmt(m.humano)}, indicando uma base intermediária. Antes de ampliar ferramentas ou exigir mais velocidade, vale observar como o conhecimento está sendo transformado em autonomia, responsabilidade e capacidade de resolver problemas no trabalho real.`;
    }
    return `O desenvolvimento humano aparece como uma das bases mais favoráveis, com ${fmt(m.humano)}. Isso cria uma condição importante para a evolução: pessoas com maior autonomia e capacidade de aprendizagem tendem a sustentar melhor as mudanças nas demais dimensões.`;
  }
  function relationParagraphs(m){
    const p=[];
    if(m.humano<6.5 && m.processos<6.5){
      p.push(`Pessoas e processos aparecem abaixo das capacidades de decisão, tecnologia e aprendizagem. Essa combinação merece ser observada porque o conhecimento pode até existir, mas ainda não estar convertido em uma forma de trabalho suficientemente consistente e compartilhada.`);
    }
    if(m.humano<5.5 && m.aprendizagem>=6.5){
      p.push(`A aprendizagem aparece mais forte que o desenvolvimento humano. Uma hipótese a investigar é se a organização aprende com as situações, mas ainda encontra dificuldade para transformar esse aprendizado em autonomia das pessoas e continuidade da prática.`);
    }
    if(m.critico<5.5 && m.decisao>=6.5){
      p.push(`A capacidade de decisão aparece acima do pensamento crítico. Isso não indica, por si só, um problema de decisão; indica apenas que vale verificar se a velocidade de decidir está acompanhada de tempo suficiente para questionar causas, evidências e premissas.`);
    }
    if(m.tecnologia>=6.5 && m.dados<5.5){
      p.push(`Tecnologia e IA aparecem mais fortes que dados e inteligência. Vale verificar se as ferramentas estão realmente ajudando a transformar informação em análise e decisão, ou se parte do potencial tecnológico ainda não chegou à rotina de gestão.`);
    }
    if(m.dados<5.5 && m.processos<5.5){
      p.push(`Dados e processos aparecem juntos entre os pontos mais baixos. Nesse cenário, um bom começo é aproximar indicador, investigação e ação: o número precisa ajudar a enxergar o desvio e o processo precisa registrar o aprendizado da correção.`);
    }
    if(m.aprendizagem>=6.5 && m.inovacao<5.5){
      p.push(`Aprendizagem e adaptação aparecem acima da inovação e evolução. A leitura possível é que a empresa percebe capacidade de se ajustar, mas ainda pode ganhar método para testar novas formas de trabalhar antes de fazer mudanças maiores.`);
    }
    if(m.processos>=6.5 && m.inovacao<5.5){
      p.push(`Processos aparecem mais fortes que inovação. Isso pode representar uma boa capacidade de manter a operação estável, acompanhada de menor espaço percebido para experimentar novas formas de trabalhar.`);
    }
    return p;
  }
  function priorityIds(m){
    const ids=['humano'];
    SECONDARY_PRIORITY.slice().sort((a,b)=>m[a]-m[b]).forEach(id=>{
      if(ids.length>=3)return;
      if(m[id]<6.0 && !ids.includes(id)) ids.push(id);
    });
    if(ids.length<3){
      SECONDARY_PRIORITY.slice().sort((a,b)=>m[a]-m[b]).forEach(id=>{
        if(ids.length>=3)return;
        if(!ids.includes(id)) ids.push(id);
      });
    }
    return ids.slice(0,3);
  }
  function nextStep(m, priorities){
    const first=priorities[0];
    if(first==='humano'){
      return `Comece pelas pessoas: escolha um ponto concreto de autonomia ou conhecimento que precisa melhorar e observe como ele aparece na rotina. Depois conecte esse avanço aos processos e aos dados que acompanham o trabalho.`;
    }
    if(first==='processos') return `Comece pelo processo que mais depende de improviso ou correção recorrente. Torne o padrão observável, acompanhe o indicador e registre o que mudou.`;
    if(first==='critico') return `Comece pela qualidade da análise: para um problema relevante, deixe explícitos causa, evidências e premissas antes de decidir a ação.`;
    if(first==='dados') return `Comece pelos indicadores que já existem. Escolha poucos números relevantes e estabeleça como cada desvio será investigado e transformado em ação.`;
    if(first==='decisao') return `Comece pela clareza de responsabilidade: quem conhece o problema, quais evidências sustentam a decisão e como a decisão será acompanhada depois.`;
    if(first==='tecnologia') return `Comece por um trabalho repetitivo ou uma decisão que possa ganhar qualidade com tecnologia. Só avance depois de deixar claro qual problema humano ou operacional a ferramenta resolve.`;
    if(first==='aprendizagem') return `Comece transformando erro e desvio em aprendizado incorporado: o que mudou no método, no treinamento ou no padrão depois de uma ocorrência?`;
    if(first==='inovacao') return `Comece por um pequeno experimento. Defina o que deseja aprender, teste em escala controlada e registre a evidência antes de ampliar.`;
    return 'Escolha uma prioridade concreta, transforme-a em ação observável e defina como a evolução será acompanhada.';
  }
  function analyze(scores){
    const m=dimMap(scores);
    const all=items(scores).sort((a,b)=>b.score-a.score);
    const highest=all.slice(0,2);
    const priorities=priorityIds(m);
    const rel=relationParagraphs(m);
    const reading=[humanParagraph(m)].concat(rel.slice(0,2));
    if(reading.length<2){
      reading.push(`O restante do radar mostra ${highest[0].d.short.toLowerCase()} e ${highest[1].d.short.toLowerCase()} como capacidades relativamente mais presentes. O ponto central é entender como essas forças podem ajudar a desenvolver as dimensões que ainda apresentam menor presença.`);
    }
    const focused=priorities.map(id=>({id,name:label(id),score:m[id]}));
    const firstSecondary=focused.find(x=>x.id!=='humano');
    const firstText=m.humano<6.5
      ? 'Comece pelas pessoas e observe como autonomia, conhecimento e responsabilidade aparecem no trabalho real.'
      : `Mantenha a base humana como referência. O próximo olhar pode ser direcionado a ${firstSecondary?label(firstSecondary.id):'uma prioridade concreta'}, sem perder a conexão com as pessoas que executam o trabalho.`;
    const compact=`${humanParagraph(m)} ${rel[0]||'As demais dimensões devem ser lidas em conjunto, observando como uma capacidade sustenta ou limita outra.'}`;
    const priorityText=focused.map((x,i)=>`${i+1}. ${x.name} (${fmt(x.score)})`).join(' • ');
    const reportInsight=(m.humano<6.5
      ? `O primeiro ponto de leitura é humano: desenvolvimento de pessoas está em ${fmt(m.humano)}. ${m.processos<6.5?'Processos também pedem atenção, o que torna importante verificar como conhecimento e autonomia estão chegando à rotina.':'Vale observar como essa base humana sustenta as capacidades mais fortes.'}`
      : `O desenvolvimento humano aparece como base favorável, com ${fmt(m.humano)}. O próximo passo é verificar como essa capacidade sustenta as demais dimensões e evita que a evolução dependa apenas de pessoas específicas.`)
      + (rel[0] ? ` ${rel[0]}` : ' As demais dimensões devem ser observadas em conjunto, não isoladamente.');
    const result={
      pattern:pattern(scores),
      humanFirst:reading.join('\n\n'),
      compact,
      reportInsight,
      priorityIds:focused,
      priorityText,
      firstText,
      nextStep:nextStep(m,priorities),
      strengths:highest,
      low:all.slice(-3).reverse(),
      gap:all[0].score-all[all.length-1].score
    };
    const joined=JSON.stringify(result).toLowerCase();
    if(BAN.some(x=>joined.includes(x))) throw new Error('Linguagem proibida detectada na interpretação.');
    return result;
  }
  window.RadarInterpretation={analyze,pattern};
})();
