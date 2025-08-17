import React, { useState, useEffect } from 'react';
import { getPromotionValues, formatCurrency } from '../utils/promotionValues';
import { documentValidationService } from '../services/documentValidationService';

interface CheckoutPixProps {
  amount: number;
  onBack: () => void;
  onPaymentConfirm: () => void;
}

export const CheckoutPix: React.FC<CheckoutPixProps> = ({ amount, onBack, onPaymentConfirm }) => {
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [pixGenerated, setPixGenerated] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [cnpjData, setCnpjData] = useState<any>(null);

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

  const formatDocument = (value: string, type: 'CPF' | 'CNPJ') => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (type === 'CPF') {
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value, documentType);
    setDocument(formatted);
    setValidationError('');
    setCnpjData(null);
  };

  const handleDocumentTypeChange = (type: 'CPF' | 'CNPJ') => {
    setDocumentType(type);
    setDocument('');
    setValidationError('');
    setCnpjData(null);
  };

  const handleGeneratePix = async () => {
    if (!document || !name) {
      setValidationError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const validation = await documentValidationService.validateForm(documentType, document, name);
      
      if (!validation.isValid) {
        setValidationError(validation.message);
        return;
      }

      // Se for CNPJ e tiver dados da empresa, salvar
      if (documentType === 'CNPJ' && validation.data) {
        setCnpjData(validation.data);
      }

      setPixGenerated(true);
    } catch (error) {
      setValidationError('Erro ao validar dados. Tente novamente.');
    } finally {
      setIsValidating(false);
    }
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Documento
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDocumentTypeChange('CPF')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      documentType === 'CPF'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    CPF
                  </button>
                  <button
                    onClick={() => handleDocumentTypeChange('CNPJ')}
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
                  {documentType} {documentType === 'CNPJ' && <span className="text-yellow-400">(será validado na Receita Federal)</span>}
                </label>
                <input
                  type="text"
                  value={document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                    validationError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                  maxLength={documentType === 'CPF' ? 14 : 18}
                  required
                />
              </div>

              {/* Dados da empresa (se CNPJ válido) */}
              {cnpjData && (
                <div className="mb-6 bg-green-900/20 border border-green-600 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">✅ Empresa Encontrada</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Razão Social:</strong> {cnpjData.razao_social}</p>
                    {cnpjData.nome_fantasia && (
                      <p><strong>Nome Fantasia:</strong> {cnpjData.nome_fantasia}</p>
                    )}
                    <p><strong>Situação:</strong> {cnpjData.situacao}</p>
                    <p><strong>Porte:</strong> {cnpjData.porte}</p>
                  </div>
                </div>
              )}

              {/* Nome */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                    validationError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="Nome e sobrenome completos"
                  required
                />
              </div>

              {/* Erro de Validação */}
              {validationError && (
                <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 font-medium">{validationError}</p>
                  </div>
                </div>
              )}
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
                  disabled={isValidating || !document || !name}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {documentType === 'CNPJ' ? 'Validando na Receita Federal...' : 'Validando...'}
                    </>
                  ) : (
                    'Gerar PIX'
                  )}
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