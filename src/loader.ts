import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

const FILE_PATH = "./src/sample";
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];

async function loadDocs() {
  try {
    const loader = new DirectoryLoader(FILE_PATH, { ".txt": path => new TextLoader(path) });
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 15 });
    const texts = await splitter.splitDocuments(docs);

    console.log(`Loaded ${texts.length} documents.`);
    return texts;
  } catch (error) {
    console.error('Error loading documents:', error);
    throw error;
  }
}

let vectorStorePromise;

export async function getVectorStore() {
  if (!vectorStorePromise) {
    vectorStorePromise = initVectorStore();
  }
  return vectorStorePromise;
}

async function initVectorStore() {
    try {
      const docs = await loadDocs();
      const astraConfig = getAstraConfig();

      // Initializing the vector store with the docs variable also
      // generates embeddings from the docs and stores them.
      const vectorStore = await AstraDBVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY,
                               batchSize: 512 }),
                               astraConfig
      );

      return vectorStore;
    } catch (error) {
      console.error("Error initializing vector store:", error);
      throw error;
    }
}

function getAstraConfig() {
  return {
    token: process.env.ASTRA_DB_APPLICATION_TOKEN as string,
    endpoint: process.env.ASTRA_DB_API_ENDPOINT as string,
    collection: process.env.ASTRA_DB_COLLECTION ?? "vector_test",
    collectionOptions: {
      vector: {
        dimension: 1536,
        metric: "cosine",
      },
    }
  } as AstraLibArgs;
}
