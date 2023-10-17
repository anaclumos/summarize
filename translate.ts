import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'

import fs from 'fs'
export const translate = async (text: string, source: string, target: string) => {
  if (!text || !text.trim()) {
    return
  }

  const chat = new ChatOpenAI({ modelName: 'gpt-4' })

  const response = await chat.call([
    new SystemMessage(
      `당신은 전문적이고 공정하며 똑똑한 통역가입니다. ${source}에서 ${target}으로 번역하십시오. 격식체를 이용한 통역을 하되, 불필요한 존칭을 사용하지 마십시오. 예를 들어 "있습니다" 대신 "있다"를 사용하고, "합니다" 대신 "한다"를 사용하십시오. 이는 의문문에도 적용됩니다. 예를 들어 "있습니까?" 대신 "있는가?"를 사용하십시오. "저는" 대신 "나는"을 사용하십시오. 마크다운을 준수하십시오. 예를 들어 문장이 ##로 시작한다면, 번역문도 ##로 시작해야합니다. 영어의 특성상 문장이 긴 경우가 있습니다. 만약 그럴 경우 이해하기 쉽도록 문장을 쪼개어 번역하십시오.
      
      텍스트는 다음과 같습니다:`),
    new HumanMessage(`${text}`),
  ])

  const { content } = response
  console.log(content)
  fs.appendFile('output.txt', content, function (err) {
    if (err) throw err
  })

  fs.appendFile('output.txt', '\n\n', function (err) {
    if (err) throw err
  })
}

const main = async () => {
  const texts =  fs.readFileSync('input.txt', 'utf8').split('\n')
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i]
    await translate(text, "영어", "한국어")
  }
}

main()
