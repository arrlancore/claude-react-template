import { GeminiClient } from "@/lib/ai/gemini";

describe("Real AI System Integration Tests", () => {
  describe("GeminiClient", () => {
    let client: GeminiClient;

    test("should generate response with Gemini Flash and real API key", async () => {
      const apiKey: string = process.env.GOOGLE_AI_API_KEY!;

      if (!apiKey || apiKey === "test-api-key") {
        console.warn(
          "Skipping Gemini Flash test because GOOGLE_AI_API_KEY is not set."
        );
        return test.skip;
      }

      client = new GeminiClient({
        apiKey: apiKey,
        proModel: "gemini-1.5-pro",
        flashModel: "gemini-1.5-flash",
      });

      const response = await client.generateResponse(
        "What is the capital of France?",
        {
          model: "flash",
          maxTokens: 20,
        }
      );

      expect(response).toHaveProperty("content");
      console.log("Gemini Flash Response:", response.content);
      expect(response.content).toContain("Paris");
    }, 10000);
  });
});
