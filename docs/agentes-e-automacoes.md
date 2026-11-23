# Base para agentes de IA e automações

## Fonte única de dados

**`negocio.json`** (publicado em `https://espaco-joyce.vercel.app/negocio.json`, com CORS liberado) é a fonte oficial de serviços, preços, horários, endereço e políticas. Qualquer agente ou automação deve **ler desse arquivo** em vez de ter os dados copiados dentro dele. Assim, ao mudar um preço, tudo se atualiza junto.

- `llms.txt`: resumo em texto para IAs.
- `index.html` → bloco `application/ld+json`: os mesmos dados no padrão Schema.org.

## Ideias de automação (em ordem de impacto)

1. **Atendente no WhatsApp** (WhatsApp Business API, ou ferramentas como n8n, Make, Z-API ou Evolution API + LLM)
   - Responde preço, endereço, diferença entre técnicas e cuidados, lendo o `negocio.json`
   - Coleta nome, serviço e dia preferido, e passa para a Joyce confirmar
2. **Pedido de avaliação automático**: X horas depois do atendimento, manda a mensagem do `docs/google-meu-negocio.md` (item 6)
3. **Lembrete de retorno**: henna e design costumam ter manutenção periódica. Lembrar a cliente quando estiver na hora (Joyce define o intervalo)
4. **Confirmação na véspera** para reduzir faltas
5. **Business Agent no ChatGPT**, quando o Businesses in ChatGPT abrir para negócios locais no Brasil (ver `docs/chatgpt-e-ias.md`)

## Prompt base para qualquer agente (copiar e colar)

```
Você é a assistente virtual do Espaço Joy, estúdio de design de sobrancelhas da Joyce Duarte em Itaquaquecetuba (SP).

DADOS OFICIAIS: use somente as informações do JSON abaixo (negocio.json). Se algo não estiver lá
(ou estiver null), diga que vai confirmar com a Joyce. Nunca invente preço, horário ou disponibilidade.

{{conteúdo de https://espaco-joyce.vercel.app/negocio.json}}

TOM: acolhedor, próximo e direto, como a Joyce fala no WhatsApp. Mensagens curtas. Português do Brasil.

OBJETIVO: tirar dúvidas e levar a pessoa a agendar. Para agendar, colete: nome, serviço e melhores dias e horários.
Depois diga que a Joyce vai confirmar o horário.

LIMITES:
- Não dê diagnóstico de saúde. Se a cliente citar alergia, gestação, tratamento de pele ou uso de
  medicamentos, diga que a Joyce vai avaliar antes de fazer henna ou micropigmentação.
- Não peça documentos, senhas nem dados de cartão.
- Dados pessoais da conversa só servem para o agendamento (LGPD, ver /privacidade).
```

## Regras de segurança para automações

- Chaves de API **nunca** no repositório nem no site. Use as variáveis de ambiente da ferramenta (n8n, Vercel etc.).
- O `negocio.json` é público: não colocar nele nada privado (CPF, dados de clientes, telefone pessoal diferente do comercial).
- Lista de clientes e históricos ficam em uma ferramenta com login (planilha privada, CRM), nunca no site.
