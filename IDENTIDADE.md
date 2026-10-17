# Identidade visual · versão 8 · carlos@serra

Portfólio sério e técnico, com um toque de terminal: projetos primeiro, prova visível, contato fácil.
O destaque visual vem do próprio trabalho (os sites dos clientes aparecem de verdade na vitrine 3D) e de
detalhes de "hacker" usados com moderação: prompt de terminal, coordenadas, relógio, texto que se decodifica.

## Marca

- **Nome da marca: `carlos@serra`**, o nome escrito como `usuário@máquina` de um terminal. Vem acompanhado do
  cursor piscando (`▍`) e, em textos de terminal, do prompt `carlos@serra:~$`.
- **Logo:** um hexágono aberto do lado direito (forma um **C** de Carlos e lembra as facetas do cristal 3D) com o prompt
  `>_` dentro. O hexágono tem degradê azul (`#8fb0ff` → `#2f5bea`), o `>` vai na cor do texto e o `_` em azul (pisca no cabeçalho).
  Arquivos: `assets/marca/logo.svg` (transparente) e `assets/favicon.svg` (fundo grafite, para ícones).
- O nome da pessoa continua escrito "Carlos Serra"; cargo "Desenvolvedor Full Stack Júnior".

## Paleta

| Token | Cor | Uso |
| --- | --- | --- |
| `--bg` | `#0a0c10` | Fundo |
| `--bg-2` / `--bg-3` | `#0f1218` / `#161a22` | Cartões e superfícies |
| `--text` / `--soft` | `#e8ecf2` / `#c7cdd8` | Texto principal e de apoio |
| `--muted` / `--dim` | `#98a2b3` / `#667085` | Texto secundário e detalhes da moldura |
| `--accent` | `#2f5bea` | Botão principal (contraste AA com texto branco) |
| `--accent-hi` | `#4f7cff` | Brilhos, linhas, cursor, detalhes |
| `--accent-txt` | `#8fb0ff` | Azul sobre fundo escuro (rótulos, prompt) |
| `--ok` | `#34d399` | "Disponível", "como conferir", versão atual |
| `--paper` / `--ink` | `#f3f4f6` / `#0a0c10` | Seção clara (outros clientes e arquivo), para quebrar o ritmo |

## Tipografia

- **Space Grotesk** (600–700): títulos, números grandes e o nome. Espaçamento negativo, entrelinha curta.
- **Geist** (400–500): texto corrido, botões, formulários.
- **JetBrains Mono** (500–700): tudo que é "terminal": navegação, rótulos `01 / projetos`, datas, tags, a marca
  `carlos@serra`, o nome na tela de carregamento, o relógio e as coordenadas.

## Regras de texto

- Primeira pessoa, frases curtas, verbos concretos. Sem slogans e sem trios de adjetivos.
- Só números que dá para conferir: 5 clientes reais, 9 sites no ar, 19 repositórios públicos.
- Detalhes de terminal são enfeite: o conteúdo nunca depende deles (sem "ACCESS GRANTED", sem chuva de código).
- Idade e dados pessoais fora do topo.

## Movimento

- **Carregamento** (primeira visita da sessão, até ~2,7 s): o nome `CARLOS SERRA` se decodifica letra por letra
  conforme a página carrega, com contador 000 → 100 e um log de inicialização; sai como uma cortina subindo.
  Qualquer tecla ou toque pula. Com "reduzir movimento" ou sem JavaScript, não aparece.
- **Topo:** moldura de detalhes (cantos, Palhoça, coordenadas, relógio, posição do mouse, versão). Com GPU, o cristal 3D
  refrata o nome sobre uma grade de pontos que acende perto do mouse e solta uma onda no clique. Sem 3D: nome em duas
  linhas, terminal digitando `whoami`, contadores subindo e a vitrine ao lado.
- **Fundo do site:** grade de pontos com parallax; perto do mouse os pontos viram caracteres de código e piscam; um clique solta uma onda.
- **Projetos:** cada destaque é um estudo de caso (desafio → o que eu fiz → como conferir), com o número enorme em
  contorno passando atrás; a vitrine 3D troca de site com um "glitch" curto. Uma barra `01 / 03` acompanha a leitura.
- **Arquivo:** lista com filtros; a linha acende ao passar o mouse e uma prévia da tela segue o cursor.
- **Microinterações:** rótulos e links do menu se decodificam ao passar o mouse; anel que segue o cursor; botões com atração;
  imagens se abrem por uma máscara; a marca gigante do rodapé acende onde o mouse passa.
- Com "reduzir movimento", tudo fica estático e completo.
