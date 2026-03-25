import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

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

const getModelSystemPrompt = (modelId: string, memory: string) => `
You are an AI participant in a collective intelligence group chat named Kōl.

In this room, you coexist with other humans and other AI models. Your goal is to contribute meaningfully to the conversation.

CONTEXT:
${memory ? `Past Summary: ${memory}` : "Beginning of conversation."}

GUIDELINES:
- Be helpful, insightful, and authentic to your specific model identity.
- Acknowledge what others (humans or AIs) have said if relevant.
- Keep responses relatively concise unless a deep dive is requested.
- You are talking in a real-time chat. No need for formal letter formatting.
- If you were selected to respond, it is because your specific perspective was deemed valuable by a moderator.

You are acting as: ${modelId}
`;

function mapMessages(messages: any[]): BaseMessage[] {
    return messages.map((m) => {
        if (m.senderType === "ai") {
            return new AIMessage({ content: m.content, name: m.senderName });
        }
        return new HumanMessage({ content: m.content, name: m.senderName });
    });
}

async function modelNode(state: any) {
    const { respondingModels, messages, roomMemory } = state;

    if (!respondingModels || respondingModels.length === 0) {
        return { modelResponses: [] };
    }

    const conversationHistory = mapMessages(messages);

    const modelPromises = respondingModels.map(async (modelId: string) => {
        try {
            const ai = await modelAgent(modelId);
            const systemPrompt = getModelSystemPrompt(modelId, roomMemory);
            
            const response = await ai.invoke([
                new SystemMessage(systemPrompt),
                ...conversationHistory
            ]);

            return {
                modelId,
                content: response.content as string,
                error: false
            };
        } catch (error) {
            console.error(`Error invoking model ${modelId}:`, error);
            return {
                modelId,
                content: "I'm having trouble connecting to my brain right now.",
                error: true
            };
        }
    });

    const responses = await Promise.allSettled(modelPromises);

    return { modelResponses: responses };
}

export default modelNode;