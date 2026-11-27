<a href="https://afilimax.net"><img src="https://raw.githubusercontent.com/Afilimax/.github/main/assets/npm-banner.svg" alt="Afilimax — Encontre a oferta. Gere o link. Divulgue sozinho." width="100%" /></a>

[![npm version](https://img.shields.io/npm/v/%40afilimax%2Fmessage-text-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-parser)
[![npm downloads](https://img.shields.io/npm/dm/%40afilimax%2Fmessage-text-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Afilimax/message-text-parser/blob/HEAD/LICENSE)
[![Website](https://img.shields.io/badge/website-afilimax.net-7857FF)](https://afilimax.net)

# @afilimax/message-text-parser

Esta é uma biblioteca focada em extrair dados de mensagens de ofertas enviadas por canais do Telegram brasileiros.

## Instalação

```bash
npm install @afilimax/message-text-parser
```

## Uso

```typescript
import { defaultParser } from "@afilimax/message-text-parser"

const offer = defaultParser.parse(`Tênis Charged Starlight Se Under Armour

💲R$ 158,99
💳 Em 6x Sem Juros
🎟 Cupom: CARNAVAL40

🔗https://mercadolivre.com/sec/2yaVLgw`) // Offer | null

console.log(offer) /* {
  title: 'Tênis Charged Starlight Se Under Armour',
  price: { value: 158990, oldValue: null, currency: 'BRL' },
  url: 'https://mercadolivre.com/sec/2yaVLgw',
  coupons: [ 'CARNAVAL40' ]
} */
```

## Canais suportados intencionalmente

- [PC DO FAFA PROMOÇÕES](https://t.me/pcdofafapromo)
- [TJ Gaming](https://t.me/TJGOFERTASs)
- [Ofertas Adrenaline](https://t.me/ofertasadrenaline)
- [Iskandar Souza - Promoções](https://t.me/IskandarSouza)
- [Promocoes Do Tec](https://t.me/tecnoinffo)

> Pode haver suporte a outros canais pelo fato do padrão de mensagens ser o mesmo, mas não são suportados intencionalmente. Se estiver interessado em adicionar suporte a um canal, abra um issue ou envie uma pull request com um parser implementado.

## Como criar seu próprio parser e registrá-lo

```typescript
import { OfferParser } from "@afilimax/message-text-parser"

const myParser: OfferParser<TelegramParserMeta> = {
    name: "meu-parser",
    meta: {
        telegramChannelId: "TELEGRAM_CHAT_ID", // serve para que se você, no ato de parsing, enviar o channelId, ele vai mais facilmente identificar o parser correto por conta da condicional em `canParse`
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        return false
    },
    parse(text: string) {
        return null
    }
}
```

Depois de criar o parser, basta registrá-lo no parser principal:

```typescript
import { defaultParser } from "@afilimax/message-text-parser"

defaultParser.register(myParser)
```

Ou um parser novo:

```typescript
import { MessageTextParser } from "@afilimax/message-text-parser"

const parser = new MessageTextParser()

parser.register(myParser)
```

## Contribuindo

Se você quiser contribuir para o projeto, abra um issue ou envie uma pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
---

## Automatize sua operação de afiliados

> Use este pacote para automatizar sua operação de afiliados. Conheça a plataforma Afilimax e transforme ofertas em links e divulgação automática.

[Conheça a Afilimax](https://afilimax.net) · [Pacote no npm](https://www.npmjs.com/package/@afilimax/message-text-parser) · [Repositório no GitHub](https://github.com/Afilimax/message-text-parser)
