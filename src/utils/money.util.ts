export function parseBrl(value: string): number {
    return Number(value.replace(/\./, "").replace(",", "."))
}
