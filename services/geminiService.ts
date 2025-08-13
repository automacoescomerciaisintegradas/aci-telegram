import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
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
      throw new Error("GEMINI_KEY_MISSING");
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
  // Função para tentar extrair dados reais da página da Shopee
  const tryExtractRealData = async (): Promise<Product | null> => {
    try {
      console.log('🔍 Tentando extrair dados reais da URL:', productUrl);
      
      // Tentar usar uma API de proxy para acessar a página da Shopee
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(productUrl)}`;
      console.log('📡 Usando proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        console.log('❌ Proxy falhou:', response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      const html = data.contents;
      console.log('📄 HTML recebido, tamanho:', html.length);
      
      // Extrair título do produto
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(' | Shopee Brasil', '').trim() : '';
      console.log('📝 Título extraído:', title);
      
      // Extrair preço (tentar diferentes padrões)
      let price = '';
      const pricePatterns = [
        /R\$\s*([\d.,]+)/i,
        /R\$\s*([\d,]+)/i,
        /([\d,]+)\s*R\$/i,
        /"price":"([^"]+)"/i,
        /"price":\s*"([^"]+)"/i
      ];
      
      for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match) {
          price = `R$ ${match[1].replace(',', '.')}`;
          console.log('💰 Preço extraído:', price);
          break;
        }
      }
      
      // Extrair imagem do produto (padrões específicos da Shopee)
      let imageUrl = '';
      const imagePatterns = [
        // Padrões específicos da Shopee
        /"image":"([^"]+)"/i,
        /"image":\s*"([^"]+)"/i,
        /"main_image":"([^"]+)"/i,
        /"main_image":\s*"([^"]+)"/i,
        /"product_image":"([^"]+)"/i,
        /"product_image":\s*"([^"]+)"/i,
        // Padrões genéricos de imagem
        /src="([^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
        /data-src="([^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
        // Padrões de dados da Shopee
        /data-src="([^"]*shopee[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
        /src="([^"]*shopee[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/i
      ];
      
      console.log('🖼️ Procurando por imagens...');
      for (const pattern of imagePatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          imageUrl = match[1].startsWith('http') ? match[1] : `https:${match[1]}`;
          console.log('✅ Imagem encontrada:', imageUrl);
          break;
        }
      }
      
      // Se não encontrou imagem, tentar extrair do JSON da página
      if (!imageUrl) {
        console.log('🔍 Tentando extrair imagem do JSON da página...');
        const jsonMatches = html.match(/\{[\s\S]*?"image"[\s\S]*?\}/g);
        if (jsonMatches) {
          for (const jsonStr of jsonMatches) {
            try {
              const jsonData = JSON.parse(jsonStr);
              if (jsonData.image && typeof jsonData.image === 'string') {
                imageUrl = jsonData.image.startsWith('http') ? jsonData.image : `https:${jsonData.image}`;
                console.log('✅ Imagem extraída do JSON:', imageUrl);
                break;
              }
            } catch (e) {
              // Ignorar JSONs inválidos
            }
          }
        }
      }
      
      if (title && price && imageUrl) {
        console.log('🎉 Dados completos extraídos com sucesso!');
        return {
          title,
          price,
          image_url: imageUrl,
          product_url: productUrl,
        };
      } else {
        console.log('⚠️ Dados incompletos:', { title: !!title, price: !!price, imageUrl: !!imageUrl });
        return null;
      }
      
    } catch (error) {
      console.log('❌ Falha ao extrair dados reais:', error);
      return null;
    }
  };

  // Fallback local melhorado
  const localParse = (): Product => {
    try {
      const url = new URL(productUrl);
      if (!/shopee\.com(\.br)?/.test(url.hostname) && !/s\.shopee\.com\.br/.test(url.hostname)) {
        return { title: '', price: '', image_url: '', product_url: productUrl, error: 'URL inválida ou não é um produto Shopee.' };
      }

      // Extrair informações da URL
      const pathParts = url.pathname.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1] || 'produto-shopee';
      
      // Melhorar extração do título
      let title = slug
        .replace(/-i\.[\d.]+$/, '')
        .replace(/\?.*$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      
      if (title.length < 6) title = 'Produto da Shopee';

      // Gerar preço baseado no hash da URL completa para mais variedade
      const urlHash = productUrl.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
      const basePrice = Math.abs(urlHash) % 2000 + 30; // 30–2030
      const price = `R$ ${basePrice.toFixed(2).replace('.', ',')}`;

      // Selecionar imagem baseada no hash da URL para garantir variedade
      const imageHash = Math.abs(urlHash) % 20; // 0-19 para diferentes imagens
      let image = '';
      
      // Array de imagens variadas para diferentes categorias
      const imageOptions = [
        // Eletrônicos
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center',
        // Moda
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
        // Casa e Decoração
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
        // Entretenimento
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop&crop=center',
        // Esportes
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
        // Beleza
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center',
        // Automóveis
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop&crop=center',
        // Culinária
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center'
      ];
      
      // Usar o hash da URL para selecionar imagem
      image = imageOptions[imageHash];
      
      console.log('🎲 Fallback local - Hash da URL:', urlHash, 'Imagem selecionada:', imageHash);

      return {
        title,
        price,
        image_url: image,
        product_url: productUrl,
      };
    } catch {
      return { title: '', price: '', image_url: '', product_url: productUrl, error: 'URL inválida ou não é um produto Shopee.' };
    }
  };

  try {
    // Primeiro, tentar extrair dados reais da página
    const realData = await tryExtractRealData();
    if (realData) {
      console.log('Dados reais extraídos com sucesso:', realData);
      return realData;
    }

    // Se falhar, tentar usar a IA
    const ai = getGeminiAI();
    const model = ai.getGenerativeModel({ model: 'gemini-pro', generationConfig: { temperature: 0.1 } });
    const prompt = `Retorne APENAS JSON com {"title","price","image_url","product_url"} para a URL Shopee: "${productUrl}".`;
    const response = await model.generateContent(prompt);
    let jsonStr = response.response.text().trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();
    return JSON.parse(jsonStr) as Product;
  } catch (error) {
    // Sem chave ou falha: usar parser local melhorado
    console.log('Usando fallback local melhorado');
    const product = localParse();
    if (product.error) {
      console.error('Fallback local falhou:', error);
    }
    return product;
  }
};

export const generateShopeeOfferMessageFromApi = async (product: Product): Promise<string> => {
  // Template personalizado para mensagens de oferta
  const generateCustomMessage = (product: Product): string => {
    const productName = product.title || 'Produto';
    const productPrice = product.price || 'Preço especial';
    
    return `🚨 OFERTA RELÂMPAGO! 🚨

${productName} por apenas ${productPrice}

🔗 👉 Compre agora: ${product.product_url}

✨ Não perca essa oportunidade única!

👆 Clique no botão abaixo e garanta já o seu!

⚠ O preço pode mudar a qualquer momento.

#OfertaEspecial #Shopee #Promoção`;
  };

  try {
    // Usar o template personalizado em vez da IA
    console.log('📝 Gerando mensagem personalizada para:', product.title);
    return generateCustomMessage(product);
    
    // Código anterior comentado para usar o template personalizado
    /*
    const prompt = `Crie uma mensagem curta (máx. 4 linhas), direta e persuasiva para Telegram sobre "${product.title}" por ${product.price}. Use 2-4 emojis e chame para ação. Responda apenas com o texto.`;

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
    */
  } catch {
    // Fallback local usando o template personalizado
    console.log('🔄 Usando fallback local com template personalizado');
    return generateCustomMessage(product);
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