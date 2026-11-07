import { describe, expect, it } from "vitest"

import {
    ofertasAdrenalineParser,
    pcDoFafaParser,
    promocoesDoTecParser,
    skandarSouzaPromocoesParser,
    tjGamingParser,
} from "../src/parsers"

const URL = "https://example.com/oferta"

describe("pcDoFafaParser", () => {
    const text = `👌 Apple iPhone 13 128GB\n💲 Valor: R$ 3.049,00\n👀 ${URL}`

    it("canParse by channel id or by text markers", () => {
        expect(pcDoFafaParser.canParse("qualquer", { channelId: pcDoFafaParser.meta!.telegramChannelId })).toBe(true)
        expect(pcDoFafaParser.canParse("qualquer", { channelId: "outro" })).toBe(false)
        expect(pcDoFafaParser.canParse(text)).toBe(true)
        expect(pcDoFafaParser.canParse("sem marcadores")).toBe(false)
    })

    it("parses an offer", () => {
        expect(pcDoFafaParser.parse(text)).toEqual({
            title: "Apple iPhone 13 128GB",
            price: { value: 3049000, oldValue: null, currency: "BRL" },
            url: URL,
            coupons: null,
        })
    })

    it("returns null when a field is missing", () => {
        expect(pcDoFafaParser.parse(`💲 Valor: R$ 10\n👀 ${URL}`)).toBeNull()
    })
})

describe("tjGamingParser", () => {
    const text = `🔥 SSD NVMe 1TB\n💵 R$ 314,90\n${URL}`

    it("canParse by channel id or by text markers", () => {
        expect(tjGamingParser.canParse("qualquer", { channelId: tjGamingParser.meta!.telegramChannelId })).toBe(true)
        expect(tjGamingParser.canParse(text)).toBe(true)
        expect(tjGamingParser.canParse("sem marcadores")).toBe(false)
    })

    it("parses an offer", () => {
        expect(tjGamingParser.parse(text)).toMatchObject({
            title: "SSD NVMe 1TB",
            price: { value: 314900 },
            url: URL,
        })
    })

    it("returns null when a field is missing", () => {
        expect(tjGamingParser.parse("🔥 SSD NVMe 1TB\n💵 R$ 314,90")).toBeNull()
    })
})

describe("skandarSouzaPromocoesParser", () => {
    it("canParse by channel id or by price+url", () => {
        expect(
            skandarSouzaPromocoesParser.canParse("x", {
                channelId: skandarSouzaPromocoesParser.meta!.telegramChannelId,
            }),
        ).toBe(true)
        expect(skandarSouzaPromocoesParser.canParse(`Produto R$ 10 ${URL}`)).toBe(true)
        expect(skandarSouzaPromocoesParser.canParse("Produto sem nada")).toBe(false)
    })

    it("parses an offer with coupons", () => {
        expect(skandarSouzaPromocoesParser.parse(`🔥 Mouse Gamer 🔥\n💰 R$ 99,90\nCupom: MOUSE10\n${URL}`)).toEqual({
            title: "Mouse Gamer",
            price: { value: 99900, oldValue: null, currency: "BRL" },
            url: URL,
            coupons: ["MOUSE10"],
        })
    })

    it("returns null when a field is missing", () => {
        expect(skandarSouzaPromocoesParser.parse("")).toBeNull()
        expect(skandarSouzaPromocoesParser.parse(`Mouse Gamer\n${URL}`)).toBeNull()
    })
})

describe("ofertasAdrenalineParser", () => {
    it("canParse by channel id or by 'por R$'", () => {
        expect(
            ofertasAdrenalineParser.canParse("x", { channelId: ofertasAdrenalineParser.meta!.telegramChannelId }),
        ).toBe(true)
        expect(ofertasAdrenalineParser.canParse("Notebook por R$ 3.000")).toBe(true)
        expect(ofertasAdrenalineParser.canParse("Notebook caro")).toBe(false)
    })

    it("parses the 'Compre aqui' link", () => {
        expect(ofertasAdrenalineParser.parse(`Notebook por R$ 3.000\nCompre aqui: ${URL}`)).toMatchObject({
            title: "Notebook",
            price: { value: 3000000 },
            url: URL,
        })
    })

    it("falls back to the first link", () => {
        expect(ofertasAdrenalineParser.parse(`Notebook por R$ 3.000\n${URL}`)).toMatchObject({ url: URL })
    })

    it("returns null when a field is missing", () => {
        expect(ofertasAdrenalineParser.parse("Notebook por R$ 3.000")).toBeNull()
    })
})

describe("promocoesDoTecParser", () => {
    it("canParse by channel id or by content", () => {
        expect(promocoesDoTecParser.canParse("x", { channelId: promocoesDoTecParser.meta!.telegramChannelId })).toBe(
            true,
        )
        expect(promocoesDoTecParser.canParse("Resgate aqui o cupom")).toBe(false)
        expect(promocoesDoTecParser.canParse("Resgate aqui 💲 R$ 10")).toBe(true)
        expect(promocoesDoTecParser.canParse("Texto qualquer")).toBe(true)
    })

    it("parses an offer", () => {
        expect(promocoesDoTecParser.parse(`🚨 Teclado Mecânico\n💲 R$ 250,00\nCupom: TECLA10\n${URL}`)).toEqual({
            title: "Teclado Mecânico",
            price: { value: 250000, currency: "BRL", oldValue: null },
            url: URL,
            coupons: ["TECLA10"],
        })
    })

    it("returns null when a field is missing", () => {
        expect(promocoesDoTecParser.parse("  \n ")).toBeNull()
        expect(promocoesDoTecParser.parse(`🚨 Teclado\n${URL}`)).toBeNull()
    })
})
