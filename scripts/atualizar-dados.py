"""
Atualiza os dados estruturados (JSON-LD) do index.html a partir do negocio.json
e das perguntas da seção "Dúvidas frequentes".

Uso (na pasta do projeto):  python scripts/atualizar-dados.py

Fluxo ao mudar preço, tempo ou serviço:
  1. edite o negocio.json
  2. edite o catálogo e o FAQ no index.html (texto visível)
  3. rode este script
  4. confira o llms.txt
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
URL = 'https://espaco-joyce.vercel.app'

neg = json.loads((RAIZ / 'negocio.json').read_text(encoding='utf-8'))
html = (RAIZ / 'index.html').read_text(encoding='utf-8')

limpa = lambda s: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s)).strip()
# o que está com "hidden" no HTML (serviço oculto) não entra nos dados estruturados
visivel = re.sub(r'<(span|details) hidden>.*?</\1>', '', html, flags=re.S)
faq = re.findall(r'<summary>(.*?)</summary>\s*<p class="ans">(.*?)</p>', visivel, re.S)
end = neg['endereco']
ig = neg['contato']['instagram']


def oferta(s):
    servico = {'@type': 'Service', 'name': s['nome'], 'description': s['descricao'], 'provider': {'@id': URL + '/#negocio'}}
    o = {'@type': 'Offer', 'itemOffered': servico}
    if s.get('preco_brl') is not None:
        o.update(price=f"{s['preco_brl']:.2f}", priceCurrency='BRL')
    elif s.get('preco_min_brl') is not None:
        o['priceSpecification'] = {'@type': 'PriceSpecification', 'priceCurrency': 'BRL',
                                   'minPrice': f"{s['preco_min_brl']:.2f}", 'maxPrice': f"{s['preco_max_brl']:.2f}"}
    return o


negocio = {
    '@type': 'BeautySalon', '@id': URL + '/#negocio',
    'name': neg['nome'], 'alternateName': neg['nomes_alternativos'],
    'description': neg['descricao'],
    'url': URL + '/',
    'image': [URL + '/assets/brand/og.jpg', URL + '/assets/web/studio.webp', URL + '/assets/web/joyce-1.webp'],
    'logo': URL + '/assets/brand/icon-512.png',
    'telephone': '+55-11-91107-8055',
    'address': {'@type': 'PostalAddress', 'streetAddress': f"{end['logradouro']} - {end['bairro']}",
                'addressLocality': end['cidade'], 'addressRegion': end['estado'],
                'postalCode': end['cep'], 'addressCountry': end['pais']},
    'geo': {'@type': 'GeoCoordinates', 'latitude': end['latitude'], 'longitude': end['longitude']},
    'hasMap': end['mapa'],
    'areaServed': {'@type': 'City', 'name': end['cidade']},
    'sameAs': [ig] + ([neg['contato']['google']] if neg['contato'].get('google') else []),
    'founder': {'@id': URL + '/#joyce'}, 'employee': {'@id': URL + '/#joyce'},
    'knowsAbout': ['design de sobrancelhas', 'visagismo', 'henna para sobrancelhas', 'limpeza de pele'],
    'currenciesAccepted': 'BRL',
    'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Catálogo de serviços', 'itemListElement': [oferta(s) for s in neg['servicos']]},
    'potentialAction': {'@type': 'ReserveAction', 'name': 'Agendar pelo WhatsApp',
                        'target': {'@type': 'EntryPoint', 'urlTemplate': neg['contato']['whatsapp_link'],
                                   'actionPlatform': ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform']}},
}
precos = [v for s in neg['servicos'] for v in (s.get('preco_brl'), s.get('preco_min_brl'), s.get('preco_max_brl')) if v is not None]
if precos:
    negocio['priceRange'] = f"R$ {min(precos):.0f} - R$ {max(precos):.0f}"

dias = {'segunda': 'Monday', 'terca': 'Tuesday', 'quarta': 'Wednesday', 'quinta': 'Thursday', 'sexta': 'Friday', 'sabado': 'Saturday', 'domingo': 'Sunday'}
horas = [{'@type': 'OpeningHoursSpecification', 'dayOfWeek': en, 'opens': v.split('-')[0], 'closes': v.split('-')[1]}
         for pt, en in dias.items() if (v := neg['horarios'].get(pt))]
if horas:
    negocio['openingHoursSpecification'] = horas

grafo = [
    negocio,
    {'@type': 'Person', '@id': URL + '/#joyce', 'name': neg['profissional']['nome'], 'jobTitle': neg['profissional']['funcao'],
     'image': URL + '/assets/web/joyce-2.webp', 'worksFor': {'@id': URL + '/#negocio'}, 'sameAs': [ig]},
    {'@type': 'WebSite', '@id': URL + '/#site', 'url': URL + '/', 'name': neg['nome'], 'inLanguage': 'pt-BR', 'publisher': {'@id': URL + '/#negocio'}},
    {'@type': 'WebPage', '@id': URL + '/#pagina', 'url': URL + '/', 'name': limpa(re.search(r'<title>(.*?)</title>', html).group(1)),
     'isPartOf': {'@id': URL + '/#site'}, 'about': {'@id': URL + '/#negocio'}, 'primaryImageOfPage': URL + '/assets/brand/og.jpg', 'inLanguage': 'pt-BR'},
    {'@type': 'FAQPage', '@id': URL + '/#duvidas',
     'mainEntity': [{'@type': 'Question', 'name': limpa(q), 'acceptedAnswer': {'@type': 'Answer', 'text': limpa(a)}} for q, a in faq]},
]

ld = json.dumps({'@context': 'https://schema.org', '@graph': grafo}, ensure_ascii=False, indent=1)
novo, n = re.subn(r'(<script type="application/ld\+json">\n).*?(\n</script>)', lambda m: m.group(1) + ld + m.group(2), html, flags=re.S)
assert n == 1, 'bloco application/ld+json não encontrado no index.html'
(RAIZ / 'index.html').write_text(novo, encoding='utf-8', newline='\n')
print(f'JSON-LD atualizado: {len(neg["servicos"])} serviços, {len(faq)} perguntas, faixa de preço {negocio.get("priceRange", "-")}')
