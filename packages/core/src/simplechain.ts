import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { SimpleChain } from "./classes";
import path from "path";
import { isDirectory } from "./utils";
import merge from "just-merge";
import "dotenv/config";

interface ModelOptions {
  openAIApiKey?: string;
  modelName?: string;
  temperature?: number;
  streaming?: boolean;
  cache?: boolean;
}

const defaultOptions: ModelOptions = {
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0,
  streaming: false,
  cache: false,
};

interface SimpleChainInterface {
  create: (options?: ModelOptions) => SimpleChain;
  document: {
    create: (
      options:
        | string
        | ({ path: string } & { url?: never })
        | { path?: never; url: string }
    ) => Promise<any>;
  };
}

export const simplechain: SimpleChainInterface = {
  create: (options?: ModelOptions) => {
    if (options?.streaming) {
      const mergedOptions = merge(defaultOptions, options);
      const optionsWithCallbacks = merge(mergedOptions, {
        callbacks: [
          {
            handleLLMNewToken(token: string): any {
              process.stdout.write(token);
            },
          },
        ],
      });
      const model = new OpenAI(optionsWithCallbacks);
      return new SimpleChain(model);
    }
    const model = new OpenAI(
      options ? merge(defaultOptions, options) : defaultOptions
    );
    return new SimpleChain(model);
  },
  document: {
    create: async (
      options:
        | string
        | ({ path: string } & { url?: never })
        | { path?: never; url: string }
    ) => {
      const currentDir = process.cwd();
      if (typeof options === "string") {
        const splitter = new CharacterTextSplitter({
          separator: " ",
          chunkSize: 50,
          chunkOverlap: 10,
        });
        return await splitter.createDocuments([options]);
      }

      if (!!options && options.path) {
        if (isDirectory(options.path)) {
          const loader = new DirectoryLoader(options.path, {
            ".json": (path) => new JSONLoader(path),
            ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
            ".txt": (path) => new TextLoader(path),
            ".csv": (path) => new CSVLoader(path),
          });
          return { documents: await loader.load() };
        } else {
          const fileExt = path.extname(options.path);
          const pathToFile = path.join(currentDir, options.path);
          switch (fileExt) {
            case ".txt":
              const text = new TextLoader(pathToFile);
              return { documents: await text.load() };
            case ".csv":
              const csv = new CSVLoader(options.path);
              return { documents: await csv.load() };
            case ".json":
              const json = new JSONLoader(options.path);
              return { documents: await json.load() };
            case ".md":
              const md = new TextLoader(options.path);
              return { documents: await md.load() };
          }
        }
      }

      if (!!options && options.url) {
        const loader = new CheerioWebBaseLoader(options.url);
        return await loader.load();
      }
    },
  },
};

export default simplechain;
