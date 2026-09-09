# Google Apps Script — Radar de Evolução

1. Crie uma planilha no Google Sheets.
2. Use as abas: `Leads`, `Diagnosticos`, `Respostas`, `Interacoes` e `Indicadores`.
3. Abra Extensões → Apps Script.
4. Cole o conteúdo de `Code.gs`.
5. O site envia ao Apps Script as respostas numéricas acompanhadas do texto da pergunta e da dimensão; não é necessário duplicar o banco de perguntas no Apps Script.
6. Execute `setup()` uma vez e autorize.
7. Publique o projeto como Web App e copie a URL de execução.
8. Abra `config.js` no site e preencha `API_ENDPOINT` com a URL do Web App.
9. Publique o conteúdo da pasta `radar-evolucao` no GitHub Pages ou Netlify.

Importante: o Google Apps Script é o intermediário que permite ao site estático gravar no Google Sheets. A planilha deve permanecer com acesso restrito; somente a publicação do Web App deve ser pública conforme a configuração escolhida.

## Próxima evolução

Para gerar PDF automaticamente no Google Drive, pode ser adicionada uma segunda ação `generateReport` que cria um Google Docs com o resultado e o exporta como PDF. A versão entregue já contém fallback de impressão do navegador para PDF.


### Indicadores de contexto

A aba `Indicadores` funciona como uma pequena base editorial para o cenário Brasil/Mundo. Colunas: `Scope`, `Value`, `Title`, `Detail`, `Source`, `URL`, `Updated_At`, `Active`. O site usa estes dados para contextualizar o diagnóstico. Isso permite atualização periódica sem alterar o HTML.

O Web App também responde a `?action=context`, permitindo que o site carregue a versão mais recente da aba `Indicadores`. O projeto mantém dados de fallback no arquivo `js/contexto.js` caso o endpoint ainda não esteja configurado.

Regra editorial: não usar números para insinuar que toda empresa precisa contratar consultoria. Cada indicador deve ser acompanhado de fonte, data e contexto; a chamada comercial deve partir do diagnóstico individual.
