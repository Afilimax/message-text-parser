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
])

// Termos que podem aparecer entre "cupom" e o código: "Cupom no app:", "Cupom de Primeira Compra:".
const FILLER = String.raw`(?:\s+(?:no\s+app|app|(?:de\s+)?primeira\s+compra|(?:da|de)\s+loja|exclusivo))?`
const COUPON_PATTERN = new RegExp(String.raw`cupom${FILLER}\s*[:：-]?\s*([A-Z0-9]{4,})`, "gi")

export function extractCoupons(text: string): string[] | null {
    const matches = Array.from(text.matchAll(COUPON_PATTERN))

    const coupons = [...new Set(matches.map((m) => m[1].toUpperCase()))].filter((code) => !NOT_COUPON_CODES.has(code))

    if (coupons.length > 0) {
        return coupons
    }

    return null
}
