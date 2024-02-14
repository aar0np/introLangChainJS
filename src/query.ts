import { ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { getVectorStore } from './loader';

const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say that you don't know, don't try to make up an answer.
  ----------------
  {context}`;

async function queryVectorStore() {
  const vectorStore = await getVectorStore();
  const vectorStoreRetriever = vectorStore.asRetriever();
  const model = new ChatOpenAI({});

  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const chain = RunnableSequence.from([
    {
      context: vectorStoreRetriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const question = "What is this story about?";
  console.log({ question });

  const answer = await chain.invoke(question);
  console.log({ answer });
}

queryVectorStore().catch(console.error);