import { DetailedStats } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Gemini API Key loaded:", API_KEY ? "Yes" : "No");
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

function formatSeconds(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}min${remainingSeconds}s`;
}

export const getBehavioralInsight = async (stats: DetailedStats): Promise<string> => {
    if (!API_KEY) {
        return "API Key do Gemini não encontrada. Verifique o arquivo .env.local.";
    }

    const { winRate, avgWinDuration, avgLossDuration, positiveDays, negativeDays, totalTrades } = stats;

    const prompt = `
        Você é um coach de performance para traders de mercado financeiro. Sua tarefa é analisar um conjunto de dados estatísticos de um trader e gerar um insight comportamental conciso, um diagnóstico e uma dica prática.

        Seja direto e use uma linguagem clara. O trader é brasileiro.

        **Formato da Resposta (use EXATAMENTE este formato):**
        **Diagnóstico:** (Um título curto para o viés comportamental, ex: Impulsividade, Aversão à Perda, Excesso de Confiança)
        **Análise:** (Uma análise de 2 a 3 frases explicando o porquê do diagnóstico, usando os dados fornecidos)
        **Dica:** (Uma dica prática e acionável de 1 a 2 frases para ajudar o trader a melhorar)

        **Dados do Trader:**
        - Taxa de Acerto: ${(winRate * 100).toFixed(1)}%
        - Duração Média dos Ganhos: ${formatSeconds(avgWinDuration)}
        - Duração Média das Perdas: ${formatSeconds(avgLossDuration)}
        - Total de Dias com Ganhos: ${positiveDays}
        - Total de Dias com Perdas: ${negativeDays}
        - Total de Trades: ${totalTrades}

        Com base nesses dados, forneça sua análise.
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const insight = data.candidates[0].content.parts[0].text;
        return insight;

    } catch (error) {
        console.error("Error fetching Gemini insights:", error);
        return "Ocorreu um erro ao buscar os insights da IA. Tente novamente mais tarde.";
    }
};