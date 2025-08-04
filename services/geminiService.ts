import { GoogleGenerativeAI, ChatSession } from "@google/genai";
import { configService } from "./configService";

export interface Product {
  title: string;
  price: string;
  image_url: string;
  product_url: string;
  error?: string;
}

// Função para obter instância do Gemini AI
const getGeminiAI = (): GoogleGenerativeAI => {
  const config = configService.get('gemini');
  
  if (!config.apiKey) {
    // Fallback para variável de ambiente se não houver configuração
    const envApiKey = process.env.API_KEY;
    if (!envApiKey) {
      throw new Error("Chave de API do Gemini não configurada. Configure em Painel Administrativo > APIs.");
    }
    return new GoogleGenerativeAI(envApiKey);
  }
  
  return new GoogleGenerativeAI(config.apiKey);
};

// Função para obter configurações do Gemini
const getGeminiConfig = () => {
  const config = configService.get('gemini');
  return {
    temperature: config.temperature || 0.7,
    systemPrompt: config.systemPrompt || "Você é um assistente de IA prestativo e amigável chamado ACI. Suas respostas devem ser úteis e informativas. Responda em português do Brasil."
  };
};

export const generateShopeeLinkFromApi = async (productUrl: string, affiliateId: string): Promise<string> => {
  const prompt = `
    Gere um link de afiliado da Shopee Brasil com base nas informações abaixo.

    URL do Produto: "${productUrl}"
    ID do Afiliado: "${affiliateId}"

    Instruções:
    1. Analise a URL do produto para extrair as informações necessárias.
    2. Construa o link de afiliado usando o formato de URL longa da Shopee com o parâmetro \`af_id\`.
    3. Se o ID do Afiliado for fornecido, adicione-o ao link. Se estiver vazio, gere o link sem o parâmetro \`af_id\`.
    4. A resposta DEVE CONTER APENAS a URL final, sem nenhum texto, explicação, ou formatação de markdown. Retorne apenas a string da URL.
  `;

  try {
    const ai = getGeminiAI();
    
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.2,
        topP: 1,
        topK: 32,
      },
      systemInstruction: "Você é um assistente de IA especialista em gerar links de afiliados para a plataforma Shopee Brasil."
    });
    
    const response = await model.generateContent(prompt);
    return response.response.text().trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate link from Gemini API.");
  }
};

export const searchShopeeProductsFromApi = async (keyword: string): Promise<Product[]> => {
  const prompt = `
    Você é um especialista em buscar produtos na Shopee Brasil.
    Sua tarefa é encontrar produtos relevantes para a palavra-chave fornecida e retornar uma lista em formato JSON.

    Palavra-chave: "${keyword}"

    Instruções:
    1. Busque por produtos na Shopee Brasil que correspondam à palavra-chave.
    2. Retorne uma lista de até 8 produtos.
    3. A resposta DEVE ser um array de objetos JSON.
    4. Cada objeto no array deve ter EXATAMENTE os seguintes campos: \`title\`, \`price\`, \`image_url\`, e \`product_url\`.
    5. O campo \`price\` deve ser uma string formatada como "R$ XX,XX".
    6. O campo \`image_url\` deve ser um link direto para a imagem do produto.
    7. O campo \`product_url\` deve ser a URL completa da página do produto na Shopee.
    8. NÃO inclua nenhum texto, explicação ou formatação de markdown. A resposta deve ser apenas o array JSON.

    Exemplo de formato de saída:
    [
      {
        "title": "Nome do Produto Exemplo 1",
        "price": "R$ 99,90",
        "image_url": "https://url.da.imagem/exemplo1.jpg",
        "product_url": "https://shopee.com.br/url-do-produto-1"
      }
    ]
  `;

  try {
    const ai = getGeminiAI();
    const geminiConfig = getGeminiConfig();
    
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: Math.min(geminiConfig.temperature * 0.5, 0.3),
      }
    });
    
    const response = await model.generateContent(prompt);
    let jsonStr = response.response.text().trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    
    if (!Array.isArray(parsedData)) {
        throw new Error("API did not return a valid array of products.");
    }
    
    return parsedData as Product[];

  } catch (error) {
    console.error("Error calling Gemini API for product search:", error);
    throw new Error("Failed to search for products from Gemini API.");
  }
};

export const getTopSalesFromApi = async (category: string): Promise<Product[]> => {
  const prompt = `
    Você é um especialista em encontrar os produtos mais vendidos na Shopee Brasil.
    Sua tarefa é encontrar os produtos mais vendidos para a categoria fornecida e retornar uma lista em formato JSON.

    Categoria: "${category}"

    Instruções:
    1. Busque pelos produtos mais populares e com mais vendas na Shopee Brasil que correspondam à categoria.
    2. Retorne uma lista de até 8 produtos.
    3. A resposta DEVE ser um array de objetos JSON.
    4. Cada objeto no array deve ter EXATAMENTE os seguintes campos: \`title\`, \`price\`, \`image_url\`, e \`product_url\`.
    5. O campo \`price\` deve ser uma string formatada como "R$ XX,XX".
    6. O campo \`image_url\` deve ser um link direto para a imagem do produto.
    7. O campo \`product_url\` deve ser a URL completa da página do produto na Shopee.
    8. NÃO inclua nenhum texto, explicação ou formatação de markdown. A resposta deve ser apenas o array JSON.
  `;

  try {
    const ai = getGeminiAI();
    const geminiConfig = getGeminiConfig();
    
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: Math.min(geminiConfig.temperature * 0.5, 0.3),
      }
    });
    
    const response = await model.generateContent(prompt);
    let jsonStr = response.response.text().trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    
    if (!Array.isArray(parsedData)) {
        throw new Error("API did not return a valid array of products.");
    }
    
    return parsedData as Product[];

  } catch (error) {
    console.error("Error calling Gemini API for top sales search:", error);
    throw new Error("Failed to search for top sales from Gemini API.");
  }
};

