import { GoogleGenAI, Type } from "@google/genai";

// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is a data URL (e.g., "data:image/jpeg;base64,..."), we only need the base64 part
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

// FIX: Removed React logic from service. The service now returns data, and the component handles rendering.
export const estimateWeightFromImage = async (imageFile: File): Promise<{ estimatedWeightKg: number, reasoning: string }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const base64Image = await fileToBase64(imageFile);

    const prompt = `Analise a imagem deste caprino (cabra ou ovelha). Estime seu peso vivo em quilogramas. Forneça um breve raciocínio para sua estimativa, considerando a raça aparente, a condição corporal e o desenvolvimento muscular. Retorne o resultado como um objeto JSON com as chaves "estimatedWeightKg" (um número) e "reasoning" (uma string).`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            estimatedWeightKg: {
                type: Type.NUMBER,
                description: "O peso estimado do animal em quilogramas."
            },
            reasoning: {
                type: Type.STRING,
                description: "A justificativa para a estimativa de peso."
            }
        },
        required: ["estimatedWeightKg", "reasoning"]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: imageFile.type,
                        data: base64Image,
                    },
                },
                { text: prompt },
            ],
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const jsonString = response.text.trim();
    
    try {
        const result = JSON.parse(jsonString);
        if (typeof result.estimatedWeightKg === 'number' && typeof result.reasoning === 'string') {
            return result;
        } else {
            throw new Error("Resposta da IA está em um formato inválido.");
        }
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonString);
        throw new Error("Não foi possível processar a resposta da IA. Tente uma imagem diferente.");
    }
};