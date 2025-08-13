import { shopeeAffiliateService } from './shopeeAffiliateService';
import { configService } from './configService';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  sold_count: number;
  affiliate_earning: string;
  min_price: string;
  max_price: string;
  commission_rate: string;
  discount: string;
  category: string;
  original_url: string;
  affiliate_url: string;
  short_url?: string;
}

export interface SearchFilters {
  category: string;
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
  minSales?: number;
  sortBy?: 'price' | 'sales' | 'discount' | 'commission';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  products: Product[];
  totalResults: number;
  searchTime: number;
  creditsUsed: number;
}

class ProductSearchService {
  private readonly CREDIT_COST = 0.03;
  private readonly SHOPEE_API_BASE = 'https://shopee.com.br/api/v4';

  /**
   * Realiza busca de produtos com filtros avançados
   */
  async searchProducts(filters: SearchFilters): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      // Verificar se o usuário tem créditos suficientes
      if (!this.hasEnoughCredits()) {
        throw new Error('Créditos insuficientes para realizar a busca');
      }

      // Verificar se o Shopee está configurado
      if (!shopeeAffiliateService.isConfigured()) {
        throw new Error('Configuração do Shopee não encontrada');
      }

      // Realizar busca na API do Shopee
      const products = await this.searchShopeeProducts(filters);
      
      // Gerar links de afiliado para cada produto
      const productsWithAffiliateLinks = await this.generateAffiliateLinks(products);
      
      // Encurtar URLs se configurado
      const productsWithShortUrls = await this.shortenUrls(productsWithAffiliateLinks);
      
      // Deduzir créditos
      this.deductCredits();
      
      const searchTime = Date.now() - startTime;
      
