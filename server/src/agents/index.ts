import { StateGraph, Annotation } from "@langchain/langgraph";
import modelNode from "./nodes/models";
import summarizerNode from "./nodes/summarizer";
import { gateNode } from "./nodes/gate";
import { START, END } from "@langchain/langgraph";

interface RoomMessage {
    id: string
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
    summarizedMessageIds: Annotation<string[]>(),
});

function shouldContinue(state: any) {
    if (state.gateDecision?.should_respond && state.respondingModels?.length > 0) {
        return "models";
    }
    return shouldSummarize(state);
}

function shouldSummarize(state: any) {
    if (state.messages && state.messages.length > 20) {
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