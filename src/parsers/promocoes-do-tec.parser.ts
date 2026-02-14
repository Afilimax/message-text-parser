import { OfferParser, TelegramParserMeta } from "../interfaces"
import { collapseWhiteSpaces, extractCoupons, parseBrl, removeEmojis } from "../utils"

export const promocoesDoTecParser: OfferParser<TelegramParserMeta> = {
    name: "promocoes-do-tec",
    meta: {
        telegramChannelId: "-1001184851880",
    },
    canParse(text, context) {
        if (context?.channelId && context.channelId === this.meta?.telegramChannelId) {
            return true
        }

        if (
            text.toLowerCase().includes("resgate aqui") &&
            !text.includes("💲")
        ) {
            return false
        }
        
        return true
    },
    parse(text: string) {
        const lines = text
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean)

        if (!lines.length) return null

        const title = lines[0]
            .replace(/^🚨\s*/g, "")
            .trim()

        const priceMatch = text.match(/💲\s*R\$\s*([\d.,]+)/i)
        const urlMatch = text.match(/https?:\/\/[^\s]+/i)

        if (!priceMatch || !urlMatch) return null

        const coupons = extractCoupons(text)


        return {
            title: collapseWhiteSpaces(removeEmojis(title)),
            price: {
                value: parseBrl(priceMatch[1]) * 1000,
                currency: "BRL",
                oldValue: null,
            },
            url: urlMatch[0],
            coupons: coupons,
        }
    }
}