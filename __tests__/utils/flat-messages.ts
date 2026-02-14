import { flattenTelegramText } from "./flatten-telegram-text.util"
const iskandarSouzaPromocoes = require("../fixtures/iskandar-souza-promocoes.json")
const pcDoFafa = require("../fixtures/pc-do-fafa.json")
const tjGaming = require("../fixtures/tj-gaming.json")
const ofertasAdrenaline = require("../fixtures/ofertas-adrenaline.json")
const promocoesDoTec = require("../fixtures/promocoes-do-tec.json")
import { defaultParser } from "../../src"

let offersCount = 0

for (const msg of [...iskandarSouzaPromocoes.messages, ...pcDoFafa.messages, ...tjGaming.messages, ...ofertasAdrenaline.messages, ...promocoesDoTec.messages]) {
    if (!msg.text) continue

    const flatText = flattenTelegramText(msg.text)

    const offer = defaultParser.parse(flatText)

    if (offer) {
        offersCount++
    }
}

console.log("Total de mensagens", [...iskandarSouzaPromocoes.messages, ...pcDoFafa.messages, ...tjGaming.messages, ...ofertasAdrenaline.messages, ...promocoesDoTec.messages].length)
console.log("Total de ofertas encontradas", offersCount)
console.log("Taxa de conversão", offersCount / [...iskandarSouzaPromocoes.messages, ...pcDoFafa.messages, ...tjGaming.messages, ...ofertasAdrenaline.messages, ...promocoesDoTec.messages].length)