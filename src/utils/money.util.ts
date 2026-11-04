export function parseBrl(value: string): number {
    return Number(value.trim().replace(/\./g, "").replace(",", "."))
}
