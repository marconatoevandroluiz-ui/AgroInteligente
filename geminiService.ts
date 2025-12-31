
import { GoogleGenAI, Type } from "@google/genai";
import { AIAgentRole, ChatMessage } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AGENT_SYSTEM_INSTRUCTIONS: Record<AIAgentRole, string> = {
  'Veterinário': 'Você é um médico veterinário especialista em sanidade de rebanhos de corte. Sugira protocolos de vacinação, vermifugação e diagnóstico de doenças comuns no pasto e confinamento.',
  'Nutricionista': 'Você é um zootecnista sênior focado em nutrição de precisão. Ajude a formular dietas (pasto, suplementação, semiconfinamento) focando no Ganho Médio Diário (GMD).',
  'Mercado': 'Você é um analista de mercado de commodities (Boi Gordo). Analise os ciclos da pecuária, preços do CEPEA, B3 e sugira o melhor momento para compra/venda de animais.',
  'Pastagens': 'Você é especialista em forragicultura. Foco em manejo rotacionado, taxa de lotação (UA/ha), adubação de pasto e controle de invasoras.',
  'Financeiro': 'Você é consultor de gestão financeira pecuária. Calcule o custo da arroba produzida, ROI sobre o rebanho e EBITDA da operação.',
  'Agrônomo': 'Você é um engenheiro agrônomo especialista em lavouras de grãos (Soja/Milho). Ajude no manejo do solo, controle de pragas, adubação e planejamento de safra.',
  'Pecuário': 'Você é um especialista em pecuária de corte. Foco em manejo de rebanho, reprodução animal, bem-estar e melhoramento genético.',
  'Gestão': 'Você é um consultor de gestão rural. Ajude na logística de insumos, gestão de pessoas no campo e otimização de processos operacionais.',
  'Relatórios': 'Você é um analista de dados do agronegócio. Ajude a interpretar KPIs (Indicadores Chave de Desempenho) financeiros, produtivos e zootécnicos.'
};

export async function askAgent(role: AIAgentRole, prompt: string, history: ChatMessage[] = []): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: AGENT_SYSTEM_INSTRUCTIONS[role],
        temperature: 0.7,
      },
    });
    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("AI Agent Error:", error);
    return "Ocorreu um erro ao conectar com a IA do PecuáriaPro.";
  }
}

export async function getMarketQuotes(): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Busque as cotações atuais para: Dólar Comercial (BRL), Saca de Soja 60kg (CEPEA/Paranaguá), Saca de Milho 60kg (CEPEA) e Arroba do Boi Gordo (CEPEA/B3). Retorne os valores e a tendência de hoje.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.STRING },
                  change: { type: Type.STRING },
                  trend: { type: Type.STRING, description: "up, down, stable" },
                  source: { type: Type.STRING }
                },
                required: ["name", "value", "change", "trend", "source"]
              }
            }
          },
          required: ["quotes"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Market Quotes Error:", error);
    return { quotes: [] };
  }
}

export async function generateAgriculturalForecast(location: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma previsão climática focada em pecuária para ${location}. Considere umidade para o crescimento do pasto e estresse térmico animal.`,
      config: {
        systemInstruction: "Você é um consultor meteorológico para pecuária. Forneça dados estruturados focando em crescimento forrageiro e conforto térmico.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            current: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER }
              },
              required: ["temp", "condition", "humidity", "windSpeed"]
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  max: { type: Type.NUMBER },
                  min: { type: Type.NUMBER },
                  condition: { type: Type.STRING },
                  rainProb: { type: Type.NUMBER }
                }
              }
            },
            agriInsights: {
              type: Type.OBJECT,
              properties: {
                sprayingStatus: { type: Type.STRING, description: "Conforto Térmico: Favorável, Alerta ou Crítico" },
                harvestWindow: { type: Type.STRING, description: "Crescimento de Pasto" },
                generalAdvice: { type: Type.STRING }
              }
            }
          },
          required: ["current", "forecast", "agriInsights"]
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Weather Service Error:", error);
    return null;
  }
}
