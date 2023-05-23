## SimpleChain

SimpleChain is a JavaScript library that provides a simple and easy-to-use interface for interacting with the OpenAI API. It allows you to quickly and easily generate text using state-of-the-art language models, translate text between languages, summarize text, and more.

### Usage

To get started with SimpleChain, you can create a new instance of the `SimpleChain` class by calling the `create` method and passing in your OpenAI API key, as well as any other options you want to set:

```javascript
const chain = await simplechain.create({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0,
  streaming: true,
  cache: false,
});
```

Once you have a ﻿SimpleChain instance, you can use it to generate text by calling the ﻿ask method and passing in a text prompt:

```javascript
const { data } = await chain.ask({
  text: "What is the meaning of life?",
});
```

You can also generate text using a set of custom documents by calling the ﻿documents.create method:

```javascript
const { documents } = await chain.documents.create({
  path: "src",
});

const { data } = await chain.ask({
  text: "What is the meaning of life?",
  documents,
});
```

If you want to use a prompt template that includes variables, you can create a new prompt by calling the ﻿prompt.create method:

```javascript
const { prompt } = await chain.prompt.create({
  text: "What is the meaning of {thing}?",
  variables: ["thing"],
});

const { data } = await chain.ask({
  prompt,
  text: "life",
  docs,
});
```

You can also translate text between languages by calling the ﻿translate method:

```javascript
const { translation } = await chain.translate({
  text: "What is the meaning of life?",
  from: "en",
  to: "ru",
});
```

And you can summarize text using the ﻿summarize method:

```javascript
const { summary } = await.chain.summarize({
  text: "What is the meaning of life?",
  maxTokens: 100,
});
```

You can also tailor it to code related tasks:

```javascript
const codeBody = `
  (define-read-only (is-extension (extension principal))
    (default-to false (map-get? Extensions extension))
  )
`
const { explanation } = await.chain.explain({
  text: codeBody,
  filter: "clarity", // optional field to provide more specific context
})
```

## Contributing

If you’d like to contribute to SimpleChain, please feel free to submit a pull request or open an issue on the GitHub repository.
