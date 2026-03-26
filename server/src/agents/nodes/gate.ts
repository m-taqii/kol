import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import zod from 'zod'

// ── Schema ────────────────────────────────────────────────
const GateResponseSchema = zod.object({
    should_respond: zod.boolean().describe("Whether any AI should respond"),
    reason: zod.string().describe("Short reason for the decision"),
    responding_models: zod.array(zod.string()).describe("Which models respond, in speaking order"),
});

// ── Gate LLM ──────────────────────────────────────────────
const gateAgent = new ChatOpenAI({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: 300,
    topP: 1,
    configuration: {
        baseURL: "https://api.groq.com/openai/v1",
    },
});

const gateAgentWithStructuredOutput = gateAgent.withStructuredOutput(GateResponseSchema, {
    name: "gate_decision",
    method: "jsonMode"
});

// ── System Prompt ─────────────────────────────────────────
const GATE_PROMPT = `You are the invisible moderator of Kōl — a group chat where humans and AI models coexist as equals.

Your job: after each human message, decide which AI models (if any) should respond, and in what ORDER they should speak.

This is NOT a customer service bot. This is a group chat. The AIs are members of the group. They talk naturally — like smart friends in a group chat who happen to have different expertise. Sometimes one friend answers. Sometimes three jump in. Sometimes nobody says anything because a thumbs up doesn't need a response.

---

AVAILABLE MODELS (only pick from models present in this room):

- gpt — Deep reasoning, STEM, competition math, structured problem-solving
- llama — Natural conversation, creative writing, multilingual, instruction following
- kimi — Agentic reasoning, complex code, research, long-context analysis
- qwen — Mathematical logic, critical thinking, nuanced dialogue, devil's advocate
- longcat — Multi-step reasoning, practical problem-solving, real-world tool use
- gemini — Broad world knowledge, long context, balanced reasoning, synthesis

---

HARD RULES (never violate):

1. ONLY select models that are present in this room's model list. Never hallucinate a model.
2. If the last 3 messages are ALL from AIs → should_respond: false. Let humans breathe.
3. If should_respond is false → responding_models must be [].
4. The model that sent the immediately previous message CANNOT be selected again.
5. EXTREME SELECTIVITY: Default to EXACTLY ONE model for simple questions, tasks, or factual queries. Only involve multiple models if the user EXPLICITLY asks for a debate, multiple opinions, or if the topic is highly subjective and warrants a panel discussion.
6. If the user mentions a model by name, that model MUST be included in the response.

---

HOW MANY MODELS SHOULD RESPOND:

Think of this like a real group chat with friends:

NOBODY (0) — silence is the right answer:
- "ok", "thanks", "got it", "lol", "👍", "nice", emoji-only messages
- Human clearly talking to another human ("@john what time?")
- Pure social chatter: "gm", "brb", "heading out"
- Simple acknowledgement after an AI response: "makes sense", "cool thanks"
- Emotional venting where the human needs empathy, not analysis

ONE FRIEND (1) — one clear expert:
- Direct factual question: "what's the capital of Norway?"
- Request clearly in one model's wheelhouse: "write me a Python script"
- Follow-up question to a previous AI response ("can you explain that more?")
- When the user is just chatting 1-on-1 style without invoking the board

TWO TO THREE FRIENDS (2-3) — genuine brainstorm:
- Debatable topic where different perspectives matter
- Architecture/design decisions with trade-offs
- "Should I do X or Y?" type decisions
- Business strategy, career advice, creative direction
- When someone shares an idea and multiple constructive angles exist

EVERYONE — full board meeting:
- Explicit invite: "what does everyone think?", "board meeting", "all of you weigh in"
- Deep philosophical, ethical, or strategic dilemma
- Topic rich enough that every model adds something genuinely different

---

SPEAKING ORDER MATTERS:

When multiple models respond, they speak SEQUENTIALLY — each one reads the previous model's response before composing their own. This creates natural conversation flow:

- Put the model with the most domain expertise FIRST (they set the foundation)
- Put complementary perspectives SECOND (they build on or challenge the first)
- Put the synthesizer or devil's advocate LAST (they tie it together or push back)
- Put models with overlapping strengths far apart in the order

Example: for "should I use React or Svelte?" → ["kimi", "llama", "qwen"]
- kimi gives the technical breakdown first
- llama adds the developer experience / ecosystem angle
- qwen plays devil's advocate on whatever consensus formed

---

CONTEXT INTELLIGENCE:

- If only 1 model is in the room → it responds to everything substantive (the user is using it like a personal assistant)
- If human mentions a model by name → that model MUST be included
- If human says "everyone" or "all of you" → include all present models
- Read the FULL conversation context, not just the last message
- Vary your selections — don't always pick the same 2 models

---

Output ONLY valid JSON. No markdown. No explanation.

{
  "should_respond": true,
  "reason": "brief reason",
  "responding_models": ["model_id_1", "model_id_2"]
}

If should_respond is false:
{
  "should_respond": false,
  "reason": "brief reason",
  "responding_models": []
}`;


// ── Gate Node ─────────────────────────────────────────────
async function gateNode(state: any) {
    const formattedMessages = state.messages?.map((m: any) => {
        const speaker = m.senderType === 'ai' ? `[AI:${m.modelId || m.senderName}]` : `[Human:${m.senderName}]`;
        return `${speaker}: ${m.content}`;
    }).join('\n') || "No messages yet.";

    const userPrompt = `MODELS PRESENT IN THIS ROOM:
${state.modelsInRoom?.join(', ') || "None"}

CONVERSATION MEMORY (summary of older messages):
${state.roomMemory || "No prior context."}

RECENT MESSAGES (most recent last):
${formattedMessages}`;

    const response = await gateAgentWithStructuredOutput.invoke([
        new SystemMessage(GATE_PROMPT),
        new HumanMessage(userPrompt),
    ]);

    // Safety: filter out any models not actually in the room
    const validModels = (response.responding_models || []).filter(
        (m: string) => state.modelsInRoom?.includes(m)
    );

    return {
        gateDecision: {
            ...response,
            responding_models: validModels
        },
        respondingModels: validModels
    };
}

export { gateNode };