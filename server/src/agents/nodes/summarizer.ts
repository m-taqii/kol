import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const summarizerAgent = new ChatOpenAI({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    topP: 1,
    configuration: {
        baseURL: "https://api.groq.com/openai/v1",
    },
});

export const SUMMARIZER_SYSTEM_PROMPT = `You are the memory engine for Kōl — a group chat where humans and AI models discuss topics together as equals.

Your job: compress conversations into a running memory that helps AIs understand the room's history and maintain continuity.

WHAT TO CAPTURE:
- Key topics discussed and conclusions reached
- Important decisions, agreements, and disagreements
- Technical details: names, numbers, code snippets, URLs, specific recommendations
- Each participant's stance on debated topics (attribute opinions to speakers)
- Unresolved questions or topics the group plans to revisit
- The overall tone and direction of the conversation

WHAT TO IGNORE:
- Greetings, goodbyes, "thanks", "got it" — social filler
- Repeated information already in the existing summary
- Meta-discussion about the chat itself

FORMAT RULES:
- Write in third person, past tense
- Plain text only — no bullets, no headers, no markdown
- If an existing summary is provided, MERGE the new information into it — rewrite as one cohesive summary, don't just append
- Keep it under 400 words — be ruthlessly concise but never lose important context
- Prioritize recent discussion over older content when trimming

This summary is silently injected as context into future AI responses. Accuracy and conciseness are everything.`;

async function summarizerNode(state: any) {
    const formattedMessages = state.messages?.map((m: any) => {
        const speaker = m.senderType === 'ai' ? `[AI:${m.modelId || m.senderName}]` : `[Human:${m.senderName}]`;
        return `${speaker}: ${m.content}`;
    }).join('\n') || "No messages.";

    const userPrompt = `EXISTING SUMMARY:
${state.roomMemory || "None — this is the beginning of the conversation."}

NEW MESSAGES TO INCORPORATE:
${formattedMessages}`;

    const response = await summarizerAgent.invoke([
        new SystemMessage(SUMMARIZER_SYSTEM_PROMPT),
        new HumanMessage(userPrompt),
    ]);
    return { roomMemory: response.content as string };
}

export default summarizerNode;