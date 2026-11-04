import { collapseWhiteSpaces, extractCoupons, parseBrl, removeEmojis } from "../utils"
import { OfferParser, TelegramParserMeta } from "../interfaces"

export const ofertasAdrenalineParser: OfferParser<TelegramParserMeta> = {
    name: "ofertas-adrenaline",
    meta: {
        telegramChannelId: "-1001501035980",
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        return /por\s+R\$\s*[\d.,]+/i.test(text)
    },
    parse(text) {
        const titlePriceMatch = text.match(/^(.*?)\s+por\s+R\$\s*([\d.,]+)/im)

        const urlMatch = text.match(/Compre\s+aqui:\s*(https?:\/\/[^\s]+)/i) || text.match(/https?:\/\/[^\s]+/)

        if (!titlePriceMatch || !urlMatch) return null

        const title = collapseWhiteSpaces(removeEmojis(titlePriceMatch[1]))
        const priceValue = parseBrl(titlePriceMatch[2])
        const coupons = extractCoupons(text)

        return {
            title: title,
            price: {
                value: priceValue * 1000,
                oldValue: null,
                currency: "BRL",
            },
            url: urlMatch[1] || urlMatch[0],
            coupons: coupons,
        }
    },
}
