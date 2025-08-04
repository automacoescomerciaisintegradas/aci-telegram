import { configService } from './configService';

export interface ShopeeAffiliateConfig {
  affiliateId?: string;
  apiKey?: string;
}

export interface BitlyConfig {
  accessToken?: string;
}

export interface ShopeeProduct {
  id: string;
  title: string;
  price: string;
  originalUrl: string;
  affiliateUrl: string;
}

class ShopeeAffiliateService {
  
  /**
   * Gera um link de afiliado do Shopee
   */
  generateAffiliateLink(productUrl: string, customAffiliateId?: string): string {
    try {
      // Validar se é uma URL válida do Shopee
      if (!this.isValidShopeeUrl(productUrl)) {
        throw new Error('URL inválida. Por favor, insira uma URL válida do Shopee Brasil.');
      }

      // Obter configurações do Shopee
      const config = configService.get('shopee');
      const affiliateId = customAffiliateId || config.affiliateId;

      if (!affiliateId) {
        throw new Error('ID de afiliado não configurado. Configure em Painel Administrativo > APIs > Shopee.');
      }

      // Limpar a URL e extrair informações
      const cleanUrl = this.cleanShopeeUrl(productUrl);
      
      // Gerar link de afiliado
      const affiliateUrl = this.buildAffiliateUrl(cleanUrl, affiliateId);
      
      return affiliateUrl;
    } catch (error) {
      console.error('Erro ao gerar link de afiliado:', error);
      throw error;
    }
  }

  /**
   * Valida se a URL é do Shopee Brasil
   */
  private isValidShopeeUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('shopee.com.br') || 
             urlObj.hostname.includes('shp.ee') ||
             urlObj.hostname.includes('shopee.com');
    } catch {
      return false;
    }
  }

  /**
   * Limpa a URL removendo parâmetros desnecessários
   */
  private cleanShopeeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Manter apenas parâmetros essenciais
      const essentialParams = ['sp_atk', 'xptdk'];
      const cleanParams = new URLSearchParams();
      
      essentialParams.forEach(param => {
        const value = urlObj.searchParams.get(param);
        if (value) {
          cleanParams.set(param, value);
        }
      });

      // Reconstruir URL limpa
      const cleanUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
      const paramString = cleanParams.toString();
      
      return paramString ? `${cleanUrl}?${paramString}` : cleanUrl;
    } catch {
      return url;
    }
  }

  /**
   * Constrói a URL de afiliado
   */
  private buildAffiliateUrl(cleanUrl: string, affiliateId: string): string {
    try {
      const urlObj = new URL(cleanUrl);
      
      // Adicionar parâmetro de afiliado
      urlObj.searchParams.set('af_id', affiliateId);
      
      // Adicionar timestamp para tracking
      urlObj.searchParams.set('af_timestamp', Date.now().toString());
      
      return urlObj.toString();
    } catch {
      // Fallback: adicionar parâmetros manualmente
      const separator = cleanUrl.includes('?') ? '&' : '?';
      return `${cleanUrl}${separator}af_id=${affiliateId}&af_timestamp=${Date.now()}`;
    }
  }

  /**
   * Extrai informações do produto da URL
   */
  async extractProductInfo(productUrl: string): Promise<Partial<ShopeeProduct>> {
    try {
      if (!this.isValidShopeeUrl(productUrl)) {
        throw new Error('URL inválida do Shopee');
      }

      // Extrair ID do produto da URL
      const urlObj = new URL(productUrl);
      const pathParts = urlObj.pathname.split('/');
      const productId = pathParts[pathParts.length - 1] || 'unknown';

      return {
        id: productId,
        originalUrl: productUrl,
        title: 'Produto do Shopee', // Placeholder - seria obtido via scraping ou API
        price: 'Consulte no site' // Placeholder - seria obtido via scraping ou API
      };
    } catch (error) {
      console.error('Erro ao extrair informações do produto:', error);
      throw new Error('Não foi possível extrair informações do produto');
    }
  }

  /**
   * Valida se o ID de afiliado está no formato correto
   */
  validateAffiliateId(affiliateId: string): boolean {
    if (!affiliateId || affiliateId.trim() === '') {
      return false;
    }

    // ID de afiliado do Shopee geralmente é numérico
    return /^\d+$/.test(affiliateId.trim());
  }

  /**
   * Obtém configurações do Shopee
   */
  getConfig(): ShopeeAffiliateConfig {
    return configService.get('shopee');
  }

  /**
   * Verifica se o serviço está configurado
   */
  isConfigured(): boolean {
    return configService.isConfigured('shopee');
  }

  /**
   * Gera múltiplos links de afiliado
   */
  generateMultipleAffiliateLinks(productUrls: string[], customAffiliateId?: string): ShopeeProduct[] {
    return productUrls.map((url, index) => {
      try {
        const affiliateUrl = this.generateAffiliateLink(url, customAffiliateId);
        return {
          id: `product_${index + 1}`,
          title: `Produto ${index + 1}`,
          price: 'Consulte no site',
          originalUrl: url,
          affiliateUrl
        };
      } catch (error) {
        return {
          id: `product_${index + 1}`,
          title: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          price: '',
          originalUrl: url,
          affiliateUrl: ''
        };
      }
    });
  }

  /**
   * Encurta URL usando o Bitly.
   */
  async shortenLink(longUrl: string): Promise<{ link: string }> {
    try {
      const config = configService.get('bitly');
      const accessToken = config.accessToken;

      if (!accessToken) {
        throw new Error('Token de acesso do Bitly não configurado. Configure em Painel Administrativo > APIs > Bitly.');
      }

      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ long_url: longUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao encurtar link: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return { link: data.link };
    } catch (error) {
      console.error('Erro ao encurtar link com Bitly:', error);
      throw error;
    }
  }
}

// Instância singleton
export const shopeeAffiliateService = new ShopeeAffiliateService();