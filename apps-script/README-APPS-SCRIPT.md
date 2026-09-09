# Google Apps Script - Radar de Evolução 2.4.2

1. Abra a planilha do CRM no Google Sheets.
2. Extensões -> Apps Script.
3. Substitua o código existente pelo conteúdo de `Code.gs`.
4. Execute `setup()` uma vez e autorize.
5. Implante como Aplicativo da Web, executando como você, com acesso para qualquer pessoa.
6. Copie a URL `/exec` para `config.js` na propriedade `API_ENDPOINT`.
7. Teste `URL_DO_SCRIPT?action=health` no navegador.

O script mantém um `Lead_ID` estável para a mesma combinação de e-mail + empresa ou WhatsApp + empresa, evita duplicação do mesmo `Diagnostico_ID`, grava respostas e eventos e alimenta a aba `Evolucao`.


O servidor recalcula as oito dimensões a partir das 24 respostas recebidas, em vez de confiar na pontuação enviada pelo navegador. O status de gravação pode ser confirmado por `?action=diagnosisStatus&diagnosticoId=...`.
