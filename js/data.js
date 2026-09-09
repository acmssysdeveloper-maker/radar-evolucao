window.RADAR_DATA = {
  dimensions: [
    {id:'humano', name:'Desenvolvimento humano', short:'Pessoas'},
    {id:'critico', name:'Pensamento crítico', short:'Pensamento'},
    {id:'decisao', name:'Capacidade de decisão', short:'Decisão'},
    {id:'processos', name:'Processos e melhoria', short:'Processos'},
    {id:'tecnologia', name:'Tecnologia e IA', short:'Tecnologia'},
    {id:'dados', name:'Dados e inteligência', short:'Dados'},
    {id:'aprendizagem', name:'Aprendizagem e adaptação', short:'Aprendizagem'},
    {id:'inovacao', name:'Inovação e evolução', short:'Inovação'}
  ],
  questions: [
    ['humano','Quando surge um problema, as pessoas mais afetadas conseguem analisar e propor caminhos?','Pense no comportamento real da equipe.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['humano','O conhecimento importante continua disponível quando uma pessoa experiente sai ou muda de função?','Considere rotina, padrão, documentação e formação.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['humano','A formação das pessoas aumenta autonomia ou apenas ensina a cumprir instruções?','Avalie o efeito do treinamento sobre a capacidade de pensar e agir.',['Apenas instruções','Pouco','Parcialmente','Em boa parte','Gera autonomia']],
    ['critico','Antes de corrigir um problema, a equipe procura entender a causa ou age primeiro sobre o sintoma?','Avalie a prática predominante.',['Sempre sobre sintomas','Na maioria das vezes','Depende','Geralmente procura causa','Quase sempre procura causa']],
    ['critico','Informações importantes são verificadas quanto à origem, contexto e qualidade antes de orientar uma decisão?','Não vale apenas ter acesso à informação.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['critico','É seguro questionar uma prática apenas porque “sempre foi assim”?','Pensamento crítico precisa sobreviver ao hábito.',['Nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['decisao','As decisões importantes são tomadas por quem realmente conhece o problema no ambiente em que ele acontece?','Considere proximidade entre decisão e realidade.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['decisao','Quando aparece um desvio, existe clareza sobre quais evidências devem orientar a decisão?','Dados, experiência e contexto precisam conversar.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['decisao','A organização consegue transformar uma constatação em decisão sem prolongar indefinidamente a discussão?','Observe tempo e responsabilidade.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['processos','As atividades críticas possuem padrões claros, conhecidos e realmente usados?','Padrão bom é aquele que existe na prática.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['processos','Problemas recorrentes geram mudanças permanentes ou voltam depois de uma correção temporária?','Pense no histórico dos últimos meses.',['Voltam quase sempre','Frequentemente voltam','Depende','Raramente voltam','Quase nunca voltam']],
    ['processos','Quanto a operação depende de pessoas específicas para funcionar bem?','Quanto maior a dependência pessoal, menor a robustez do processo.',['Muito alta','Alta','Média','Baixa','Muito baixa']],
    ['tecnologia','A empresa identifica atividades em que tecnologia ou IA pode reduzir trabalho repetitivo e aumentar a capacidade das pessoas?','Não se trata de usar tecnologia por moda.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['tecnologia','A tecnologia é usada para melhorar a qualidade do pensamento e da decisão, e não apenas para executar mais rápido?','Velocidade sem critério pode acelerar erros.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['tecnologia','Os recursos digitais atuais estão integrados à rotina real das pessoas?','Considere uso efetivo, não apenas aquisição de ferramentas.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['dados','Os indicadores usados no dia a dia ajudam a explicar o que está acontecendo?','Indicador útil orienta investigação e ação.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['dados','Quando um indicador piora, existe um método para investigar o motivo?','Observe a resposta ao desvio.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['dados','Os dados disponíveis realmente entram nas decisões relevantes?','Produzir dados e utilizar dados são coisas diferentes.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['aprendizagem','Erros e desvios geram aprendizado incorporado ao processo?','O aprendizado aparece na rotina ou desaparece na conversa?',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['aprendizagem','A empresa consegue adaptar práticas quando o contexto muda?','Avalie a capacidade de ajuste sem perder estabilidade.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['aprendizagem','Existe espaço para revisar métodos que funcionaram no passado, mas já não funcionam tão bem?','Aprender inclui desaprender.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['inovacao','Pequenos testes são usados para aprender antes de grandes investimentos?','Experimentos reduzem o risco de decisões grandes sem evidência.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['inovacao','As pessoas são incentivadas a propor melhorias e testar novas formas de trabalhar?','Inovação começa pela capacidade de propor e aprender.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']],
    ['inovacao','A empresa procura não apenas fazer mais rápido, mas fazer melhor?','Velocidade é apenas uma parte da evolução.',['Quase nunca','Raramente','Às vezes','Frequentemente','Quase sempre']]
  ],
  levels: [
    {min:0,max:2.4,name:'Reativo',desc:'A organização responde principalmente aos problemas quando eles aparecem. O próximo passo é criar visibilidade, padrões mínimos e capacidade de análise.'},
    {min:2.5,max:4.4,name:'Organizado',desc:'Existem controles e práticas importantes, mas ainda há dependência de pessoas e decisões pontuais. O ganho está em transformar boas práticas em sistema.'},
    {min:4.5,max:6.4,name:'Estruturado',desc:'Há método e alguma disciplina de gestão. A próxima evolução é conectar pessoas, dados, processos e tecnologia de forma mais consistente.'},
    {min:6.5,max:8.2,name:'Adaptativo',desc:'A organização demonstra capacidade de aprender, usar dados e desenvolver pessoas. O desafio passa a ser integrar essas capacidades para sustentar decisões melhores.'},
    {min:8.3,max:10,name:'Evolutivo',desc:'Pessoas, processos, pensamento, dados e tecnologia funcionam de maneira integrada, criando condições para melhoria contínua e adaptação.'}
  ]
};
