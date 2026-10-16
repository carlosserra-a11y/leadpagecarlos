# Imagens do anime (opcional)

O site funciona **sem** estas imagens: tudo é desenhado em código (cidade, lua, horizonte, tropa, tinta).
Se quiser usar as imagens de referência de *Bleach: Thousand-Year Blood War*:

1. Salve as 5 imagens em `assets/bleach/originais/` com estes nomes (JPG, PNG ou WebP, mínimo 1920 px no lado maior):

   | Arquivo | Imagem | Onde entra |
   | --- | --- | --- |
   | `poster-noite` | Pôster azul-noite, Quincy de branco com contorno magenta | Hero (modo normal) |
   | `poster-sangue` | Pôster preto e vermelho com coluna de texto vertical | Hero (modo Bankai) |
   | `manga-tinta` | Quadro do mangá em preto e branco | Faixa de tinta antes dos projetos e fundo do estudo de caso |
   | `yhwach-horizonte` | Líder do Wandenreich com céu de faixa vermelha | Trajetória (imagem presa na tela) |
   | `wandenreich-exercito` | Exército de uniformes brancos em azul frio | Fundo do contato |

2. No terminal:

   ```bash
   cd ferramentas
   npm install
   npm run imagens
   ```

   Isso cria as versões AVIF, WebP e JPG em 640, 1280 e 1920 px, o placeholder borrado e o arquivo `imagens.js`.

3. Em `js/dados.js`, mude `imagensOficiais: false` para `imagensOficiais: true`.

O rodapé passa a mostrar o crédito: “Imagens de Bleach: Thousand-Year Blood War © Tite Kubo/Shueisha, TV TOKYO, dentsu, Pierrot.
Fan art sem fins comerciais e sem vínculo com os detentores dos direitos.”

> As imagens são de terceiros. Use só em portfólio pessoal, sem fins comerciais. A pasta `originais/` não vai para o Git.
