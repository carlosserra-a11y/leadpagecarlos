# Carlos Serra · Portfólio

Site pessoal de **Carlos Serra**, desenvolvedor full stack júnior em Palhoça/SC (ADS · FMP).

**No ar:** https://carlosserra-a11y.github.io/leadpagecarlos/

- E-mail: carlosserraap55@gmail.com
- WhatsApp: (48) 99617-0281
- GitHub: https://github.com/carlosserra-a11y

## O que tem na página

| Seção | Conteúdo |
| --- | --- |
| Início | Nome, foto, resumo, contato direto (WhatsApp, e-mail, telefone) e números do GitHub. Atrás da foto, uma zanpakutō em 3D feita com three.js |
| Trabalhos | 5 estudos de caso com captura de computador e de celular, problema, solução e stack. Cada um abre em detalhe (`#caso-figaros`, `#caso-ingrid`…) |
| Projetos | Os 9 projetos publicados com filtro por tipo, mais a lista dos outros repositórios (novos repositórios entram sozinhos pela API do GitHub) |
| Processo | Como eu trabalho, do pedido ao site no ar, e a stack com o projeto que comprova cada item |
| Trajetória | De agosto a outubro de 2026, do primeiro commit ao sistema com banco de dados |
| Sobre / Contato | Bio, resumo para recrutador (copiar ou salvar contato .vcf) e formulário |

Também tem: versão em inglês (botão EN), modo Bankai (botão no rodapé ou tecla **B**), barra fixa de contato no celular e página 404 própria.

## Tecnologia

- HTML, CSS e JavaScript sem framework e sem etapa de build para o site: abre com dois cliques no `index.html`.
- GSAP + ScrollTrigger para o parallax e as entradas; Lenis para a rolagem suave (só com mouse).
- three.js para a katana 3D, montada em `lib/katana3d.min.js` a partir de `src/katana3d.js`. Ela carrega depois da página e pausa fora da tela. Em economia de dados ou sem placa de vídeo (WebGL por software) fica um desenho em SVG; com "reduzir movimento" ligado, a versão parada. `?3d=1` na URL força o 3D para testes.
- Todas as bibliotecas ficam em `lib/` (nenhum script de CDN). Política de segurança (CSP) com hash do único script inline.
- Imagens em AVIF/WebP com tamanhos responsivos; fontes do Google só com os caracteres usados.

## Estrutura

```
index.html            página
404.html              página de erro
css/style.css         estilos
js/dados.js           textos, contatos, projetos e traduções (edite aqui)
js/app.js             comportamento da página
src/katana3d.js       modelo 3D da katana (fonte)
lib/                  GSAP, ScrollTrigger, Lenis e a katana já montada
assets/foto/          retrato
assets/projetos/      capturas dos projetos
ferramentas/          scripts de manutenção (Node)
```

## Como editar

1. Contatos, projetos e textos ficam em `js/dados.js`. Campos vazios do `CONFIG` (ex.: `linkedin`, `curriculo`) somem da página.
2. Depois de mudar textos ou o script inline do `index.html`, atualize fontes e hashes da CSP:
   ```
   node ferramentas/cabecalho.mjs
   ```
3. Depois de mexer na katana (`src/katana3d.js`):
   ```
   cd ferramentas && npm install && npm run katana
   ```

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Cada push na `main` publica em um ou dois minutos.
