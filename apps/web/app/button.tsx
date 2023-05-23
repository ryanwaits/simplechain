"use client";

import React from "react";

export default function InputAndButton(props: any) {
  const [text, setText] = React.useState("");
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={props.action}>Translate</button>
    </>
  );
}
