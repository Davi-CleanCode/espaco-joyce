# SEO, GEO e IAs: o que já está no site e o que falta fazer

## O que já está pronto no site

| Item | Onde | Para quê |
|---|---|---|
| Título e descrição com serviço + cidade | `index.html` `<head>` | Aparecer em "design de sobrancelhas Itaquaquecetuba" |
| URL canônica + Open Graph + imagem 1200x630 | `<head>`, `assets/brand/og.jpg` | Link bonito no WhatsApp/Instagram e sem conteúdo duplicado |
| Meta geo (BR-SP, coordenadas) | `<head>` | Sinal de SEO local |
| Dados estruturados `BeautySalon` + `Person` + `FAQPage` + `OfferCatalog` | Fim do `index.html` | O Google e as IAs entendem: o que é, onde fica, serviços, quem atende |
| Seção "Dúvidas frequentes" visível | `index.html` `#duvidas` | GEO: as IAs citam respostas curtas e diretas |
| `llms.txt` | raiz do site | Resumo em texto que as IAs leem rápido |
| `negocio.json` | raiz do site | Dados oficiais para agentes e automações |
| `robots.txt` liberando buscadores e IAs + `sitemap.xml` | raiz | Deixa todo mundo rastrear e indexar |

**Quando mudar algo (preço, horário, serviço):** atualize o `negocio.json`, o catálogo e o FAQ do `index.html` e o `llms.txt`. Precisam dizer a mesma coisa.

## Passo 1: Google Search Console (fazer logo após publicar)

1. Acesse https://search.google.com/search-console → "Adicionar propriedade" → **Prefixo do URL** → `https://espaco-joyce.vercel.app/`
2. Escolha verificar por **tag HTML**: o Google mostra algo como `<meta name="google-site-verification" content="XXXX">`
3. Me mande essa tag que eu coloco no `<head>` (ou cole logo abaixo da tag `<meta name="author">`)
4. Depois de verificado: menu **Sitemaps** → enviar `sitemap.xml`
5. **Inspeção de URL** → cole a URL do site → "Solicitar indexação"

Faça o mesmo no **Bing Webmaster Tools** (https://www.bing.com/webmasters): dá para importar do Search Console com um clique. Isso importa para o ChatGPT e o Copilot, que usam o índice do Bing.

## Passo 2: Testes

- Dados estruturados: https://search.google.com/test/rich-results (cole a URL)
- Validador Schema: https://validator.schema.org
- Prévia no WhatsApp: mande o link para você mesmo. Se a imagem antiga aparecer, o WhatsApp está usando cache e atualiza sozinho em alguns dias.

## Passo 3: Businesses in ChatGPT (Business Hub)

Situação em novembro de 2026: a OpenAI lançou em beta (10/11/2026) o **Businesses in ChatGPT**. Pelo **Business Hub**, a dona do negócio reivindica o perfil que o ChatGPT mostra, mantém os dados atualizados e pode publicar um **Business Agent**, um atendente de IA do negócio. Hoje:

- Negócios **locais** só conseguem reivindicar uma ficha **já existente nos EUA**. Ainda não vale para um estúdio no Brasil.
- Há verificação de identidade (Persona) e critérios de elegibilidade. Reivindicar não garante aparecer mais.

**O que fazer agora:** enquanto não abre para o Brasil, o ChatGPT encontra negócios locais pela web e por fontes de mapas. Por isso o que conta é: Perfil do Google completo e com avaliações, Bing Places, site com dados estruturados (feito), `llms.txt` (feito) e Instagram com o mesmo nome, endereço e telefone.

**Quando abrir para o Brasil:** os textos da descrição, dos serviços e do FAQ estão em `negocio.json` e `docs/google-meu-negocio.md`, prontos para copiar. O roteiro do Business Agent está em `docs/agentes-e-automacoes.md`.

## Passo 4: Consistência (NAP)

Em **todo lugar** (Google, Bing, Apple, Instagram, site, WhatsApp Business), use exatamente:

```
Espaço Joy
R. Estados Unidos, 295 - Jardim Americano, Itaquaquecetuba - SP, 08598-770
(11) 91107-8055
```

## Pendências para completar o SEO

- [x] Nome oficial definido: **Espaço Joy** (mesmo nome do logo)
- [ ] Horário de funcionamento
- [ ] Preços e duração dos serviços
- [ ] Domínio próprio (ex.: espacojoyce.com.br): melhora a confiança e a memorização. Se comprar, trocar `espaco-joyce.vercel.app` em: `index.html` (canonical, og, JSON-LD), `llms.txt`, `negocio.json`, `robots.txt` e `sitemap.xml`
- [ ] Coordenadas exatas: hoje estão no nível da rua (-23.4719, -46.3266). Abra o Google Maps, clique com o botão direito no imóvel e copie os números
- [ ] Bio do Instagram com o link do site
