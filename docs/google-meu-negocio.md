# Google Meu Negócio (Perfil da Empresa no Google): pronto para copiar

Cadastro em: https://business.google.com → "Adicionar empresa".
**Regra de ouro:** nome, endereço e telefone devem ser **idênticos** no Google, no site, no Instagram e no `negocio.json`.

## 1. Dados básicos

| Campo | Preencher com |
|---|---|
| Nome da empresa | **Espaço Joy** (igual ao logo; use exatamente assim em todo lugar) |
| Categoria principal | Digite "sobrancelha" e escolha a opção específica que aparecer (ex.: estúdio/designer de sobrancelhas) |
| Categorias secundárias | Micropigmentação · Salão de beleza (só as que o Google listar) |
| Tem local físico que clientes visitam? | Sim |
| Endereço | R. Estados Unidos, 295, Jardim Americano, Itaquaquecetuba, SP, 08598-770 |
| Área de atendimento | (opcional) Itaquaquecetuba, Poá, Suzano, Arujá, Ferraz de Vasconcelos: **só se ela atender clientes dessas cidades** |
| Telefone | (11) 91107-8055 |
| Site | `https://espaco-joyce.vercel.app/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Link de agendamento | `https://wa.me/5511911078055?text=Ol%C3%A1%20Joyce!%20Vi%20no%20Google%20e%20quero%20agendar.` |
| Horário de funcionamento | **PREENCHER** (e copiar também no `negocio.json`) |

O parâmetro `utm` no link do site mostra, nas métricas, quantas visitas vieram do Google Meu Negócio.

## 2. Descrição (até 750 caracteres)

> O Espaço Joy é o estúdio da designer de sobrancelhas Joyce Duarte, em Itaquaquecetuba (SP). Cada sobrancelha é desenhada a partir das proporções do seu rosto, com medição, escolha da técnica e acabamento feitos com calma, para um resultado natural e que é a sua cara. Serviços: design de sobrancelhas, design com henna, brow lamination e micropigmentação de sobrancelhas. Atendimento individual em uma sala reservada e confortável no Jardim Americano. Veja o catálogo com os valores no site e agende pelo WhatsApp (11) 91107-8055.

## 3. Serviços (aba "Serviços")

Copiar nome e descrição do `negocio.json` → `servicos`. Colocar o preço quando ela definir.

- Design de sobrancelhas: medição e desenho pensados para as proporções do rosto.
- Design com henna: cor e preenchimento sob medida, sem efeito "carimbo".
- Brow lamination: fios alinhados e com efeito volumoso, prontos todos os dias.
- Micropigmentação de sobrancelhas: definição, simetria e naturalidade com resultado duradouro.

## 4. Fotos (o que mais pesa para aparecer no mapa)

- [ ] Logo: `assets/brand/icon-512.png`
- [ ] Capa: `assets/brand/og.jpg`
- [ ] Fachada **de fora** (ajuda o cliente a achar e o Google a confirmar o endereço)
- [ ] Sala de atendimento: `assets/web/studio.webp`
- [ ] Joyce trabalhando: `assets/web/joyce-1.webp`, `joyce-2.webp`
- [ ] Antes e depois (**só com autorização da cliente**)
- [ ] Rotina: subir 2 ou 3 fotos novas por semana nos primeiros meses

## 5. Verificação

O Google pode pedir um vídeo mostrando a fachada, a placa ou o material com o nome, o ambiente de trabalho e um documento ou conta que comprove o negócio. Deixe isso preparado antes de começar.

## 6. Avaliações (é o que mais faz subir no Google Maps)

- Depois de verificado, copie o link "Pedir avaliações" no painel.
- Mensagem pronta para mandar no WhatsApp depois do atendimento:

> Oi, [nome]! Obrigada por vir ao Espaço Joy 💚 Se gostou do resultado, me ajuda muito deixar uma avaliação rapidinha no Google: [link]. Se puder, conta qual serviço você fez!

- Responder **todas** as avaliações, citando o serviço e a cidade (ex.: "Que bom que gostou da brow lamination! Te espero aqui em Itaquá").

## 7. Postagens (aba "Novidades")

Publicar 1 vez por semana: foto de resultado + 1 frase + botão "Agendar" (link do WhatsApp).

## 8. Depois de verificar

- [ ] Colocar o link do perfil do Google em `negocio.json` (`contato`) e no `sameAs` dos dados estruturados do `index.html`
- [ ] Cadastrar o mesmo perfil no **Bing Places** (https://www.bingplaces.com): dá para importar direto do Google. O Bing é uma das fontes das buscas com IA.
- [ ] Cadastrar no **Apple Business Connect** (https://businessconnect.apple.com) para aparecer no Mapas do iPhone e na Siri
- [ ] Enviar o site no **Google Search Console** (veja `docs/chatgpt-e-ias.md`, passo 1)
