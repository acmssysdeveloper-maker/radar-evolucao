# Radar de Evolução 2.4.1 - versão de distribuição

O Radar de Evolução é uma ferramenta de reflexão, diagnóstico e acompanhamento. A experiência é construída para levar o participante de contexto -> diagnóstico -> resultado -> relatório -> conversa -> reavaliação.

## Estrutura

- `index.html` - entrada e showcase do relatório.
- `sobre.html` - trajetória de Antonio Cesar do chão de fábrica à atuação independente como instrutor e consultor em 2024, sem romper com a origem operacional.
- `radar.html` - explica as oito dimensões e os níveis.
- `diagnostico.html` - 24 perguntas, navegação por etapa e persistência temporária da avaliação.
- `resultado.html` - índice, nível, Roda de Evolução e pergunta opcional de foco.
- `relatorio.html` - relatório executivo A4 em uma única página e cadastro para CRM.
- `contato.html` - WhatsApp de Antonio Cesar.
- `privacidade.html` - política de privacidade do projeto.
- `config.js` - endpoint do Google Apps Script e configurações públicas.
- `apps-script/Code.gs` - API do Google Sheets.

## Pontuação

Cada resposta vale de 0 a 4. Para cada dimensão, calcula-se a média das três perguntas e converte-se para 0 a 10 multiplicando por 2,5. O índice geral é a média das oito dimensões. A classificação usa os seguintes limites: 0-2,4 Reativo; 2,5-4,4 Organizado; 4,5-6,4 Estruturado; 6,5-8,2 Adaptativo; 8,3-10 Evolutivo.

## CRM

Um `Lead_ID` identifica a pessoa/empresa. Um `Diagnostico_ID` identifica cada avaliação. O Apps Script evita duplicar o mesmo diagnóstico e tenta reutilizar o lead existente por combinação de e-mail+empresa ou WhatsApp+empresa.

## Publicação

O site pode ser publicado no GitHub Pages ou Netlify. O Google Apps Script deve ser implantado como Web App e sua URL `/exec` deve ser colocada em `config.js` na propriedade `API_ENDPOINT`.

Não coloque senhas, tokens ou credenciais privadas no código público do site.

## PDF

O relatório usa uma composição própria para A4 vertical em uma única página. Na impressão, use A4, escala 100% e desative cabeçalhos/rodapés do navegador.

## Contexto Brasil e Mundo

Os indicadores de contexto são mantidos em `js/contexto.js` e podem ser substituídos por dados vindos da aba `Indicadores` do Sheets quando `CONTEXT_ENDPOINT` for configurado.

## Política e distribuição

Antes da divulgação ampla, valide que o endereço do Apps Script, a planilha, o texto de privacidade e as rotinas de atendimento correspondem à operação real.


Versão 2.4.1: interface de cadastro revisada com aviso de privacidade em linguagem clara; informações técnicas de CRM foram retiradas da área do participante.
