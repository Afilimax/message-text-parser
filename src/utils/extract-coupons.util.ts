export function extractCoupons(text: string): string[] | null {
    const matches = Array.from(text.matchAll(/cupom(?:\s+no\s+app)?[:：]?\s*([A-Z0-9]{4,})/gi))

    const coupons = [...new Set(matches.map((m) => m[1].toUpperCase()))]

    if (coupons.length > 0) {
        return coupons
    }

    return null
}
