import { StateGraph, Annotation } from "@langchain/langgraph";
import modelNode from "./nodes/models";
import gateNode from "./nodes/gate";
import { START, END } from "@langchain/langgraph";

const GraphState = Annotation.Root({
    model: Annotation<string>(),
    prompt: Annotation<string>(),
    response: Annotation<string>(),
});

const graph = new StateGraph(GraphState)
    .addNode("gate", gateNode)
    .addNode("model", modelNode)
    .addEdge(START, "gate")
    .addEdge("gate", "model")
    .addEdge("model", END);

const compiledGraph = graph.compile();
export default compiledGraph;