      return {
        products: productsWithShortUrls,
        totalResults: productsWithShortUrls.length,
        searchTime,
        creditsUsed: this.CREDIT_COST
      };

    } catch (error) {
      console.error('Erro na busca de produtos:', error);
      throw error;
    }
  }

  /**
   * Busca produtos na API do Shopee
   */
  private async searchShopeeProducts(filters: SearchFilters): Promise<Product[]> {
    try {
      // Simular busca real na API do Shopee
      // Em produção, isso seria uma chamada real para a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar produtos baseados nos filtros
      return this.generateRealisticProducts(filters);
      
    } catch (error) {
      console.error('Erro ao buscar produtos no Shopee:', error);
      throw new Error('Falha na busca de produtos');
    }
  }

  /**
   * Gera produtos realistas baseados nos filtros
   */
  private generateRealisticProducts(filters: SearchFilters): Product[] {
    const baseProducts = this.getBaseProductsByCategory(filters.category);
    const filteredProducts = baseProducts.filter(product => 
      product.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );

    // Aplicar filtros de preço
    let finalProducts = filteredProducts;
    if (filters.minPrice) {
      finalProducts = finalProducts.filter(p => 
        parseFloat(p.min_price.replace('R$', '').replace(',', '.')) >= filters.minPrice!
      );
    }
    if (filters.maxPrice) {
      finalProducts = finalProducts.filter(p => 
        parseFloat(p.max_price.replace('R$', '').replace(',', '.')) <= filters.maxPrice!
      );
    }

    // Aplicar ordenação
    if (filters.sortBy) {
      finalProducts = this.sortProducts(finalProducts, filters.sortBy, filters.sortOrder || 'desc');
    }

    // Limitar a 20 produtos para performance
    return finalProducts.slice(0, 20);
  }

  /**
   * Gera links de afiliado para os produtos
   */
  private async generateAffiliateLinks(products: Product[]): Promise<Product[]> {
    const config = configService.getShopeeConfig();
    
    return products.map(product => {
      try {
        const affiliateUrl = shopeeAffiliateService.generateAffiliateLink(
          product.original_url, 
          config.affiliateId
        );
        
        return {
          ...product,
          affiliate_url: affiliateUrl
        };
      } catch (error) {
        console.error(`Erro ao gerar link de afiliado para ${product.id}:`, error);
        return {
          ...product,
          affiliate_url: product.original_url // Fallback para URL original
        };
      }
    });
  }

  /**
   * Encurta URLs usando Bitly se configurado
   */
  private async shortenUrls(products: Product[]): Promise<Product[]> {
    try {
      const bitlyConfig = configService.get('bitly');
      
      if (!bitlyConfig.accessToken) {
        return products; // Retorna sem encurtar se não configurado
      }

      const productsWithShortUrls = await Promise.all(
        products.map(async (product) => {
          try {
            const shortUrl = await shopeeAffiliateService.shortenLink(product.affiliate_url);
            return { ...product, short_url: shortUrl.link };
          } catch (error) {
            console.error(`Erro ao encurtar URL para ${product.id}:`, error);
            return product;
          }
        })
      );

      return productsWithShortUrls;
    } catch (error) {
      console.error('Erro ao encurtar URLs:', error);
      return products;
    }
  }

  /**
   * Gera produtos base por categoria
   */
  private getBaseProductsByCategory(category: string): Product[] {
    const categoryProducts = this.getCategoryProducts(category);
    return categoryProducts.map((product, index) => ({
      ...product,
      id: `${category}_${index + 1}`,
      category,
      original_url: this.generateShopeeUrl(product.title, category),
      affiliate_url: '' // Será preenchido depois
    }));
  }

  /**
   * Gera URL do Shopee baseada no título e categoria
   */
  private generateShopeeUrl(title: string, category: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `https://shopee.com.br/${category}/${slug}-i.${Date.now()}.${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Ordena produtos por critério específico
   */
  private sortProducts(products: Product[], sortBy: string, order: 'asc' | 'desc'): Product[] {
    return [...products].sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.min_price.replace('R$', '').replace(',', '.'));
          bValue = parseFloat(b.min_price.replace('R$', '').replace(',', '.'));
          break;
        case 'sales':
          aValue = a.sold_count;
          bValue = b.sold_count;
          break;
        case 'discount':
          aValue = parseFloat(a.discount.replace('%', ''));
          bValue = parseFloat(b.discount.replace('%', ''));
          break;
        case 'commission':
          aValue = parseFloat(a.commission_rate.replace('%', ''));
          bValue = parseFloat(b.commission_rate.replace('%', ''));
          break;
        default:
          return 0;
      }
      
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  /**
   * Verifica se o usuário tem créditos suficientes
   */
  private hasEnoughCredits(): boolean {
    try {
      const savedUser = localStorage.getItem('aci_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return (user.credits || 0) >= this.CREDIT_COST;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Deduz créditos do usuário
   */
  private deductCredits(): void {
    try {
      const savedUser = localStorage.getItem('aci_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.credits = Math.max(0, (user.credits || 0) - this.CREDIT_COST);
        localStorage.setItem('aci_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erro ao deduzir créditos:', error);
    }
  }

  /**
   * Gera mensagem formatada para Telegram com o padrão especificado
   */
  generateTelegramMessage(product: Product): string {
    const affiliateUrl = product.short_url || product.affiliate_url;
    
    return `🚨 OFERTA RELÂMPAGO! 🚨

🛍️ *${product.title}*

💰 *Preço:* ${product.min_price} - ${product.max_price}
🔥 *Desconto:* ${product.discount}
💵 *Ganho Afiliado:* ${product.affiliate_earning}
📊 *Vendidos:* ${product.sold_count.toLocaleString()}
⭐ *Comissão:* ${product.commission_rate}

🔗 👉 [Compre agora](${affiliateUrl})

✨ Não perca essa oportunidade única!

👆 Clique no botão acima e garanta já o seu!

⚠️ O preço pode mudar a qualquer momento.

#OfertaEspecial #Shopee #Promoção #${product.category.replace('-', '')}`;
  }

  /**
   * Gera mensagem em lote para múltiplos produtos
   */
  generateBatchTelegramMessage(products: Product[]): string {
    if (products.length === 0) return '';
    
    let message = `🛍️ *OFERTAS EM DESTAQUE* 🛍️\n\n`;
    
    products.forEach((product, index) => {
      const affiliateUrl = product.short_url || product.affiliate_url;
      
      message += `${index + 1}. *${product.title}*\n`;
      message += `💰 ${product.min_price} - ${product.max_price}\n`;
      message += `🔥 ${product.discount} | 💵 ${product.affiliate_earning}\n`;
      message += `🔗 [Comprar Agora](${affiliateUrl})\n\n`;
    });
    
    message += `✨ *Não perca essas oportunidades únicas!*\n`;
    message += `⚠️ *Os preços podem mudar a qualquer momento.*\n\n`;
    message += `#OfertasEspeciais #Shopee #Promoções`;
    
    return message;
  }

  /**
   * Obtém produtos base por categoria
   */
  private getCategoryProducts(category: string): Omit<Product, 'id' | 'category' | 'original_url' | 'affiliate_url'>[] {
    const baseProducts = {
      'roupas-femininas': [
        {
          title: 'Kit c/3 Sutiã Básico Reforçado de Microfibra Com Bojo do P ao GG PROMOÇÃO',
          image_url: 'https://images.unsplash.com/photo-1584370848010-d7f6c612c4b0?w=100&h=100&fit=crop&crop=center',
          sold_count: 14390,
          affiliate_earning: 'R$ 2,36',
          min_price: 'R$ 16,85',
          max_price: 'R$ 39,90',
          commission_rate: '14%',
          discount: '72%'
        },
        {
          title: 'Vestido Floral Feminino Casual com Estampa Tropical',
          image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop&crop=center',
          sold_count: 8920,
          affiliate_earning: 'R$ 3,45',
          min_price: 'R$ 24,90',
          max_price: 'R$ 59,90',
          commission_rate: '12%',
          discount: '58%'
        }
      ],
      'roupas-masculinas': [
        {
          title: 'Camisa Social Masculina Slim Fit com Tecido Premium',
          image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b4c?w=100&h=100&fit=crop&crop=center',
          sold_count: 5670,
          affiliate_earning: 'R$ 4,20',
          min_price: 'R$ 29,90',
          max_price: 'R$ 79,90',
          commission_rate: '15%',
          discount: '62%'
        }
      ],
      'eletronicos': [
        {
          title: 'Fone de Ouvido Bluetooth com Cancelamento de Ruído',
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center',
          sold_count: 12340,
          affiliate_earning: 'R$ 8,90',
          min_price: 'R$ 89,90',
          max_price: 'R$ 199,90',
          commission_rate: '8%',
          discount: '55%'
        }
      ],
      'casa-decoracao': [
        {
          title: 'Kit 4 Almofadas Decorativas para Sofá com Design Moderno',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center',
          sold_count: 3450,
          affiliate_earning: 'R$ 5,60',
          min_price: 'R$ 39,90',
          max_price: 'R$ 89,90',
          commission_rate: '16%',
          discount: '45%'
        }
      ],
      'beleza-saude': [
        {
          title: 'Kit Skincare Completo com Protetor Solar e Hidratante',
          image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop&crop=center',
          sold_count: 7890,
          affiliate_earning: 'R$ 6,80',
          min_price: 'R$ 49,90',
          max_price: 'R$ 129,90',
          commission_rate: '13%',
          discount: '61%'
        }
      ],
      'esportes': [
        {
          title: 'Tênis Esportivo para Corrida com Amortecimento Avançado',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&crop=center',
          sold_count: 4560,
          affiliate_earning: 'R$ 12,40',
          min_price: 'R$ 79,90',
          max_price: 'R$ 199,90',
          commission_rate: '10%',
          discount: '60%'
        }
      ]
    };

    return baseProducts[category as keyof typeof baseProducts] || [];
  }
}

export const productSearchService = new ProductSearchService();
