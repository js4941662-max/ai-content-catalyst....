
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineArticle = async (article: string): Promise<string> => {
    const prompt = `Your task is to transform the provided article into a masterclass of scientific communication. Follow this two-step process:

Step 1: Deep Analysis
First, meticulously analyze the provided article. Identify the core scientific principles, the most critical data points, the primary conclusions, and the broader implications for the biotech industry.

Step 2: Authoritative & Accessible Rewrite
Rewrite the article with two simultaneous goals:
1.  **MD/PhD-Level Insight:** The analysis and perspective must be sharp, authoritative, and demonstrate a deep understanding of the subject matter, as if written by an expert for experts.
2.  **Universal Clarity:** The language must be pristine, clean, clear, and concise. Avoid jargon where possible, and if a technical term is necessary, ensure its meaning is implicitly understood from the context. A smart but non-expert reader should grasp the full meaning effortlessly.

Before outputting the final text, perform a self-correction pass. Check that every key fact from the original is preserved with 100% accuracy. Ensure the tone is confident and insightful. The result should be pure value, stripped of all fluff.

Here is the article:
---
${article}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error refining article:", error);
        throw new Error("Failed to communicate with the AI model for refining.");
    }
};

export const generateLinkedInPost = async (refinedArticle: string): Promise<string> => {
    const prompt = `You are a world-class biotech strategist with an MD/PhD. Your task is to synthesize the provided refined article into a single, unbeatable LinkedIn post. This is not a summary; it is a multi-layered, strategic analysis. Your process must integrate insights from diverse, high-quality sources to create a post no one else could.

**Mandatory Synthesis Process:**

1.  **Scientific & Clinical Deep Dive (PubMed/bioRxiv Lens):** Go beyond the surface-level news. What is the deep scientific mechanism at play? For a clinical hold, is it related to the delivery vehicle (LNP), the payload (e.g., Cas9 immunogenicity), or an off-target effect? Formulate a crisp, insightful explanation of the core scientific challenge this news reveals.

2.  **Investor & Market Analysis (Investor Sentiment Lens):** What is the core strategic question this raises for the company and its competitors? The key is to frame the narrative around risk and opportunity. Is this a contained, target-specific issue, or does it threaten the entire platform technology? How does the company's response (e.g., differentiating other assets in their pipeline) demonstrate savvy risk management? This is the crucial insight for the market.

3.  **Innovation & Future Outlook (Google Scholar/GitHub Lens):** Connect the problem to the future solution. What is the next frontier of research this event highlights? Reference the cutting-edge work being done to solve this class of problem—think de-immunized nucleases, novel delivery systems, computational protein engineering, etc. This shows you're not just reporting news, you're tracking the trajectory of innovation.

**Execution:**

*   Forge these three layers of analysis into a single, cohesive, and powerful narrative.
*   Start with a hook that immediately establishes the event's significance.
*   The post must be concise, authoritative, and optimized for a sophisticated LinkedIn audience.
*   Before finalizing, perform a 99% confidence check: Is every statement factually sound and defensible? Is the strategic insight sharp and non-obvious? Is the language pristine?

Refined Article:
---
${refinedArticle}
---

Produce the final, single, unbeatable post in the specified JSON format.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        post: {
                            type: Type.STRING,
                            description: "The single, unbeatable, fully synthesized LinkedIn post.",
                        },
                    },
                    required: ["post"],
                },
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed.post && typeof parsed.post === 'string') {
            return parsed.post;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error("Error generating LinkedIn post:", error);
        throw new Error("Failed to communicate with the AI model for post generation.");
    }
};
