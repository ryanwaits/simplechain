"use client";

import React from "react";

export default function ChatForm(props: any) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const action = async (prompt: string) => {
    setAnswer("...");
    const { data: answer } = await props.action(prompt);
    setAnswer(answer);
  };
  return (
    <form action={() => action(question)}>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button type="submit">Ask</button>
      <p>{answer}</p>
    </form>
  );
}
