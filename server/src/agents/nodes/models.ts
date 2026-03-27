import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";
import { searchTool } from "../tools/searchTool.js";
import { urlTool } from "../tools/urlTool.js";


interface ModelConfig {
    llmModel: string;
    apiKey: string;
    baseURL: string;
    temperature: number;
    personality: string;
}

function getModelConfig(modelId: string): ModelConfig {
    const configs: Record<string, ModelConfig> = {
        gpt: {
            llmModel: "openai/gpt-oss-120b",
            apiKey: process.env.GROQ_API_KEY || "",
            baseURL: "https://api.groq.com/openai/v1",
            temperature: 0.7,
            personality: `You are GPT — the deep thinker of the group. You're known for structured reasoning, breaking down complex problems step by step, and being thorough without being verbose. You often bring mathematical or logical clarity to messy discussions. You're confident but not arrogant. When you disagree with another AI, you explain why clearly. When you agree, you don't just echo — you add something.`,
        },
        llama: {
            llmModel: "llama-3.3-70b-versatile",
            apiKey: process.env.GROQ_API_KEY || "",
            baseURL: "https://api.groq.com/openai/v1",
            temperature: 0.85,
            personality: `You are Llama — the conversationalist. You're warm, approachable, and great at explaining things in plain language. You bring creative angles and real-world analogies. In group discussions, you're the one who makes complex ideas accessible. You naturally build bridges between different viewpoints. You're not afraid to be casual — this is a group chat, not a thesis defense.`,
        },
        kimi: {
            llmModel: "moonshotai/kimi-k2-instruct-0905",
            apiKey: process.env.GROQ_API_KEY || "",
            baseURL: "https://api.groq.com/openai/v1",
            temperature: 0.7,
            personality: `You are Kimi — the engineer. You think in systems, architectures, and code. You're the one who spots implementation details others miss. In brainstorming sessions, you ground abstract ideas in technical reality. You're direct and concise — no fluff. When others are debating theory, you ask "but how would we actually build this?" You push for practical clarity.`,
        },
        qwen: {
            llmModel: "qwen/qwen3-32b",
            apiKey: process.env.GROQ_API_KEY || "",
            baseURL: "https://api.groq.com/openai/v1",
            temperature: 0.75,
            personality: `You are Qwen — the critical thinker and devil's advocate. You naturally question assumptions, spot weak reasoning, and play the "have you considered..." role. You're not contrarian for the sake of it — you genuinely want to stress-test ideas so the group arrives at stronger conclusions. You're sharp but respectful. When everyone agrees too quickly, you're the one who slows things down.`,
        },
        gemini: {
            llmModel: "gemini-2.5-flash",
            apiKey: process.env.GEMINI_API_KEY || "",
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
            temperature: 0.7,
            personality: `You are Gemini — the generalist and synthesizer. You are great at processing large amounts of context, summarizing different viewpoints, and bringing broad world knowledge to the conversation. When others are diving too deep into the weeds, you help zoom out and see the big picture. You are balanced and objective.`,
        },
        longcat: {
            llmModel: "LongCat-Flash-Chat",
            apiKey: process.env.LONGCAT_API_KEY || "",
            baseURL: "https://api.longcat.chat/openai",
            temperature: 0.75,
            personality: `You are LongCat — the practical problem-solver. You think in action steps, workflows, and "here's what you should actually do." While others debate the theory, you map out the execution. You're great at multi-step planning and connecting dots across different domains. You keep things grounded and actionable.`,
        },
    };

    const config = configs[modelId];
    if (!config) throw new Error(`Unknown model: ${modelId}`);
    return config;
}

function createModelLLM(config: ModelConfig): ChatOpenAI {
    return new ChatOpenAI({
        model: config.llmModel,
        apiKey: config.apiKey,
        temperature: config.temperature,
        topP: 1,
        configuration: {
            baseURL: config.baseURL,
        },
    });
}

