import { ParseContext } from "./parse-contex.interface"
import { Offer } from "../schemas"

export interface OfferParser<T = any> {
    name: string
    meta?: T
    canParse(text: string, context?: ParseContext): boolean
    parse(text: string, context?: ParseContext): Offer | null
}
