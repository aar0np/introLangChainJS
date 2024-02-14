# introLangChainJS

A quick, terminal-based demo application meant to showcase the speed and ease with which a GenAI chatbot can be created using the LangChain.js and Astra DB integration.

## Requirements

 - Node.js runtime (v21.6.1 was used for this demo)
 - A vector-enabled [Astra DB](https://astra.datastax.com) database.
 - An Astra DB application token.
 - An Astra DB API endpoint.
 - An OpenAI account and API key.
 - Environment variables defined for: `OPENAI_API_KEY`,`ASTRA_DB_APPLICATION_TOKEN`, and `ASTRA_DB_API_ENDPOINT`:

```
export ASTRA_DB_APPLICATION_TOKEN=AstraCS:GgsdfSnotrealHqKZw:SDGSDDSG6a36d8526BLAHBLAHBLAHc18d40
export ASTRA_DB_API_ENDPOINT=https://b9aff773-also-not-real-d3088ea14425-us-east1.apps.astra.datastax.com
export OPENAI_API_KEY=sk-6gblahblahblahbittyblahtpp
```

## Functionality

Descriptions and examples for each TypeScript file in the project.

### loader.ts
 
 - Loads `*.txt` documents from `src/sample`.
 - Splits the documents using LangChain.js' `RecursiveCharacterTextSplitter`.
 - Generates vector embeddings for each "chunk" of data.
 - Stores the vector embeddings in Astra DB.

### query.ts

 - Defines a prompt template using LangChain.js.
 - Constructs a chatbot from a "chain" consisting of modules for a vector store (Astra DB), prompt template, LLM, and output parser.
 - Asks the chatbot the simple question of "What is this story about?" and returns a conversational summary.

Build:
```
tsc src/loader.ts
tsc src/query.ts
```

Execution:

```
node src/query.js
```

Terminal output:

```
Loaded 16 documents.
Connected to Astra DB collection
{ question: 'What is this story about?' }
{
  answer: 'This story is about a narrator who encounters his friend, Fortunato, during the carnival season. The narrator tells Fortunato that he has received a pipe of what is supposed to be Amontillado wine, but he has doubts about its authenticity. Fortunato expresses disbelief and curiosity, and the narrator insists on satisfying his doubts.'
}
```