// ── System Prompt Builder ─────────────────────────────────
function buildSystemPrompt(
    modelId: string,
    personality: string,
    memory: string,
    isOnlyModel: boolean,
    speakingPosition: number,
    totalSpeakers: number,
    previousResponses: { modelId: string; content: string }[],
): string {

    const contextBlock = memory
        ? `\nCONVERSATION HISTORY SUMMARY:\n${memory}`
        : "";

    // Solo mode: user is using this like a personal assistant
    if (isOnlyModel) {
        return `${personality}

You are the only AI in this room. The user is chatting with you directly, like a personal assistant. Be helpful, conversational, and adapt to their style. If they're casual, be casual. If they need deep analysis, go deep.
${contextBlock}

RULES:
- Be conversational — this is a chat, not an essay
- Match the user's energy and formality level
- Keep responses focused and useful
- Use markdown for code blocks, lists, or structured content when helpful
- No need to introduce yourself or explain what you are`;
    }

    // Multi-model: natural group chat member
    let positionGuidance = "";
    if (totalSpeakers === 1) {
        positionGuidance = "You're the only AI responding to this message. Give a complete, helpful response.";
    } else if (speakingPosition === 0) {
        positionGuidance = "You're speaking FIRST in this round. Set the foundation — give your core perspective on the topic. Others will build on or challenge what you say.";
    } else if (speakingPosition === totalSpeakers - 1) {
        positionGuidance = "You're speaking LAST in this round. You've read what the other AIs said. Your job: synthesize, challenge, or add what's missing. STRICT REDUNDANCY BAN: If you agree 100% with the previous AI and have nothing unique to add, just say 'I agree with [Model]' and nothing else. NEVER re-explain what they already explained.";
    } else {
        positionGuidance = "You're speaking in the MIDDLE of this round. You've read the previous AI response. DO NOT REPEAT THEM. Build on it, offer a different angle, or pivot to a new edge-case. If you echo the previous model word-for-word, you have failed.";
    }

    let previousResponsesBlock = "";
    if (previousResponses.length > 0) {
        previousResponsesBlock = `\n\nCONTRIBUTIONS FROM OTHER MODELS THIS ROUND:\n${previousResponses.map(r => `${r.modelId}: ${r.content}`).join('\n\n')}`;
    }

    return `${personality}

You are in a Kōl group chat with humans and other AI models. You are a MEMBER of this group — not a service, not an assistant. You're like a smart friend with specific expertise who naturally contributes to conversations.
${contextBlock}
${previousResponsesBlock}

YOUR POSITION: ${positionGuidance}

RULES FOR NATURAL GROUP CHAT:
- Talk like a real person in a group chat — concise, direct, natural.
- **NO ECHOING**: If someone else already gave the answer, do not repeat the facts. Either add a new insight, apply it to a different context, or move the conversation forward.
- EXTREME BREVITY: Keep your responses ridiculously short, 1-3 sentences max. Never write essays or long paragraphs unless the user explicitly asks for detailed explanations, essays, or complex code.
- NO greetings, NO sign-offs, NO "Great question!", NO "As an AI..."
- It's okay to be opinionated — that's why you're in the group.
- Use markdown for code, lists, or structured content only when it crucially helps clarity.
- **CRITICAL**: If you find yourself saying the same thing as a previous model, STOP and change your angle. Value uniqueness over thoroughness.

- **CRITICAL**: DO NOT prefix your response with your name, "AI:", "[AI: name]", or any other label. Just start your response with your actual message.
- **CRITICAL**: ONLY speak for yourself. Never simulate or generate text for other models or users.
- **CRITICAL**: Your output must be a SINGLE response from YOUR perspective. STOP immediately after finishing your point.

- You have access to tools:
  - tavily_search_results_json: Search the web for real-time information.
  - read_url: Read the full content of a specific URL.
  Use them only when you need fresh data or deep context you don't already have.`;
}

