import { pcDoFafaParser, tjGamingParser, ofertasAdrenalineParser, skandarSouzaPromocoesParser, promocoesDoTecParser } from "./parsers"
import { MessageTextParser } from "./parser-engine"

export const defaultParser = new MessageTextParser()

defaultParser.register(pcDoFafaParser)
defaultParser.register(tjGamingParser)
defaultParser.register(ofertasAdrenalineParser)
defaultParser.register(skandarSouzaPromocoesParser)
defaultParser.register(promocoesDoTecParser)

export { MessageTextParser }