export const generateTelegramMessageFromApi = async (topic: string): Promise<string> => {
    const prompt = `
        Crie uma mensagem de marketing curta e persuasiva para um canal do Telegram sobre o seguinte tópico: "${topic}".
        A mensagem deve:
        - Ser cativante e gerar curiosidade.
        - Usar emojis de forma relevante e sem exagero.
        - Ter no máximo 3 parágrafos curtos.
        - Incluir uma chamada para ação (call to action) clara.
        - A resposta DEVE conter apenas o texto da mensagem, sem explicações ou markdown.
    `;

    try {
        const ai = getGeminiAI();
        const geminiConfig = getGeminiConfig();
        
        const model = ai.getGenerativeModel({ 
          model: 'gemini-pro',
          generationConfig: {
            temperature: geminiConfig.temperature,
            topP: 1,
            topK: 40,
          }
        });
        
        const response = await model.generateContent(prompt);
        return response.response.text().trim();
    } catch (error) {
        console.error("Error calling Gemini API for Telegram message:", error);
        throw new Error("Failed to generate Telegram message from Gemini API.");
    }
};

export const getShopeeProductDetailsFromUrl = async (productUrl: string): Promise<Product> => {
  const prompt = `
    Você é um assistente especialista em extrair informações de páginas de produtos da Shopee Brasil.
    Sua tarefa é analisar a URL de um produto e retornar seus detalhes em formato JSON.

    URL do Produto: "${productUrl}"

    Instruções:
    1. Analise o conteúdo da URL fornecida para extrair o título do produto, o preço atual e a URL da imagem principal.
    2. A resposta DEVE ser um único objeto JSON.
    3. O objeto deve ter EXATAMENTE os seguintes campos: \`title\`, \`price\`, \`image_url\`, e \`product_url\`.
    4. O campo \`price\` deve ser uma string formatada como "R$ XX,XX".
    5. O campo \`product_url\` deve ser a mesma URL de entrada.
    6. Se a URL for inválida ou não for de um produto da Shopee, retorne um objeto JSON com uma chave \`error\` e o valor "URL inválida ou não é um produto Shopee.".
    7. NÃO inclua nenhum texto, explicação ou formatação de markdown. A resposta deve ser apenas o objeto JSON.
  `;

  try {
    const ai = getGeminiAI();
    
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.1,
      }
    });

    const response = await model.generateContent(prompt);
    let jsonStr = response.response.text().trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    return JSON.parse(jsonStr) as Product;
    
  } catch (error) {
    console.error("Error calling Gemini API for product details:", error);
    throw new Error("Failed to get product details from Gemini API.");
  }
};

export const generateShopeeOfferMessageFromApi = async (product: Product): Promise<string> => {
  const prompt = `
    Você é um copywriter de marketing digital especialista em criar ofertas irresistíveis para o Telegram.
    Sua tarefa é criar uma mensagem de marketing persuasiva para o produto da Shopee fornecido.

    Detalhes do Produto:
    - Título: "${product.title}"
    - Preço: "${product.price}"

    Instruções:
    1. Crie uma mensagem curta, cativante e com senso de urgência.
    2. Use emojis relevantes para destacar a oferta (ex: ✨, 💰, 🔥, 🚀).
    3. Destaque o nome do produto e o preço de forma clara.
    4. A mensagem deve ser otimizada para leitura rápida em dispositivos móveis, usando quebras de linha para boa formatação.
    5. NÃO inclua o link do produto na mensagem, pois ele será adicionado em um botão.
    6. A resposta DEVE ser apenas o texto da mensagem, sem saudações, explicações ou markdown.
  `;

  try {
    const ai = getGeminiAI();
    const geminiConfig = getGeminiConfig();
    
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: geminiConfig.temperature,
        topP: 1,
        topK: 40,
      }
    });
    
    const response = await model.generateContent(prompt);
    return response.response.text().trim();
  } catch (error) {
    console.error("Error calling Gemini API for Shopee offer:", error);
    throw new Error("Failed to generate Shopee offer message from Gemini API.");
  }
};

export const generateImageFromApi = async (prompt: string): Promise<string> => {
  try {
    // Nota: A geração de imagens pode não estar disponível na versão atual
    // Esta é uma implementação placeholder
    throw new Error("Geração de imagens não disponível no momento. Configure uma API de imagens externa.");
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error("Failed to generate image from Gemini API.");
  }
};

export const createChat = (): ChatSession => {
  const ai = getGeminiAI();
  const geminiConfig = getGeminiConfig();
  
  const model = ai.getGenerativeModel({ 
    model: 'gemini-pro',
    generationConfig: {
      temperature: geminiConfig.temperature,
    },
    systemInstruction: geminiConfig.systemPrompt
  });
  
  return model.startChat();
};

export const sendTelegramMessage = async (botToken: string, chatId: string, message: string, imageUrl?: string, buttonUrl?: string): Promise<boolean> => {
  try {
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/${imageUrl ? 'sendPhoto' : 'sendMessage'}`;
    
    let payload: any = {
      chat_id: chatId,
    };

    if (imageUrl) {
      payload.photo = imageUrl;
      payload.caption = message;
    } else {
      payload.text = message;
    }

    if (buttonUrl) {
      payload.reply_markup = {
        inline_keyboard: [[
          {
            text: "🛒 Comprar Agora",
            url: buttonUrl
          }
        ]]
      };
    }

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
};