import { describe, expect, it } from "vitest"

import { defaultParser } from "../src"
import { extractCoupons, isCouponOnly, removeEmojis } from "../src/utils"

describe("mensagens só de cupom são descartadas", () => {
    it.each([
        ["cabeçalho de cupom", "🙀 Cupom Aliexpress!!🙀\n\n💲R$100 OFF em R$500 - VAIBRASIL1X0\n\n👀https://s.click.aliexpress.com/e/_abc"],
        ["cupom da Shopee", "CUPOM SHOPEE\n\n💰 R$20 OFF em R$70 💰\n🏷 D3ZPLUS8SH8\n\n➡️ Resgate o cupom aqui:https://s.shopee.com.br/abc"],
        ["cupom percentual", "🔥 Novo Cupom Amazon de 10% OFF\n\n🏷 Cupom: AMZ10\n👀 https://amzn.to/abc"],
        ["lista de cupons", "Listão De Cupons\n\n1. FAFA10\n2. FAFA25\n\n👀https://s.click.aliexpress.com/e/_abc"],
    ])("%s", (_, text) => {
        expect(isCouponOnly(text)).toBe(true)
        expect(defaultParser.parse(text)).toBeNull()
    })

    it.each([
        ["produto com cupom", "👌 Apple iPhone 13 128GB\n💲 Valor: R$ 3.049,00\nUse o cupom IPHONE10\n👀 https://s.click.aliexpress.com/e/_abc"],
        ["cabeçalho de cupom + produto", "CUPOM KABUM MEMÓRIA RAM CORRE\n\n🔥 Memoria RAM Kingston Fury 8GB\n\n💰 R$ 216\n📝 Cupom: DRAMOFF15\n\nhttps://www.kabum.com.br/produto/1"],
        ["código com OFF no nome", "Memória RAM 16GB\nPOR: R$ 248\nUSE O CUPOM: CODE50OFF\nhttps://s.click.aliexpress.com/e/_abc"],
    ])("mantém: %s", (_, text) => {
        expect(isCouponOnly(text)).toBe(false)
    })
})

describe("extractCoupons", () => {
    it("ignora palavras que não são códigos", () => {
        expect(extractCoupons("Cupom Primeira Compra: ISKANDAR6")).toEqual(["ISKANDAR6"])
        expect(extractCoupons("Cupom: cupom da loja")).toBeNull()
        expect(extractCoupons("Resgate o cupom aqui: https://x.com")).toBeNull()
    })

    it("nunca trata link como cupom", () => {
        expect(extractCoupons("Desconto: Cupom da loja\nhttps://s.click.aliexpress.com/e/_abc")).toBeNull()
        expect(extractCoupons("Cupom da loja\n\nLink para compra: https://x.com")).toBeNull()
        expect(extractCoupons("Cupom: https://s.click.aliexpress.com/e/_abc")).toBeNull()
        expect(extractCoupons("Cupom\nTJGAMING")).toBeNull()
    })
})

describe("removeEmojis", () => {
    it("preserva dígitos", () => {
        expect(removeEmojis("🔥 Mouse Motospeed V40 🔥")).toBe(" Mouse Motospeed V40 ")
        expect(removeEmojis("Ryzen 5 5600X 🇧🇷")).toBe("Ryzen 5 5600X ")
    })
})

describe("isCouponOnly edge cases", () => {
    it("returns false for empty text", () => {
        expect(isCouponOnly("")).toBe(false)
        expect(isCouponOnly("  \n ")).toBe(false)
    })
})
