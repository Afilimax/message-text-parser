export function removeEmojis(text: string) {
    return text.replace(/(\p{Extended_Pictographic}|\p{Emoji_Component})+/gu, "")
}
