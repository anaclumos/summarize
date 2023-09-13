import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const model = new OpenAI({ modelName: 'gpt-3.5-turbo-16k' })
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

const summarize = async (text: string) => {
  const docs = await textSplitter.createDocuments([text])
  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  const res = await chain.call({
    input_documents: docs,
  })
  return res?.text
}

const askUserForInput = async () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise<string>((resolve, reject) => {
    readline.question('Enter text to summarize: ', (text: string) => {
      readline.close()
      resolve(text)
    })
  })
}

const main = async () => {
  const text = await askUserForInput()
  const summary = await summarize(text)
  console.log(summary)
}

main()
