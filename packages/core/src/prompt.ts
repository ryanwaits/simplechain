import {
  BaseChatPromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { InputValues } from "langchain/dist/schema";

export function createPrompt(template: string) {
  const inputVariables =
    template.match(/{([^}]*)}/g)?.map((match) => match.slice(1, -1)) || [];

  return new PromptTemplate({
    template: template,
    inputVariables: inputVariables,
  });
}

export function createChatPrompt<Template extends string>(
  template: Template
): ChatPromptTemplate {
  return ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(template),
    HumanMessagePromptTemplate.fromTemplate("{query}"),
  ]);
}
