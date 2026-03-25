import { StateGraph, Annotation } from "@langchain/langgraph";
import modelNode from "./nodes/models";
import { gateNode, reactionGateNode } from "./nodes/gate";
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
    return state.gateDecision.should_respond ? "models" : END;
}

const graph = new StateGraph(GraphState)
    .addNode("gate", gateNode)
    .addNode("models", modelNode)
    .addNode("reactionGate", reactionGateNode)
    .addEdge(START, "gate")
    .addConditionalEdges("gate", shouldContinue)
    .addEdge("models", "reactionGate")
    .addConditionalEdges("reactionGate", shouldContinue)
    .addEdge("models", END);

const compiledGraph = graph.compile();
export default compiledGraph;