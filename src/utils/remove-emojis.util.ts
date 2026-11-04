// Não usar \p{Emoji_Component}: ele inclui dígitos, "#" e "*", e apagaria "V40" -> "V".
const EMOJI_PATTERN = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F3FB}-\u{1F3FF}\u200d\ufe0f\u20e3]/gu

export function removeEmojis(text: string) {
    return text.replace(EMOJI_PATTERN, "")
}
