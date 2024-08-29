import { Configuration, OpenAIApi } from "openai"
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export const callChatGPT = (text: string) => pipe(
    TE.tryCatch(() => openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        max_tokens: 2048,
    }), String),
    TE.map(completion => completion.data.choices[0].text),
    TE.map(answer => {
        console.log("gptText:",text)
        console.log("gptAnswer:", answer)
        return answer
    })
)