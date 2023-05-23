import simplechain from "simplechain";

const chain = simplechain.create({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  streaming: true,
});

export async function ask(question: string) {
  "use server";
  const { data } = await chain.ask(question);
  return { data };
}

export async function translate(query: string) {
  "use server";
  const { data } = await chain.translate({
    text: query,
    to: "es",
  });
  return { data };
}

export async function code(codeBody: string) {
  "use server";
  const { data } = await chain.explain({
    text: codeBody,
    filter: "clarity", // optional field to provide more specific context
  });
  return { data };
}
