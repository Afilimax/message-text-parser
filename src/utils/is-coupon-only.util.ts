import { removeEmojis } from "./remove-emojis.util"

const COUPON_WORD = String.raw`cupo(?:m|ns|es|ões|n)`

/**
 * Primeira linha apenas anunciando cupom(ns), sem produto.
 * Ex.: "Cupom Aliexpress!!", "NOVOS CUPONS MERCADO LIVRE", "Listão De Cupons".
 * Não casa "NOVO CUPOM! Ryzen 7 7700" (há produto após a pontuação).
 */
const COUPON_HEADER = new RegExp(
    String.raw`^(?:cuponsfafa\s+)?(?:(?:novos?|novas?|mais|lista|listão|listao|de|do|da|e)\s+)*${COUPON_WORD}\b[^!?:.$]*[!?.]*$`,
    "i",
)

/** Trechos que descrevem o desconto do cupom, não o preço de um produto. */
const DISCOUNT_FRAGMENTS = [
    // "R$ 50 OFF em R$ 200", "15% OFF em compras acima de R$ 19", "R$55 Off"
    /(?<![A-Za-z0-9])(?:R\$\s*)?\d[\d.,]*\s*%?\s*off\b(?:\s+(?:em|nas?|nos?|compras?|acima|a\s+partir|de))*(?:\s*R\$\s*\d[\d.,]*)?/gi,
    // "R$ 50 em R$ 199"
    /R\$\s*\d[\d.,]*\s+em\s+R\$\s*\d[\d.,]*/gi,
]

/**
 * Mensagem que só divulga cupom(ns): sem nenhum preço de produto além dos valores
 * que descrevem o próprio desconto.
 */
export function isCouponOnly(text: string): boolean {
    const firstLine = removeEmojis(text)
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean)

    if (!firstLine) return false

    let rest = text
    let hasDiscountFragment = false

    for (const fragment of DISCOUNT_FRAGMENTS) {
        rest = rest.replace(fragment, () => {
            hasDiscountFragment = true
            return " "
        })
    }

    if (/R\$\s*\d/.test(rest)) return false

    return hasDiscountFragment || COUPON_HEADER.test(firstLine)
}
