# Serviços ocultos: Brow Lamination e Micropigmentação

Ocultos em 24/11/2026, por enquanto. Nada foi perdido: fotos e textos continuam no projeto. A pasta `docs` não vai para o site publicado.

## Como mostrar de novo

1. **`index.html`**: apague a palavra `hidden` de cada item abaixo:
   - faixa animada (`.marquee`): todos os `<span hidden>`
   - carrossel: os 2 `<article class="slide" ... hidden>` e os 2 `<button type="button" hidden>`
   - FAQ: os 2 `<span hidden>` e o `<details hidden>`
   - catálogo: os 2 `<li class="cat-item" ... hidden>`

   O carrossel conta os serviços visíveis sozinho (contador, botões e movimento voltam).
2. **`negocio.json`**: cole os serviços abaixo em `servicos`, antes da limpeza de pele.
3. **Textos trocados**: use os textos antigos abaixo.
4. **`scripts/atualizar-dados.py`**: em `knowsAbout`, recoloque `'brow lamination', 'micropigmentação de sobrancelhas'`.
5. Rode `python scripts/atualizar-dados.py`.

## Serviços (para o `negocio.json`)

```json
[
  {
    "id": "brow-lamination",
    "nome": "Brow Lamination",
    "descricao": "Fios alinhados e com efeito volumoso, prontos todos os dias.",
    "preco_brl": 130.0,
    "duracao_min": 45,
    "duracao_max": 60,
    "duracao_efeito": "4 a 8 semanas."
  },
  {
    "id": "micropigmentacao",
    "nome": "Micropigmentação de Sobrancelhas",
    "descricao": "Definição, simetria e naturalidade com resultado duradouro.",
    "preco_brl": 450.0,
    "duracao_min": 120,
    "duracao_max": 180,
    "duracao_efeito": "12 a 18 meses, dependendo da técnica, pele e cuidados."
  }
]
```

## Textos antigos

- `index.html`, meta description: Design de sobrancelhas, brow lamination, henna e micropigmentação com Joyce Duarte no Jardim Americano, Itaquaquecetuba (SP). Veja o catálogo e agende pelo WhatsApp.
- `index.html`, og:description: Brow lamination, henna, micropigmentação e design de sobrancelhas com Joyce Duarte. Agende pelo WhatsApp.
- `index.html`, Sobre: Do design à micropigmentação, o objetivo é sempre o mesmo
- `negocio.json`, descricao_curta: Design de sobrancelhas, henna, brow lamination, micropigmentação e limpeza de pele em Itaquaquecetuba (SP).
- `privacidade.html`: procedimentos como micropigmentação e henna
- `llms.txt`: resumo, lista de serviços, "Quanto custa?" e "Qual a diferença?". Recupere com `git show f14e3f3:llms.txt`
