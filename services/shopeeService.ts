// Serviço para busca de produtos da Shopee
export interface ShopeeProduct {
    title: string;
    price: string;
    image_url: string;
    product_url: string;
    rating: number;
    sold: number;
    category: string;
}

export interface ShopeeConfig {
    affiliateId: string;
    apiKey?: string;
    region: string;
}

export class ShopeeService {
    private config: ShopeeConfig;

    constructor(config: ShopeeConfig) {
        this.config = config;
    }

    // Buscar produtos por categoria
    async searchByCategory(category: string, limit: number = 20): Promise<ShopeeProduct[]> {
        try {
            console.log(`Buscando produtos da categoria: ${category}`);
            
            // Simular busca de produtos (em produção, usar API real da Shopee)
            const mockProducts = this.generateMockProducts(category, limit);
            
            // Adicionar delay para simular chamada de API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return mockProducts;
        } catch (error) {
            throw new Error(`Erro na busca por categoria: ${error}`);
        }
    }

    // Buscar produtos por palavra-chave
    async searchByKeyword(keyword: string, limit: number = 20): Promise<ShopeeProduct[]> {
        try {
            console.log(`Buscando produtos com palavra-chave: ${keyword}`);
            
            const mockProducts = this.generateMockProductsByKeyword(keyword, limit);
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return mockProducts;
        } catch (error) {
            throw new Error(`Erro na busca por palavra-chave: ${error}`);
        }
    }

    // Obter produtos em promoção
    async getPromotionalProducts(limit: number = 20): Promise<ShopeeProduct[]> {
        try {
            console.log('Buscando produtos em promoção');
            
            const categories = ['eletrônicos', 'moda', 'casa', 'beleza', 'esportes'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            
            const products = this.generateMockProducts(randomCategory, limit);
            
            // Adicionar desconto aos produtos promocionais
            const promotionalProducts = products.map(product => ({
                ...product,
                price: this.applyDiscount(product.price, 10, 50) // 10-50% desconto
            }));
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return promotionalProducts;
        } catch (error) {
            throw new Error(`Erro ao buscar produtos promocionais: ${error}`);
        }
    }

    // Gerar produtos mock baseados na categoria
    private generateMockProducts(category: string, limit: number): ShopeeProduct[] {
        const products: ShopeeProduct[] = [];
        
        for (let i = 0; i < limit; i++) {
            const product = this.createMockProduct(category, i);
            products.push(product);
        }
        
        return products;
    }

    // Gerar produtos mock baseados em palavra-chave
    private generateMockProductsByKeyword(keyword: string, limit: number): ShopeeProduct[] {
        const products: ShopeeProduct[] = [];
        
        for (let i = 0; i < limit; i++) {
            const product = this.createMockProductWithKeyword(keyword, i);
            products.push(product);
        }
        
        return products;
    }

    // Criar produto mock baseado na categoria
    private createMockProduct(category: string, index: number): ShopeeProduct {
        const productData = this.getProductDataByCategory(category);
        const basePrice = Math.floor(Math.random() * 500) + 50;
        
        return {
            title: `${productData.name} ${index + 1} - ${productData.description}`,
            price: `R$ ${basePrice.toFixed(2).replace('.', ',')}`,
            image_url: productData.image,
            product_url: `https://shopee.com.br/product-${category}-${index + 1}`,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrelas
            sold: Math.floor(Math.random() * 1000) + 100,
            category: category
        };
    }

    // Criar produto mock com palavra-chave
    private createMockProductWithKeyword(keyword: string, index: number): ShopeeProduct {
        const basePrice = Math.floor(Math.random() * 300) + 30;
        
        return {
            title: `${keyword} Premium ${index + 1} - Qualidade Superior`,
            price: `R$ ${basePrice.toFixed(2).replace('.', ',')}`,
            image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
            product_url: `https://shopee.com.br/search-${keyword.replace(' ', '-')}-${index + 1}`,
            rating: Math.floor(Math.random() * 2) + 4,
            sold: Math.floor(Math.random() * 500) + 50,
            category: 'busca'
        };
    }

    // Obter dados do produto por categoria
    private getProductDataByCategory(category: string) {
        const categoryData: { [key: string]: any } = {
            'eletrônicos': {
                name: 'Smartphone',
                description: 'Tela HD, Câmera Dupla, 128GB',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
            },
            'moda': {
                name: 'Tênis Esportivo',
                description: 'Confortável, Respirável, Moderno',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
            },
            'casa': {
                name: 'Kit Ferramentas',
                description: '108 Peças, Profissional, Completo',
                image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop'
            },
            'beleza': {
                name: 'Kit Maquiagem',
                description: 'Completo, Profissional, Cores Variadas',
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'
            },
            'esportes': {
                name: 'Equipamento Fitness',
                description: 'Resistente, Portátil, Multifuncional',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
            }
        };

        return categoryData[category] || categoryData['eletrônicos'];
    }

    // Aplicar desconto ao preço
    private applyDiscount(price: string, minDiscount: number, maxDiscount: number): string {
        const numericPrice = parseFloat(price.replace('R$ ', '').replace(',', '.'));
        const discountPercent = Math.floor(Math.random() * (maxDiscount - minDiscount + 1)) + minDiscount;
        const discountedPrice = numericPrice * (1 - discountPercent / 100);
        
        return `R$ ${discountedPrice.toFixed(2).replace('.', ',')}`;
    }

    // Gerar link de afiliado
    generateAffiliateLink(productUrl: string): string {
        if (!this.config.affiliateId) {
            return productUrl;
        }

        try {
            const url = new URL(productUrl);
            url.searchParams.set('af_id', this.config.affiliateId);
            return url.toString();
        } catch {
            return `${productUrl}?af_id=${this.config.affiliateId}`;
        }
    }
}