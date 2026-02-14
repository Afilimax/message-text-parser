import { ParseContext } from "./interfaces/parse-contex.interface"
import { OfferParser } from "./interfaces/offer-parser.interface"
import { Offer, offerSchema } from "./schemas"

export class MessageTextParser {
    private readonly parsers: OfferParser[] = []

    register(parser: OfferParser) {
        this.parsers.push(parser)
    }

    parse(text: string, context?: ParseContext): Offer | null {
        for (const parser of this.parsers) {
            if (!parser.canParse(text, context)) continue

            const result = parser.parse(text, context)
            
            if (!result) continue

            const validated = offerSchema.safeParse(result)

            if (validated.success) {
                return validated.data
            }
        }

        return null
    }
}
