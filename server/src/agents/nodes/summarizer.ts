import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "langchain";
const summarizerAgent = new ChatOpenAI({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    configuration: {
        baseURL: "https://api.groq.com/openai/v1",
    },
});

export const SUMMARIZER_SYSTEM_PROMPT = `You are a conversation summarizer for Kōl — a group chat platform where humans and AI models discuss topics together.

Your job is to compress a conversation into a concise memory summary that will be used as context for future AI responses in this room.

RULES:
- Write in third person, past tense
- Capture key topics discussed, opinions expressed, decisions made, and conclusions reached
- Note which perspectives came from humans vs AI models when relevant
- Preserve important facts, numbers, names, and technical details
- Ignore casual filler — greetings, one word replies, off-topic small talk
- Output plain text only — no bullet points, no headers, no markdown
- If there is an existing summary provided, merge it with the new messages into one updated summary — do not just append
- Make sure the summary is not too long, it should be concise and to the point and no important information should be lost. the summary should provide the full context of the conversation in the room.

This summary will be silently injected as context into future AI responses. It must be useful, accurate and compact.`;

async function summarizerNode(state: any) {
    const response = await summarizerAgent.invoke([
        new SystemMessage(SUMMARIZER_SYSTEM_PROMPT),
        new HumanMessage(state.prompt),
    ]);
    return { response: response.content as string };
}

export default summarizerNode;