import { DynamicTool } from "@langchain/core/tools";
import axios from "axios";

export const searchTool = new DynamicTool({
    name: "tavily_search_results_json",
    description: "Search the web for real-time information using Tavily. Returns a list of search results with titles, snippets, and URLs.",
    func: async (query: string) => {
        try {
            const res = await axios.post("https://api.tavily.com/search", {
                api_key: process.env.TAVILY_API_KEY,
                query: query.trim().replace(/^['"]|['"]$/g, ""),
                max_results: 5,
            });
            return JSON.stringify(res.data.results);
        } catch (error: any) {
            console.error("Tavily Search Error:", error);
            return `Error searching Tavily: ${error.message}`;
        }
    },
});
