
import { GoogleGenAI, Type } from "@google/genai";
import { Currency } from "../types";

export class GeminiService {
  constructor() {}

  async analyzeFinance(prompt: string, lang: 'en' | 'cn' = 'en', currency: Currency = 'USD') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Context: You are the Xallet AI Wealth Strategist for the 2026 Global Financial Reorder era.
        Language Preference: ${lang === 'cn' ? 'Please respond primarily in Chinese, but keep technical financial terms bilingual if helpful.' : 'Respond in English.'}
        User Currency: ${currency} (Always mention values in this currency if giving specific examples).
        
        Focus areas for 2026:
        - The massive surge in Silver (Ag) and physical assets.
        - Strategic allocation: Investment vs. Operations vs. Savings.
        - Crypto-fiat rebalancing in a volatile decade.
        
        User Query: ${prompt}
        
        Style: Professional, analytical, OKX-wallet-assistant style. Persona name: Xallet.`,
        config: {
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
      return response.text;
    } catch (error: any) {
      console.error("Gemini Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        return "KEY_RESET";
      }
      return lang === 'cn' ? "抱歉，分析市场时出现错误。" : "Sorry, error analyzing market data.";
    }
  }

  async analyzeReceipt(base64Data: string, mimeType: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract merchant name, total amount (number only, numeric), date (YYYY-MM-DD), and category. Return as a plain JSON object with keys: merchant, amount, date, category.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchant: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              date: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Receipt Analysis Error:", error);
      throw error;
    }
  }

  async analyzeIncome(base64Data: string, mimeType: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract the source/payer name, total income amount (number only, numeric), date (YYYY-MM-DD), and income category (e.g., Salary, Investment Return, Freelance). Return as a plain JSON object with keys: source, amount, date, category.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              date: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Income Analysis Error:", error);
      throw error;
    }
  }

  async editImage(base64Data: string, mimeType: string, prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Edit Error:", error);
      throw error;
    }
  }

  async generateImage(prompt: string, imageSize: "1K" | "2K" | "4K" = "1K", aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" = "1:1") {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_RESET");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
