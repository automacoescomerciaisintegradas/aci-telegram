import React, { useState, useEffect } from 'react';
import { getPromotionValues, formatCurrency } from '../utils/promotionValues';

interface CheckoutPixProps {
  amount: number;
  onBack: () => void;
  onPaymentConfirm: () => void;
}

export const CheckoutPix: React.FC<CheckoutPixProps> = ({ amount, onBack, onPaymentConfirm }) => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [pixGenerated, setPixGenerated] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos

  // PIX Code simulado
  const pixCode = "00020126580014BR.GOV.BCB.PIX013636c4b8e8-7c4a-4c4a-9c4a-4c4a4c4a4c4a5204000053039865802BR5925ACI AUTOMACOES COMERCIAIS6009SAO PAULO62070503***63048VYO";

  const bonusData = getPromotionValues(amount);
  const bonus = bonusData.bonus;
  const total = bonusData.total;

  // Countdown timer
  useEffect(() => {
    if (pixGenerated && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pixGenerated, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (value: string) => {
    setCpf(formatCPF(value));
  };

  const handleGeneratePix = () => {
    if (!cpf || !name) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    setPixGenerated(true);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado para a área de transferência!');
  };

  if (pixGenerated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-green-500">PIX Gerado</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            {/* Timer */}
            <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-400 font-semibold">
                ⏰ Tempo restante para pagamento: {formatTime(countdown)}
              </p>
            </div>

            {/* QR Code Area */}
            <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
              <div className="w-64 h-64 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-gray-800 text-sm">
                  [QR CODE PIX]<br/>
                  R$ {total.toFixed(2)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Escaneie o QR Code</h3>
              <p className="text-gray-300 mb-6">
                Use o app do seu banco para escanear o código e realizar o pagamento
              </p>

              {/* PIX Code */}
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Ou copie o código PIX:</p>
                <div className="bg-gray-600 rounded p-3 text-xs font-mono break-all">
                  {pixCode}
                </div>
              </div>

              <button
                onClick={copyPixCode}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
              >
                📋 Copiar Código PIX
              </button>
            </div>

            {/* Resumo */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Resumo do Pagamento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valor selecionado:</span>
                  <span>R$ {amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Bônus (20%):</span>
                  <span>+ R$ {bonus.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total a receber:</span>
                    <span className="text-green-400">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">📱 Como pagar:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha a opção PIX</li>
                <li>Escaneie o QR Code ou cole o código</li>
                <li>Confirme o pagamento</li>
                <li>Aguarde a confirmação automática</li>
              </ol>
            </div>

            {/* Mensagem WhatsApp */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-semibold mb-4">📧 Mensagem enviada por email:</h4>
              <div className="bg-gray-700 rounded-lg p-4 text-sm">
                <p className="mb-2">
                  <strong>Olá {name.split(' ')[0]}!</strong> Vi que você iniciou o processo para garantir seu acesso a este produto 
                  <strong> ACI - Automações Comerciais Integradas</strong>, parabéns pela decisão!!! 👏
                </p>
                <p className="mb-2">--- AGUARDE 3 SEGUNDOS ---</p>
                <p className="mb-2">
                  O código Pix foi enviado no seu e-mail. Se precisar gerar um novo código, 
                  enquanto essa oferta ainda estiver válida, é só acessar novamente.
                </p>
                <p className="mb-2">--- AGUARDE 3 SEGUNDOS ---</p>
                <p className="mb-2">
                  Precisando de algo, é só responder essa mensagem que eu te ajudo! ;)
                </p>
                <p>
                  Um abraço!<br/>
                  <strong>Time da Automações Comerciais Integradas.</strong>
                </p>
              </div>
            </div>

            {/* Botão de teste */}
            <div className="text-center mt-6">
              <button
                onClick={onPaymentConfirm}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
              >
                🧪 Simular Pagamento Confirmado
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-blue-500">Checkout - PIX</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Detalhes de Faturamento</h2>
              
              {/* Tipo de Documento */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setDocumentType('CPF')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      documentType === 'CPF'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    CPF
                  </button>
                  <button
                    onClick={() => setDocumentType('CNPJ')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      documentType === 'CNPJ'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    CNPJ
                  </button>
                </div>
              </div>

              {/* CPF/CNPJ */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {documentType}
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Informe seu ${documentType}`}
                  required
                />
              </div>

              {/* Nome */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Informe seu Nome"
                  required
                />
              </div>
            </div>

            {/* Resumo */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  Revise o valor selecionado para pagamento e confirme para gerar o PIX.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Este valor será adicionado ao seu crédito ao confirmar o pagamento
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Valor selecionado:</span>
                    <span>R$ {amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Bônus (20%):</span>
                    <span>+ R$ {bonus.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-green-400">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePix}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors mb-4"
                >
                  Gerar PIX
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Ao continuar, você aceita nossos{' '}
                  <a href="#" className="text-blue-400 hover:underline">Termos de Serviço</a>
                  {' '}e{' '}
                  <a href="#" className="text-blue-400 hover:underline">Política de Privacidade</a>.
                  Por favor, note que os pagamentos não são reembolsáveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};