import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import fs from 'fs'

const model = new OpenAI({ modelName: 'gpt-3.5-turbo-16k' })
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 16000 })

const summarize = async (text: string) => {
  const docs = await textSplitter.createDocuments([text])
  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  const res = await chain.call({
    input_documents: docs,
  })
  return res?.text
}

const main = async () => {
  const text = await fs.promises.readFile('./input.txt', 'utf-8')
  const summary = await summarize(text)
  console.log(summary)
  fs.writeFileSync('./output.txt', summary)
}

main()
