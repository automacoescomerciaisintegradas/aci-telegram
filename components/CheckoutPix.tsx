import React, { useState } from 'react';

interface CheckoutPixProps {
  amount: number;
  onBack: () => void;
  onPaymentConfirm: () => void;
}

export const CheckoutPix: React.FC<CheckoutPixProps> = ({ amount, onBack, onPaymentConfirm }) => {
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixCode, setPixCode] = useState('');

  const formatDocument = (value: string, type: 'cpf' | 'cnpj') => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value, documentType);
    setDocument(formatted);
  };

  const generatePix = () => {
    if (!document || !name) return;
    
    // Simular geração do código PIX
    const mockPixCode = `00020126580014BR.GOV.BCB.PIX013636c4b8e8-7c4a-4c4a-9c4a-4c4a4c4a4c4a5204000053039865802BR5925ACI AUTOMACOES COMERCIAIS6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setPixCode(mockPixCode);
    setPixGenerated(true);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    // Aqui você poderia adicionar uma notificação de sucesso
  };

  const bonus = amount * 0.2;
  const total = amount;

  if (pixGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setPixGenerated(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white">Pagamento PIX</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code e instruções */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Escaneie o QR Code</h2>
              
              {/* QR Code simulado */}
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="w-64 h-64 mx-auto bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-32 h-32 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
                    </svg>
                    <p className="text-xs">QR Code PIX</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-white">Código PIX Copia e Cola:</h3>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-300 break-all font-mono">{pixCode}</p>
                </div>
                
                <button
                  onClick={copyPixCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar Código PIX
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Importante:</strong> O pagamento será processado automaticamente após a confirmação. 
                  Mantenha esta tela aberta até a confirmação do pagamento.
                </p>
              </div>
            </div>

            {/* Mensagem personalizada após PIX gerado */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">PIX Gerado</h2>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 text-gray-200">
                <p>
                  Olá <strong>{name.split(' ')[0] || 'Cliente'}</strong>! Vi que você iniciou o processo para garantir seu acesso a este produto 
                  <strong> *ACI - Automações Comerciais Integradas*</strong>, parabéns pela decisão!!! 👏
                </p>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20">
                  <p className="text-blue-200 text-sm font-medium">--- AGUARDE 3 SEGUNDOS ---</p>
                </div>
                
                <p>
                  O código Pix foi enviado no seu e-mail 👉 <strong className="text-blue-400">francisco@exemplo.com</strong>. 
                  Se precisar gerar um novo código, enquanto essa oferta ainda estiver válida, é só tocar no link abaixo:
                </p>
                
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-blue-300">
                    👉 <strong>Link do Checkout: {window.location.href}</strong>
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20">
                  <p className="text-blue-200 text-sm font-medium">--- AGUARDE 3 SEGUNDOS ---</p>
                </div>
                
                <p>
                  Precisando de algo, é só responder essa mensagem que eu te ajudo! 😉
                </p>
                
                <div className="pt-3 border-t border-gray-600">
                  <p className="text-sm">
                    Um abraço!<br />
                    <strong className="text-blue-400">Time da Automações Comerciais Integradas.</strong>
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    const message = `Olá ${name.split(' ')[0] || 'Cliente'}! Vi que você iniciou o processo para garantir seu acesso a este produto *ACI - Automações Comerciais Integradas*, parabéns pela decisão!!! 👏\n\n--- AGUARDE 3 SEGUNDOS ---\n\nO código Pix foi enviado no seu e-mail 👉 francisco@exemplo.com. Se precisar gerar um novo código, enquanto essa oferta ainda estiver válida, é só tocar no link abaixo:\n\n👉 *${window.location.href}*\n\n--- AGUARDE 3 SEGUNDOS ---\n\nPrecisando de algo, é só responder essa mensagem que eu te ajudo! 😉\n\nUm abraço!\nTime da Automações Comerciais Integradas.`;
                    navigator.clipboard.writeText(message);
                    alert('Mensagem copiada para a área de transferência!');
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar Mensagem
                </button>
                
                <button
                  onClick={() => {
                    const whatsappMessage = encodeURIComponent(`Olá ${name.split(' ')[0] || 'Cliente'}! Vi que você iniciou o processo para garantir seu acesso a este produto *ACI - Automações Comerciais Integradas*, parabéns pela decisão!!! 👏\n\n--- AGUARDE 3 SEGUNDOS ---\n\nO código Pix foi enviado no seu e-mail 👉 francisco@exemplo.com. Se precisar gerar um novo código, enquanto essa oferta ainda estiver válida, é só tocar no link abaixo:\n\n👉 *${window.location.href}*\n\n--- AGUARDE 3 SEGUNDOS ---\n\nPrecisando de algo, é só responder essa mensagem que eu te ajudo! 😉\n\nUm abraço!\nTime da Automações Comerciais Integradas.`);
                    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Enviar WhatsApp
                </button>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valor da recarga:</span>
                  <span className="text-white font-medium">R$ {amount.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Bônus (20%):</span>
                  <span className="text-green-400 font-medium">+ R$ {bonus.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total a pagar:</span>
                    <span className="text-2xl font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300">Total em créditos:</span>
                    <span className="text-xl font-bold text-green-400">R$ {(amount + bonus).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Dados do pagador:</h3>
                <p className="text-gray-300 text-sm">{name}</p>
                <p className="text-gray-300 text-sm">{document}</p>
              </div>

              <button
                onClick={onPaymentConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6"
              >
                Simular Pagamento Confirmado
              </button>

              <p className="text-xs text-gray-400 mt-4 text-center">
                Ao continuar, você aceita nossos Termos de Serviço e Política de Privacidade. 
                Por favor, note que os pagamentos não são reembolsáveis.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">Finalizar Compra</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulário de pagamento */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <p className="text-gray-300 mb-6">
                Adicione crédito à sua conta para acessar os serviços do ACI-automações comerciais integradas. 
                Escolha entre os modelos GPT-3.5 e GPT-4.0, cada um com seu valor específico por uso. 
                Selecione um valor e conclua o pagamento para começar a utilizar os serviços do ACI-automações comerciais integradas.
              </p>

              {/* Método de pagamento */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Método de Pagamento</h3>
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-white font-medium">PIX</span>
                </div>
              </div>

              {/* Detalhes de faturamento */}
              <div>
                <h3 className="text-white font-semibold mb-4">Detalhes de Faturamento</h3>
                
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setDocumentType('cpf')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      documentType === 'cpf' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 text-gray-300 border border-white/20'
                    }`}
                  >
                    CPF
                  </button>
                  <button
                    onClick={() => setDocumentType('cnpj')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      documentType === 'cnpj' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 text-gray-300 border border-white/20'
                    }`}
                  >
                    CNPJ
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {documentType === 'cpf' ? 'CPF' : 'CNPJ'}
                    </label>
                    <input
                      type="text"
                      value={document}
                      onChange={handleDocumentChange}
                      placeholder={documentType === 'cpf' ? 'Informe seu CPF' : 'Informe seu CNPJ'}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Informe seu Nome"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Resumo do Pedido</h2>
            
            <p className="text-gray-300 text-sm mb-4">
              Revise o valor selecionado para pagamento e confirme para gerar o PIX.
            </p>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm mb-2">
                Este valor será adicionado ao seu crédito ao confirmar o pagamento
              </p>
              <p className="text-3xl font-bold text-white">R$ {amount.toFixed(2).replace('.', ',')}</p>
              {bonus > 0 && (
                <p className="text-green-400 font-medium mt-1">
                  + Bônus: R$ {bonus.toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>

            <div className="border-t border-gray-600 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-300">Total</span>
                <span className="font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              onClick={generatePix}
              disabled={!document || !name}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Prosseguir com o Pagamento
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Ao continuar, você aceita nossos Termos de Serviço e Política de Privacidade da ACI-automações comerciais integradas. 
              Por favor, note que os pagamentos não são reembolsáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};