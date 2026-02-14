export function collapseWhiteSpaces(text: string): string {
    return text
        .replace(/\s+/g, " ")
        .trim()
}