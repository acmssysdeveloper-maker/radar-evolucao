# Radar de Evolução 2.0

Projeto multipágina e PWA para transformar o diagnóstico em uma ferramenta útil de reflexão, registro e acompanhamento de evolução.

## O que está entregue

- Landing page sem logo, seguindo a identidade visual dourado/preto/branco da referência fornecida.
- Página Sobre Antonio Cesar.
- Página explicando o Radar.
- Questionário de 24 perguntas em 8 dimensões.
- Cálculo do índice geral de 0 a 10.
- Cinco faixas de maturidade.
- Resultado com radar visual.
- Histórico local do diagnóstico.
- Cadastro para liberar o relatório.
- Geração de relatório em página própria, pronta para imprimir/salvar como PDF.
- Encaminhamento ao WhatsApp +55 22 99968-0509.
- Estrutura de integração com Google Apps Script + Google Sheets.
- PWA: manifest, service worker e cache do shell.
- Política de privacidade inicial para revisão.

## Estrutura

`index.html` é a porta de entrada.
`diagnostico.html` executa a avaliação.
`resultado.html` mostra o radar.
`relatorio.html` registra o lead e prepara o PDF.
`config.js` recebe a URL do Google Apps Script.
`apps-script/Code.gs` prepara o CRM e recebe os registros.

## Modelo de CRM

A estrutura recomenda separar Leads, Diagnosticos, Respostas e Interacoes. Uma planilha xlsx de referência é entregue fora deste diretório e pode ser usada para criar a base no Google Sheets.

## Fluxo

Visita → reflexão → diagnóstico → resultado → relatório → WhatsApp → CRM → reavaliação.

## Reavaliação

Cada diagnóstico recebe um ID. Para comparar períodos, mantenha uma linha por diagnóstico na aba `Diagnosticos`. O painel do CRM pode calcular a evolução do índice geral e de cada dimensão entre avaliações.

## Publicação

O site não depende de Node ou servidor de aplicação. Pode ser publicado como conteúdo estático. A integração de dados ocorre pelo endpoint do Google Apps Script.

## Segurança e LGPD

Antes de colocar em produção, revise a política de privacidade, consentimento, retenção de dados e permissões da planilha/Apps Script. Não coloque chaves ou credenciais de serviços no JavaScript público do site.


## Contexto Brasil e Mundo

A home e páginas estratégicas exibem um painel de dados de contexto sobre competências, IA, inovação e digitalização. Os números têm fonte e data. Quando o Google Apps Script estiver publicado, a aba `Indicadores` do Sheets pode servir como fonte editorial atualizável sem editar o site.

## Versão 2.3 — pontuação e Roda de Evolução

A escala das respostas permanece em 0–4, mas o motor converte cada média de dimensão para 0–10 (`média × 2,5`). O índice geral é a média das 8 dimensões em 0–10.

O resultado utiliza uma Roda de Evolução radial com 8 eixos, níveis 0–10, pontos por dimensão, índice central e leitura dos maiores pontos fortes e pontos de atenção.

Princípio de UX: acelerar a compreensão e reduzir fricção sem usar informação falsa, urgência artificial ou pressão indevida. O CTA comercial aparece depois de o usuário compreender o próprio resultado.

## PDF em 1 pagina - v2.3.2

O `relatorio.html` foi reorganizado para impressão A4 vertical em uma única página. A versão impressa concentra índice geral, nível, Roda de Evolução, oito dimensões, leitura prioritária e próximo passo, ocultando navegação e formulário. A área de impressão usa `@page` A4 com margens controladas e elementos compactos para evitar quebra de página.

Importante: a impressão depende do navegador respeitar as opções de impressão. Recomenda-se selecionar A4, escala 100% e desativar cabeçalhos/rodapés do navegador. A página já informa `@page { size: A4 portrait; margin: 0; }` e usa a própria composição para caber em uma folha.


### Showcase do relatório
A página inicial inclui `assets/pdf-showcase.png`, uma prévia ilustrativa do relatório executivo de uma página. Ela é apresentada como exemplo para mostrar visualmente o que o participante recebe após concluir a avaliação.


## Showcase do relatório
A home usa uma prévia completa do relatório em proporção A4, sem recorte. O visitante pode ampliar a visualização em uma janela modal para inspecionar a Roda de Evolução e as demais informações.
