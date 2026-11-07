import { describe, expect, it } from "vitest"

import { MessageTextParser, defaultParser } from "../src"
import type { OfferParser } from "../src/interfaces"

const offer = {
    title: "Produto bom",
    price: { value: 10, oldValue: null, currency: "BRL" as const },
    url: "https://example.com/p",
    coupons: null,
}

const makeParser = (overrides: Partial<OfferParser>): OfferParser => ({
    name: "fake",
    canParse: () => true,
    parse: () => offer,
    ...overrides,
})

describe("MessageTextParser", () => {
    it("returns null without parsers", () => {
        expect(new MessageTextParser().parse("texto")).toBeNull()
    })

    it("returns null for coupon-only messages", () => {
        const engine = new MessageTextParser()
        engine.register(makeParser({}))

        expect(engine.parse("Cupom Aliexpress!!\n\nR$100 OFF em R$500 - VAIBRASIL1X0")).toBeNull()
    })

    it("skips parsers that cannot parse, return null or return invalid offers", () => {
        const engine = new MessageTextParser()
        engine.register(makeParser({ canParse: () => false }))
        engine.register(makeParser({ parse: () => null }))
        engine.register(makeParser({ parse: () => ({ ...offer, title: "x" }) }))
        engine.register(makeParser({ name: "good" }))

        expect(engine.parse("Produto R$ 10")).toEqual(offer)
    })

    it("returns null when no parser yields a valid offer", () => {
        const engine = new MessageTextParser()
        engine.register(makeParser({ parse: () => ({ ...offer, url: "nao-e-url" }) }))

        expect(engine.parse("Produto R$ 10")).toBeNull()
    })

    it("forwards the context to the parsers", () => {
        const engine = new MessageTextParser()
        const seen: unknown[] = []
        engine.register(
            makeParser({
                canParse: (_text, context) => {
                    seen.push(context)
                    return true
                },
            }),
        )

        engine.parse("Produto R$ 10", { channelId: "123" })

        expect(seen).toEqual([{ channelId: "123" }])
    })

    it("defaultParser parses a known channel message", () => {
        expect(
            defaultParser.parse("👌 Apple iPhone 13 128GB\n💲 Valor: R$ 3.049,00\n👀 https://example.com/p"),
        ).toMatchObject({
            title: "Apple iPhone 13 128GB",
        })
    })
})
