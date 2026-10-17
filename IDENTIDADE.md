# Identidade visual · versão 5

Portfólio para ser lido por recrutador: escuro, editorial e direto. A referência a Bleach existe, mas como acento
discreto, sem imagens do anime (direitos autorais) e sem efeitos que disputem atenção com os projetos.

## Onde Bleach aparece

- **Selo 斬** (zan, "cortar") na marca e no fundo do topo, só em contorno.
- **Numerais em kanji** (一 二 三…) ao lado da numeração das seções.
- **Zanpakutō em 3D** atrás da foto, como a espada carregada nas costas: lâmina escura com fio claro e linha de têmpera,
  guarda oval com aro carmim, cabo com trançado em losangos e a corrente quebrada no pomo (Tensa Zangetsu).
  Reage ao mouse e à rolagem e tem um brilho que percorre a lâmina.
- **Modo Bankai (卍解)**: botão no rodapé ou tecla B. O fundo esquenta para vinho, o vermelho fica mais vivo e o fio da katana acende.

## Paleta

| Token | Cor | Uso |
| --- | --- | --- |
| `--bg` | `#0b0b0c` | Fundo |
| `--bg-2` / `--bg-3` | `#111113` / `#18181b` | Superfícies |
| `--text` | `#ecebe7` | Texto principal |
| `--muted` / `--dim` | `#a3a29c` / `#76756f` | Texto secundário |
| `--accent` | `#d7263d` | Botão principal, marcações |
| `--accent-txt` | `#ff5a6e` | Vermelho sobre fundo escuro (contraste AA) |
| `--paper` / `--ink` | `#efede8` / `#141414` | Seção clara de projetos |

## Tipografia

- **Archivo** (variável em largura e peso): nome em caixa alta condensada, títulos e texto.
- **JetBrains Mono**: rótulos, datas, tags e e-mail.
- **Noto Serif JP**: só os kanji (a fonte é carregada apenas com os caracteres usados).

## Movimento

- Entrada do topo em CSS (aparece mesmo antes do JavaScript).
- Parallax em camadas: kanji do fundo, foto e katana andam em velocidades diferentes; nos estudos de caso o navegador e o celular também.
- Trajetória anda na horizontal com a seção presa (no computador).
- Com "reduzir movimento" ligado, tudo fica parado e a katana aparece estática.
