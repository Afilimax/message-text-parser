type TelegramTextPart = string | { type: string; text: string }

export function flattenTelegramText(input: TelegramTextPart[] | string): string {
    if (typeof input === "string") return input

    return input.map((part) => (typeof part === "string" ? part : part.text)).join("")
}
