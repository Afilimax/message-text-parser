// Palavras que aparecem depois de "cupom" mas não são códigos.
const NOT_COUPON_CODES = new Set([
    "CUPOM",
    "CUPONS",
    "PRIMEIRA",
    "PRIMEIRO",
    "AQUI",
    "PARA",
    "DADO",
    "DADOS",
    "ALIEXPRESS",
    "MERCADO",
    "SHOPEE",
    "AMAZON",
    "MAGALU",
    "EXCLUSIVO",
    "EXCLUSIVA",
    "SUPER",
    "LOJA",
    "DESCONTO",
    "VALIDO",
    "DISPONIVEL",
    "NOVO",
    "NOVOS",
    "NOVA",
    "USUARIO",
    "USUARIOS",
    "HTTP",
    "HTTPS",
    "LINK",
])

// Termos que podem aparecer entre "cupom" e o código: "Cupom no app:", "Cupom de Primeira Compra:".
// Só espaços/tabs: o código precisa estar na mesma linha de "cupom".
const FILLER = String.raw`(?:[ \t]+(?:no[ \t]+app|app|(?:de[ \t]+)?primeira[ \t]+compra|(?:da|de)[ \t]+loja|exclusivo))?`
const COUPON_PATTERN = new RegExp(String.raw`cupom${FILLER}[ \t]*[:：-]?[ \t]*([A-Z0-9]{4,})`, "gi")

export function extractCoupons(text: string): string[] | null {
    // Remove URLs para nunca tratar pedaço de link como cupom.
    const withoutUrls = text.replace(/(?:https?:\/\/|www\.)\S+/gi, " ")

    const matches = Array.from(withoutUrls.matchAll(COUPON_PATTERN))

    const coupons = [...new Set(matches.map((m) => m[1].toUpperCase()))].filter((code) => !NOT_COUPON_CODES.has(code))

    if (coupons.length > 0) {
        return coupons
    }

    return null
}
