import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import path from "path";

export class SimpleChain {
  model: OpenAI;

  constructor(model: OpenAI) {
    this.model = model;
  }

  async ask(
    input: string | { text: string; documents?: any[] }
  ): Promise<{ data: string }> {
    let text: string;
    let documents: any[] | undefined;
    if (typeof input === "string") {
      text = input;
    } else {
      text = input.text;
      documents = input.documents;
    }
    if (documents) {
      const prompt = PromptTemplate.fromTemplate(
        "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:"
      );

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 150,
      });
      const splitDocs = await splitter.splitDocuments(documents);

      const vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        new OpenAIEmbeddings()
      );

      const relevantDocs = await vectorStore.similaritySearch(text, 1);
      const chain = new LLMChain({
        prompt,
        llm: this.model,
        verbose: false,
      });
      const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
      const response = await chain.call({
        question: text,
        context,
      });

      return { data: response.text };
    }
    const response = await this.model.call(text);

    const data = response.replace(/\n/g, "");
    return { data };
  }

  async translate(options: { text: string; from?: string; to: string }) {
    const languages: any = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ar: "Arabic",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
    };
    if (!languages[options.to]) {
      throw new Error(
        `Invalid language ${options.to}. Supported languages are ${Object.keys(
          languages
        ).join(", ")}`
      );
    }
    const prompt = new PromptTemplate({
      template:
        "You are a helpful assistant that translates {from} to {to}. Here is the text to translate: {text}",
      inputVariables: ["from", "to", "text"],
    });
    const chain = new LLMChain({ llm: this.model, prompt });
    const response = await chain.call({
      from: options?.from ? languages[options.from] : languages["en"],
      to: languages[options.to],
      text: options.text,
    });

    const translation = response.text.replace(/\n/g, "");
    return { data: translation };
  }

  // TODO: async summarize(options: { text: string; maxTokens?: number }) {}
  async explain(options: { text: string; filter?: "clarity" | ("js" | "ts") }) {
    const prompt = new PromptTemplate({
      template: `Explain the following code: Context: {context} Code: {code}`,
      inputVariables: ["context", "code"],
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 325,
      chunkOverlap: 50,
    });
    const text = new TextLoader(
      path.resolve(
        "/Users/ryanwaits/Code/open-source/simplechain/packages/core",
        "data",
        "clarity.md"
      )
    );
    const documents = await text.load();
    const splitDocs = await splitter.splitDocuments(documents);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings()
    );

    const relevantDocs = await vectorStore.similaritySearch(options.text, 1);
    const chain = new LLMChain({
      prompt,
      llm: this.model,
      verbose: false,
    });
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    const response = await chain.call({
      code: options.text,
      context,
    });

    const explanation = response.text.replace(/\n/g, "");
    return { data: explanation };
  }
}
