import { collapseWhiteSpaces, extractCoupons, parseBrl, removeEmojis } from "../utils"
import { OfferParser, TelegramParserMeta } from "../interfaces"

export const skandarSouzaPromocoesParser: OfferParser<TelegramParserMeta> = {
    name: "skandar-souza-promocoes",
    meta: {
        telegramChannelId: "-1001182556721",
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        return /R?\$\s*[\d.,]+/.test(text) && /https?:\/\/\S+/.test(text)
    },
    parse(text) {
        const titleMatch = text.match(/^(?:🔥)?\s*(.+?)(?:🔥)?\s*(?:\n|$)/m)

        const priceMatch = text.match(/(?:💰|💸|por|Valor:)\s*(?:R\$)?\s*([\d.,]+)/i)

        const urlMatch = text.match(/https?:\/\/[^\s]+/)

        if (!titleMatch || !priceMatch || !urlMatch) return null

        const title = collapseWhiteSpaces(removeEmojis(titleMatch[1]))
        const priceValue = parseBrl(priceMatch[1])
        const coupons = extractCoupons(text)

        return {
            title: title,
            price: {
                value: priceValue * 1000,
                oldValue: null,
                currency: "BRL",
            },
            url: urlMatch[0],
            coupons: coupons,
        }
    },
}
