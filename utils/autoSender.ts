// Script para envio automático de ofertas
export interface AutoSendConfig {
    botToken: string;
    destinations: Array<{
        id: string;
        name: string;
        chatId: string;
        type: 'telegram' | 'whatsapp';
        enabled: boolean;
    }>;
    whatsappChannelUrl: string;
    interval: number; // em segundos
}

export interface ProductOffer {
    title: string;
    price: string;
    image_url: string;
    product_url: string;
    message: string;
}

export class AutoSender {
    private config: AutoSendConfig;
    private queue: ProductOffer[] = [];
    private currentIndex = 0;
    private isRunning = false;
    private intervalId: NodeJS.Timeout | null = null;

    constructor(config: AutoSendConfig) {
        this.config = config;
    }

    // Adicionar produtos à fila
    addToQueue(products: ProductOffer[]) {
        this.queue = [...this.queue, ...products];
        console.log(`${products.length} produtos adicionados à fila. Total: ${this.queue.length}`);
    }

    // Iniciar envio automático
    start() {
        if (this.isRunning) {
            console.log('Envio automático já está rodando');
            return;
        }

        if (this.queue.length === 0) {
            console.log('Nenhum produto na fila para enviar');
            return;
        }

        this.isRunning = true;
        console.log(`Iniciando envio automático com intervalo de ${this.config.interval}s`);
        
        this.sendNext();
    }

    // Parar envio automático
    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Envio automático parado');
    }

    // Enviar próximo produto da fila
    private async sendNext() {
        if (!this.isRunning || this.currentIndex >= this.queue.length) {
            this.stop();
            console.log('Todos os produtos foram enviados');
            return;
        }

        const product = this.queue[this.currentIndex];
        console.log(`Enviando produto ${this.currentIndex + 1}/${this.queue.length}: ${product.title}`);

        try {
            await this.sendProduct(product);
            console.log(`✅ Produto enviado com sucesso: ${product.title}`);
        } catch (error) {
            console.error(`❌ Erro ao enviar produto: ${error}`);
        }

        this.currentIndex++;

        // Agendar próximo envio
        if (this.currentIndex < this.queue.length) {
            this.intervalId = setTimeout(() => {
                this.sendNext();
            }, this.config.interval * 1000);
        } else {
            this.stop();
        }
    }

    // Enviar produto para todos os destinos habilitados
    private async sendProduct(product: ProductOffer) {
        const enabledDestinations = this.config.destinations.filter(dest => dest.enabled);
        const results = [];

        for (const destination of enabledDestinations) {
            try {
                if (destination.type === 'telegram') {
                    await this.sendToTelegram(destination, product);
                    results.push(`✅ Telegram ${destination.name}: Enviado`);
                } else if (destination.type === 'whatsapp') {
                    await this.sendToWhatsApp(destination, product);
                    results.push(`✅ WhatsApp ${destination.name}: Enviado`);
                }
            } catch (error) {
                results.push(`❌ ${destination.name}: ${error}`);
            }
        }

        return results;
    }

    // Enviar para Telegram
    private async sendToTelegram(destination: any, product: ProductOffer) {
        const telegramApiUrl = `https://api.telegram.org/bot${this.config.botToken}/sendPhoto`;
        
        const payload = {
            chat_id: destination.chatId,
            photo: product.image_url,
            caption: product.message,
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: "🛒 Comprar Agora",
                        url: product.product_url
                    }
                ]]
            }
        };

        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!result.ok) {
            throw new Error(result.description);
        }
    }

    // Enviar para WhatsApp Channel (simulado)
    private async sendToWhatsApp(destination: any, product: ProductOffer) {
        // Para WhatsApp Channel, vamos simular o envio
        // Em produção, você usaria a API oficial do WhatsApp Business
        console.log(`Enviando para WhatsApp Channel: ${this.config.whatsappChannelUrl}`);
        console.log(`Mensagem: ${product.message}`);
        console.log(`Link: ${product.product_url}`);
        
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Obter status da fila
    getStatus() {
        return {
            total: this.queue.length,
            current: this.currentIndex,
            remaining: this.queue.length - this.currentIndex,
            isRunning: this.isRunning,
            nextProduct: this.queue[this.currentIndex]?.title || null
        };
    }

    // Limpar fila
    clearQueue() {
        this.stop();
        this.queue = [];
        this.currentIndex = 0;
        console.log('Fila limpa');
    }
}