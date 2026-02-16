
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (transactions: Transaction[]): Promise<AIInsight> => {
  if (transactions.length === 0) {
    return {
      summary: "הוסיפו כמה עסקאות כדי לקבל תובנות מבוססות בינה מלאכותית!",
      tip: "מעקב אחר הקפה היומי הוא מקום מצוין להתחיל בו."
    };
  }

  const prompt = `Analyze the following transaction history. Provide a concise, encouraging summary of spending habits and one specific, actionable tip for saving money.
  IMPORTANT: Both the summary and the tip MUST be written in Hebrew.
  Transactions: ${JSON.stringify(transactions)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A summary in Hebrew.'
            },
            tip: {
              type: Type.STRING,
              description: 'A saving tip in Hebrew.'
            }
          },
          required: ["summary", "tip"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      summary: result.summary || "אתם עושים עבודה נהדרת במעקב אחר הכספים שלכם!",
      tip: result.tip || "שקלו להציב תקציב לקטגוריה עם ההוצאה הגבוהה ביותר."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "לא ניתן לייצר תובנות כרגע.",
      tip: "המשיכו לעקוב אחר ההוצאות שלכם כדי להישאר בשליטה."
    };
  }
};
