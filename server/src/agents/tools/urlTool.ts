import { DynamicTool } from "@langchain/core/tools";
import axios from "axios";

export const urlTool = new DynamicTool({
    name: "read_url",
    description: "Read the content of a specific URL. Useful for deep dives into articles, documentation, or study materials.",
    func: async (url: string) => {
        try {
            const cleanUrl = url.trim().replace(/^['"]|['"]$/g, "");
            const res = await axios.get(`https://r.jina.ai/${cleanUrl}`);
            return res.data;
        } catch (error: any) {
            console.error("URL Reader Error:", error);
            return `Error reading URL: ${error.message}`;
        }
    },
});
