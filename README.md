<a href="https://afilimax.net"><img src="https://raw.githubusercontent.com/Afilimax/.github/main/assets/npm-banner.svg" alt="Afilimax — Encontre a oferta. Gere o link. Divulgue sozinho." width="100%" /></a>

[![npm version](https://img.shields.io/npm/v/%40afilimax%2Fmessage-text-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-parser)
[![npm downloads](https://img.shields.io/npm/dm/%40afilimax%2Fmessage-text-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Afilimax/message-text-parser/blob/HEAD/LICENSE)
[![Website](https://img.shields.io/badge/website-afilimax.net-7857FF)](https://afilimax.net)

# @afilimax/message-text-parser

Biblioteca TypeScript para extrair produtos, preços, URLs e cupons de mensagens de ofertas publicadas em canais brasileiros do Telegram. O pacote usa parsers específicos por formato e valida o resultado antes de devolvê-lo.

## Recursos

- Interpretação de mensagens de ofertas sem chamadas externas ou modelos de IA.
- Parsers dedicados para cinco canais brasileiros de promoções.
- Seleção pelo formato da mensagem ou pelo identificador do canal.
- Extração de título, preço, URL e códigos de cupom.
- Validação da oferta com Zod antes do retorno.
- Registro de parsers personalizados na instância global ou em uma instância isolada.
- Retorno `null` para mensagens que apenas divulgam cupons ou não possuem um formato reconhecido.

## Instalação

```bash
npm install @afilimax/message-text-parser
```

As declarações TypeScript estão incluídas no pacote.

## Como usar

Use `defaultParser` para aproveitar todos os parsers incluídos na biblioteca:

```typescript
import { defaultParser } from "@afilimax/message-text-parser"

const offer = defaultParser.parse(`🔥 Wireless Gaming Mouse

💵 R$ 158,99
🎟 Cupom: SAVE40

https://mercadolivre.com/sec/2yaVLgw`)

if (offer) {
    console.log("Product:", offer.title)
    console.log("Price:", offer.price.value, offer.price.currency)
    console.log("URL:", offer.url)
    console.log("Coupons:", offer.coupons)
} else {
    console.log("No supported offer found")
}
```

Também é possível informar o canal para ajudar na escolha do parser:

```typescript
const offer = defaultParser.parse(messageText, {
    channelId: "your-telegram-channel-id",
})
```

### Criar um parser personalizado

Registre um objeto com `name`, `canParse` e `parse`. O resultado de `parse` precisa respeitar o contrato da oferta:

```typescript
import { defaultParser } from "@afilimax/message-text-parser"

const supportedChannelId = "your-telegram-channel-id"

const customParser = {
    name: "custom-channel",
    meta: { telegramChannelId: supportedChannelId },
    canParse(text: string, context?: { channelId?: string }) {
        return context?.channelId === supportedChannelId || text.includes("CUSTOM DEAL")
    },
    parse(text: string) {
        const url = text.match(/https?:\/\/[^\s]+/)?.[0]

        if (!url) return null

        return {
            title: "Example Product",
            price: { value: 99.9, oldValue: null, currency: "BRL" as const },
            url,
            coupons: null,
        }
    },
}

defaultParser.register(customParser)
```

Para isolar os parsers personalizados dos parsers padrão, crie uma instância própria:

```typescript
import { MessageTextParser } from "@afilimax/message-text-parser"

const parser = new MessageTextParser()

parser.register(customParser)
const offer = parser.parse(messageText)
```

Uma instância criada com `new MessageTextParser()` começa sem parsers registrados.

## Configuração

A biblioteca não exige credenciais, variáveis de ambiente ou conexão com o Telegram. Ela processa somente o texto recebido e o contexto opcional.

| Campo do contexto | Tipo | Descrição |
| :--- | :--- | :--- |
| `channelId` | `string` | Identificador do canal usado pelos parsers que possuem metadados do Telegram. |

### Canais suportados intencionalmente

- [PC do Fafa Promoções](https://t.me/pcdofafapromo)
- [TJ Gaming](https://t.me/TJGOFERTASs)
- [Ofertas Adrenaline](https://t.me/ofertasadrenaline)
- [Iskandar Souza - Promoções](https://t.me/IskandarSouza)
- [Promoções do Tec](https://t.me/tecnoinffo)

Outros canais podem funcionar quando utilizam o mesmo formato de mensagem, mas não possuem suporte intencional. Para adicionar um formato, envie um parser com testes em uma pull request.

## Referência da API

O entrypoint público exporta apenas `defaultParser` e `MessageTextParser`.

### `defaultParser`

Instância compartilhada de `MessageTextParser` com os cinco parsers incluídos já registrados.

### `new MessageTextParser()`

Cria uma instância vazia para registrar parsers manualmente.

### `register(parser): void`

Adiciona um parser ao final da lista. A ordem de registro define a ordem das tentativas.

| Campo do parser | Tipo | Descrição |
| :--- | :--- | :--- |
| `name` | `string` | Identificador do parser. |
| `meta` | `unknown` | Metadados opcionais, como o canal do Telegram. |
| `canParse(text, context?)` | `boolean` | Indica se o parser reconhece a mensagem. |
| `parse(text, context?)` | `Offer \| null` | Extrai a oferta ou retorna `null`. |

### `parse(text, context?): Offer | null`

Ignora mensagens que contêm apenas cupons, percorre os parsers compatíveis e retorna o primeiro resultado válido. Resultados fora do schema são descartados.

| Campo de `Offer` | Tipo | Descrição |
| :--- | :--- | :--- |
| `title` | `string` | Título com pelo menos três caracteres. |
| `price.value` | `number` | Valor atual positivo. |
| `price.oldValue` | `number \| null` | Valor anterior positivo, quando disponível. |
| `price.currency` | `"BRL"` | Moeda da oferta. |
| `url` | `string` | URL válida do produto. |
| `coupons` | `string[] \| null` | Cupons encontrados ou `null`. |

## Desenvolvimento

Instale as dependências com `npm install`. Os scripts disponíveis são:

| Comando | Finalidade |
| :--- | :--- |
| `npm run dev` | Executa `src/index.ts` com `ts-node`. |
| `npm run build` | Compila o TypeScript para `dist/`. |
| `npm test` | Executa os testes uma vez com Vitest. |
| `npm run test:watch` | Executa os testes em modo de observação. |
| `npm run test:cov` | Executa os testes com cobertura. |
| `npm run lint` | Executa o ESLint com correção automática. |
| `npm run format` | Formata os arquivos de `src/` e `__tests__/` com Prettier. |

Os testes usam mensagens representativas dos canais suportados e não exigem acesso ao Telegram.

## Licença

Distribuído sob a licença [MIT](./LICENSE).

---

## Automatize sua operação de afiliados

> Use este pacote para automatizar sua operação de afiliados. Conheça a plataforma Afilimax e transforme ofertas em links e divulgação automática.

[Conheça a Afilimax](https://afilimax.net) · [Pacote no npm](https://www.npmjs.com/package/@afilimax/message-text-parser) · [Repositório no GitHub](https://github.com/Afilimax/message-text-parser)
