import { collapseWhiteSpaces, extractCoupons, parseBrl, removeEmojis } from "../utils"
import { OfferParser, TelegramParserMeta } from "../interfaces"

export const pcDoFafaParser: OfferParser<TelegramParserMeta> = {
    name: "pc-do-fafa",
    meta: {
        telegramChannelId: "-1001622757657",
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        return text.includes("💲") && text.includes("👀")
    },
    parse(text) {
        const titleMatch = text.match(/^👌\s*(.*?)(?:\n|$)/m)
        const priceMatch = text.match(/💲\s*Valor\s*:\s*R\$\s*([\d.,]+)/)
        const urlMatch = text.match(/👀\s*(https?:\/\/[^\s]+)/)

        if (!titleMatch || !priceMatch || !urlMatch) return null

        return {
            title: collapseWhiteSpaces(removeEmojis(titleMatch[1])),
            price: {
                value: parseBrl(priceMatch[1]) * 1000,
                oldValue: null,
                currency: "BRL",
            },
            url: urlMatch[1],
            coupons: extractCoupons(text),
        }
    },
}
