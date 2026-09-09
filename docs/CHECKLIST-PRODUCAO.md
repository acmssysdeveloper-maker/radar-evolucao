# Checklist de publicação - Radar de Evolução 2.4.2

1. Criar/abrir a planilha CRM.
2. Colar `apps-script/Code.gs` no Apps Script ligado à planilha.
3. Executar `setup()` uma vez e autorizar.
4. Implantar como Aplicativo da Web / executar como você / acesso: qualquer pessoa.
5. Testar `URL_DO_SCRIPT?action=health` no navegador.
6. Colocar a URL `/exec` em `config.js` na propriedade `API_ENDPOINT`.
7. Publicar o diretório do site no GitHub Pages ou Netlify.
8. Fazer um diagnóstico completo de teste.
9. Registrar o relatório e conferir uma linha em `Leads`, uma em `Diagnosticos`, 24 em `Respostas` e eventos em `Interacoes`.
10. Reabrir/reenviar o mesmo diagnóstico e confirmar que o `Diagnostico_ID` não é duplicado.
11. Fazer uma segunda avaliação para a mesma empresa e confirmar reaproveitamento do `Lead_ID`.
12. Imprimir o relatório em A4 e confirmar que sai em uma única página.
13. Testar o WhatsApp e conferir a mensagem com índice, nível e pontos de atenção.
14. Testar horários no Brasil (site, CRM e PDF) e confirmar `America/Sao_Paulo`.
15. Limpar dados de teste da planilha antes da distribuição.
