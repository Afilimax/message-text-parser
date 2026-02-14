import { OfferParser, TelegramParserMeta } from "../interfaces"
import { collapseWhiteSpaces, extractCoupons, parseBrl, removeEmojis } from "../utils"

export const tjGamingParser: OfferParser<TelegramParserMeta> = {
    name: "tj-gaming",
    meta: {
        telegramChannelId: "-1001610005189",
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        return text.includes("🔥") && text.includes("💵")
    },
    parse(text) {
        const titleMatch = text.match(/^🔥\s*(.*?)\s*(?:\n|$)/m)
        const priceMatch = text.match(/💵\s*R\$?\s*([\d.,]+)/)
        const urlMatch = text.match(/https?:\/\/[^\s]+/)

        if (!titleMatch || !priceMatch || !urlMatch) return null

        return {
            title: collapseWhiteSpaces(removeEmojis(titleMatch[1])),
            price: {
                value: parseBrl(priceMatch[1]) * 1000,
                oldValue: null,
                currency: "BRL",
            },
            url: urlMatch[0],
            coupons: extractCoupons(text),
        }
    },
}
