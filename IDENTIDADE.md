# Identidade visual · versão 6

Portfólio para ser lido por recrutador: escuro, editorial e direto. Projetos primeiro, prova visível, contato fácil.
A referência a Bleach é assinatura, não tema: nada de imagens do anime (direitos autorais) e nada que dispute atenção com os projetos.

## Onde Bleach aparece

- **Selo 斬** (zan, "cortar") na marca e no rodapé.
- **Zanpakutō em 3D atrás do retrato**, como a espada carregada nas costas: o cabo sai por cima do ombro.
  Lâmina negra com hamon claro, tsuba mokko com filete carmim, ito vermelho sobre same marfim e a corrente quebrada no pomo (Tensa Zangetsu).
  Ao rolar, a espada sai um pouco das costas.
- **O corte**: a seção de projetos sobe por cima do topo com a borda em diagonal e um fio vermelho.
- **Modo Bankai (卍解)**: botão no rodapé ou tecla B. O fundo esquenta para vinho, o vermelho fica mais vivo e o hamon acende.

## Regras de texto

- Primeira pessoa, frases curtas, verbos concretos. Sem slogans ("transformo ideias em…") e sem trios de adjetivos.
- Só números que dá para conferir: 5 clientes reais, 9 sites no ar, testes que existem nos repositórios.
- Idade e dados pessoais fora do topo.

## Paleta

| Token | Cor | Uso |
| --- | --- | --- |
| `--bg` | `#0b0b0c` | Fundo |
| `--bg-2` / `--bg-3` | `#111113` / `#18181b` | Superfícies |
| `--text` | `#ecebe7` | Texto principal |
| `--muted` / `--dim` | `#a3a29c` / `#76756f` | Texto secundário |
| `--accent` | `#d7263d` | Botão principal e um detalhe por tela, no máximo |
| `--accent-txt` | `#ff5a6e` | Vermelho sobre fundo escuro (contraste AA) |
| `--paper` / `--ink` | `#efede8` / `#141414` | Seção clara "Outros projetos", para quebrar o ritmo |

## Tipografia

- **Archivo** (variável em largura e peso): nome em caixa alta condensada, títulos e texto.
- **JetBrains Mono**: rótulos, datas, tags e e-mail.
- **Noto Serif JP**: só os kanji 斬 e 卍解 (carregada apenas com esses caracteres).

## Movimento

- Topo: entrada em CSS; no computador fica preso enquanto os projetos sobem por cima. Texto, retrato e katana andam em velocidades diferentes.
- Títulos: cada palavra sobe de dentro de uma máscara.
- Projetos em destaque: cada um ocupa a tela e o próximo sobe por cima (o anterior recua); a página inteira do site rola dentro da moldura do navegador; o celular anda em outra camada.
- Evolução 1.0 → 3.0: a linha entre as versões se desenha e as miniaturas entram em sequência.
- Outros projetos: a imagem anda dentro da moldura e a etiqueta "Abrir site" segue o cursor.
- Sobre: a linha do tempo se preenche com a rolagem. Contato: botão do WhatsApp com leve atração do cursor. Rodapé aparece por baixo, como uma cortina.
- Com "reduzir movimento", tudo fica estático.
