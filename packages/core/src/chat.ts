import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  BasePromptValue,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";

export const model = new ChatOpenAI({ temperature: 0 });

export async function chat(query: string) {
  const response = await model.call([
    new SystemChatMessage(
      "Act as a translator that can converts English to Spanish."
    ),
    new HumanChatMessage(query),
  ]);
  return response.text;
}

export async function chatWithPrompt(prompt: BasePromptValue) {
  const response = await model.generatePrompt([prompt]);
  return response;
}
