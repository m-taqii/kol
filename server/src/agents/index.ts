import { StateGraph, Annotation } from "@langchain/langgraph";
import modelNode from "./nodes/models";
import summarizerNode from "./nodes/summarizer";
import { gateNode } from "./nodes/gate";
import { START, END } from "@langchain/langgraph";

interface RoomMessage {
    senderName: string
    senderType: "human" | "ai"
    modelId?: string
    content: string
    timestamp: Date
}

interface GateDecision {
    should_respond: boolean
    reason: string
    responding_models: string[]
}

interface ModelResponse {
    modelId: string
    content: string
    error?: boolean
}

export const GraphState = Annotation.Root({
    roomId: Annotation<string>(),
    messages: Annotation<RoomMessage[]>(),
    roomMemory: Annotation<string>(),
    modelsInRoom: Annotation<string[]>(),
    gateDecision: Annotation<GateDecision>(),
    respondingModels: Annotation<string[]>(),
    modelResponses: Annotation<ModelResponse[]>(),
    messageCount: Annotation<number>(),
});

function shouldContinue(state: any) {
    if (state.gateDecision?.should_respond && state.respondingModels?.length > 0) {
        return "models";
    }
    return END;
}

function shouldSummarize(state: any) {
    // Summarize every 10 messages to keep memory fresh
    const count = state.messageCount || 0;
    if (count > 0 && count % 10 === 0) {
        return "summarizer";
    }
    return END;
}

const graph = new StateGraph(GraphState)
    .addNode("gate", gateNode)
    .addNode("models", modelNode)
    .addNode("summarizer", summarizerNode)
    .addEdge(START, "gate")
    .addConditionalEdges("gate", shouldContinue)
    .addConditionalEdges("models", shouldSummarize)
    .addEdge("summarizer", END);

const compiledGraph = graph.compile();
export default compiledGraph;