// Message Mapper
function mapMessages(messages: any[]): BaseMessage[] {
    return messages.map((m) => {
        const name = m.senderType === "ai" ? (m.modelId || m.senderName) : m.senderName;
        // Use a standard name: content format for clarity
        const formattedContent = `${name}: ${m.content}`;
        
        if (m.senderType === "ai") {
            return new AIMessage({ content: formattedContent, name });
        }
        return new HumanMessage({ content: formattedContent, name });
    });
}

// Model Node
// Models respond SEQUENTIALLY so each can see what came before

async function modelNode(state: any) {
    const { respondingModels, messages, roomMemory, modelsInRoom } = state;

    if (!respondingModels || respondingModels.length === 0) {
        return { modelResponses: [] };
    }

    const conversationHistory = mapMessages(messages);
    const isOnlyModel = modelsInRoom?.length === 1;
    // Local state for the speak-cycle to ensure each model sees previous ones as proper AI messages
    let currentConversation = [...conversationHistory];
    const responses: { modelId: string; content: string; error: boolean }[] = [];

    for (let i = 0; i < respondingModels.length; i++) {
        const modelId = respondingModels[i];
        try {
            const config = getModelConfig(modelId);
            const llm = createModelLLM(config);

            const systemPrompt = buildSystemPrompt(
                modelId,
                config.personality,
                roomMemory || "",
                isOnlyModel,
                i,
                respondingModels.length,
                responses.filter(r => !r.error),
            );

            const tools = [searchTool, urlTool];
            const llmWithTools = llm.bindTools(tools);

            let messages_to_send: BaseMessage[] = [
                new SystemMessage(systemPrompt),
                ...currentConversation
            ];

            let response = await llmWithTools.invoke(messages_to_send);

            // Handle tool calls (simple loop for 1 round of tool usage)
            if (response.tool_calls && response.tool_calls.length > 0) {
                messages_to_send.push(response);

                for (const toolCall of response.tool_calls) {
                    const tool = tools.find(t => t.name === toolCall.name);
                    if (tool) {
                        const toolResult = await tool.invoke(toolCall.args);
                        messages_to_send.push(new ToolMessage({
                            tool_call_id: toolCall.id!,
                            content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult)
                        }));
                    }
                }

                // Get final response after tool results
                response = await llmWithTools.invoke(messages_to_send);
            }

            let rawContent = (response.content as string) || "";
            
            // 1. Clean contents...
            let cleanedContent = rawContent.replace(/<think>[\s\S]*?<\/think>\n*/g, "").trim();
            cleanedContent = cleanedContent.replace(/<function=[^>]+>[\s\S]*?<\/function>\n*/g, "").trim();
            cleanedContent = cleanedContent.replace(/<tool_call>[\s\S]*?<\/tool_call>\n*/g, "").trim();
            cleanedContent = cleanedContent.replace(/^\[?AI:\s*[^\]]+\]?:\s*/i, "");
            cleanedContent = cleanedContent.replace(/^(gpt|llama|kimi|qwen|gemini|longcat):\s*/i, "");
            
            if (cleanedContent.includes('\n[AI:') || cleanedContent.includes('\nAI:')) {
                const parts = cleanedContent.split(/\n\[?AI:/);
                cleanedContent = (parts[0] || "").trim();
            }

            // SUCCESS: only append if model actually said something substantive
            if (!cleanedContent) {
                console.log(`Skipping silent response from ${modelId}`);
                continue; 
            }

            responses.push({
                modelId,
                content: cleanedContent,
                error: false
            });

            // Update local conversation history for subsequent models in the same round
            currentConversation.push(new AIMessage({ 
                content: `${modelId}: ${cleanedContent}`, 
                name: modelId 
            }));
        } catch (error) {
            console.error(`Error invoking model ${modelId}:`, error);
            responses.push({
                modelId,
                content: "Having a brain freeze — give me a sec.",
                error: true
            });
        }
    }

    return { modelResponses: responses };
}

export default modelNode;