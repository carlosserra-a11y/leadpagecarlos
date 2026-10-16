# Identidade visual · Portfólio Carlos Serra

Baseada nas referências de *Bleach: Thousand-Year Blood War* que o Carlos enviou: dois pôsteres oficiais, um quadro do mangá e duas cenas do Wandenreich.
Por padrão **nenhuma imagem oficial é usada**: tudo (cidade, lua, horizonte, tropa, tinta, partículas, kanji) é desenhado em código e é original.
Na versão 3.0 as 5 imagens podem entrar como cenas com paralaxe, se você quiser (`CONFIG.imagensOficiais` e `assets/bleach/LEIA-ME.md`).

## O que tiramos de cada referência

| Referência | O que ela ensina | Onde aparece no site |
| --- | --- | --- |
| Pôster 1 (preto e vermelho, coluna de texto vertical com selo) | Contraste extremo, vermelho como "corte", texto japonês vertical com selo vermelho | Coluna 「千年の時を超え、コードで斬る。」 com selo 斬 no hero; corte vermelho no nome |
| Pôster 2 (azul-noite, contorno magenta, uniformes brancos) | Noite azulada, luz fria e contorno magenta | Paleta padrão (azul-noite + branco frio), céu do hero, `--rim` |
| Quadro do mangá (tinta preta pesada) | Preto chapado, retícula, pincel | Seção "Projetos em destaque" como página de mangá, com retícula e linhas de velocidade |
| Cena do Yhwach (céu com faixa vermelha no horizonte) | Faixa vermelha atrás de silhuetas | Horizonte vermelho atrás da cidade no hero |
| Exército do Wandenreich (branco e azul frio) | Uniformes brancos, monocromia fria, multidão em camadas | Cidade de torres em camadas (paralaxe) e a "chuva de flechas de luz" (Licht Regen) |

## Os dois lados

- **Quincy (padrão):** azul-noite, branco do uniforme, flechas de luz caindo na diagonal.
- **Shinigami (modo Bankai, botão ou tecla B):** preto e vermelho, a lua fica vermelha e o reiatsu sobe em brasas.

## Paleta

| Token | Cor | Uso |
| --- | --- | --- |
| `--void` | `#05060a` | Fundo |
| `--night` | `#0b0e1c` | Superfícies, céu |
| `--night-2` / `--night-3` | `#121733` / `#1a2146` | Cartões, profundidade |
| `--line` | `#232a47` | Bordas e fios |
| `--snow` | `#eef2fb` | Texto principal (branco Quincy) |
| `--frost` | `#a3b4d8` | Texto secundário (aço frio) |
| `--blood` | `#e3132f` | Destaque, cortes, selos (vermelho Bankai) |
| `--rim` | `#ff3b5c` | Luz de contorno, foco do teclado |
| `--paper` / `--sumi` | `#f2efe6` / `#0b0b0d` | Página de mangá |

Regra de proporção: 70% preto e azul-noite, 20% branco frio, 10% vermelho. O vermelho só aparece onde há "corte" (ação, destaque, selo).

## Tipografia

| Papel | Fonte | Por quê |
| --- | --- | --- |
| Logo e títulos | **Big Shoulders Display** 900, caixa alta | Condensada e afiada, lembra os títulos do anime |
| Subtítulos e japonês | **Shippori Mincho B1** | Mincho elegante dos cartões de título |
| Kanji em pincel | **Yuji Syuku** | Traço de pincel dos kanji de abertura |
| Texto | **Zen Kaku Gothic New** | Legível, combina com o japonês |
| Rótulos e números | **IBM Plex Mono** | Ar de ficha técnica |

## Grafismos

- **Cartão de título:** kanji grande em pincel na vertical + título + corte vermelho.
  Cada kanji tem significado real: 斬 corte · 要 essencial · 記録 registro · 書庫 arquivo · 道 caminho · 技 técnica · 型 forma · 学 estudo · 縁 laço.
- **Selo (hanko):** quadrado vermelho com 斬, usado como logo.
- **Ensō:** círculo de tinta com texto em órbita que gira com a rolagem.
- **Página de mangá:** quadros com bordas inclinadas, lidos da direita para a esquerda, com retícula, linhas de velocidade que seguem o mouse e balão de fala.
- **Ficha de soldado:** o resumo para recrutadores imita uma ficha de identificação com scanner.

## Movimento

- Abertura: a tela se parte num corte vermelho e o nome sobe letra por letra (CSS puro, uma vez por sessão).
- Faixa de tinta: um pincel revela a cena e o papel sobe até virar a página de mangá.
- Trajetória: o horizonte fica preso na tela e faz zoom lento enquanto a lâmina vermelha desce.
- Contato: a câmera passa pela tropa (deslize horizontal com a rolagem).
- Paralaxe em camadas no hero (céu, lua, cidade distante, cidade próxima, névoa, tinta), com rolagem e mouse. Com as imagens oficiais: 3 profundidades a partir do mesmo pôster, zoom de 1 a 1,15 e escurecimento ao rolar.
- Ensō, tinta e pincel são pré-desenhados com filtro de turbulência e salvos em `assets/arte/`: o visual é o mesmo e o celular não recalcula filtro a cada quadro.
- Rolagem suave (Lenis), títulos que se decodificam em katakana, quadros de mangá "entintados" ao entrar.
- Cursor de reiatsu, botões magnéticos, cartões com inclinação 3D e brilho.
- Tudo respeita "reduzir movimento": sem animação, a página fica completa e parada.
