import { ChatOpenAI } from "@langchain/openai";

async function modelAgent(model: string) {

    switch (model) {
        case "gpt":
            return new ChatOpenAI({
                model: "openai/gpt-oss-120b",
                apiKey: process.env.GROQ_API_KEY,
                temperature: 0.8,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
                configuration: {
                    baseURL: "https://api.groq.com/openai/v1",
                },
            });
        case "llama":
            return new ChatOpenAI({
                model: "llama-3.3-70b-versatile",
                apiKey: process.env.GROQ_API_KEY,
                temperature: 0.8,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
                configuration: {
                    baseURL: "https://api.groq.com/openai/v1",
                },
            });
        case "kimi":
            return new ChatOpenAI({
                model: "moonshotai/kimi-k2-instruct-0905",
                apiKey: process.env.GROQ_API_KEY,
                temperature: 0.8,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
                configuration: {
                    baseURL: "https://api.groq.com/openai/v1",
                },
            });
        case "qwen":
            return new ChatOpenAI({
                model: "qwen/qwen3-32b",
                apiKey: process.env.GROQ_API_KEY,
                temperature: 0.8,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
                configuration: {
                    baseURL: "https://api.groq.com/openai/v1",
                },
            });
        case "longcat":
            return new ChatOpenAI({
                model: "LongCat-Flash-Chat",
                apiKey: process.env.LONGCAT_API_KEY,
                temperature: 0.8,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
                configuration: {
                    baseURL: "https://api.longcat.chat/openai",
                },
            });

        default:
            throw new Error(`Invalid model ${model}`);
    }


}

async function modelNode(state: any) {
    const ai = await modelAgent(state.model);
    const response = await ai.invoke(state.prompt);
    return { response: response.content as string };
}

export default modelNode;