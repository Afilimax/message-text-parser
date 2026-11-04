import {
    ofertasAdrenalineParser,
    pcDoFafaParser,
    promocoesDoTecParser,
    skandarSouzaPromocoesParser,
    tjGamingParser,
} from "../src/parsers"
import { parseBrl } from "../src/utils"

describe("parseBrl", () => {
    it.each([
        ["3.049,00", 3049],
        ["314,90", 314.9],
        ["1.234.567,89", 1234567.89],
        ["89", 89],
        [" 1.299,00 ", 1299],
    ])("converte %s em reais", (input, expected) => {
        expect(parseBrl(input)).toBe(expected)
    })
})

describe("preço das ofertas multiplicado por 1000", () => {
    it.each([
        [
            "PC do Fafa",
            pcDoFafaParser,
            "👌 Apple iPhone 13 128GB\n💲 Valor: R$ 3.049,00\n👀 https://s.click.aliexpress.com/e/_abc",
            3049000,
        ],
        ["TJ Gaming", tjGamingParser, "🔥 SSD NVMe 1TB\n💵 R$ 314,90\nhttps://s.click.aliexpress.com/e/_abc", 314900],
        [
            "Ofertas Adrenaline",
            ofertasAdrenalineParser,
            "Teclado Gamer por R$ 149,00\nCompre aqui: https://amzn.to/abc",
            149000,
        ],
        [
            "Iskandar Souza",
            skandarSouzaPromocoesParser,
            "🔥 Mouse Logitech G203\n💰 R$ 89,90\nhttps://shopee.com.br/produto",
            89900,
        ],
        ["Promoções do Tec", promocoesDoTecParser, "🚨 Monitor LG 27\n💲 R$ 1.299,00\nhttps://meli.la/abc", 1299000],
    ])("%s", (_, parser, message, expected) => {
        expect(parser.parse(message)?.price.value).toBe(expected)
    })
})
