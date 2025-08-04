import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { shopeeAffiliateService } from '../services/shopeeAffiliateService';
import { configService } from '../services/configService';
import { LinkIcon, SpinnerIcon, AlertTriangleIcon, CopyIcon, CheckIcon } from './Icons';

export const LinkGenerator: React.FC = () => {
  const [productUrl, setProductUrl] = useState('');
  const [affiliateId, setAffiliateId] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Carregar ID de afiliado das configurações
  useEffect(() => {
    try {
      const config = configService.get('shopee');
      if (config.affiliateId) {
        setAffiliateId(config.affiliateId);
      }
    } catch {
      console.log('Configurações do Shopee não encontradas, usando valores padrão');
    }
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      setError('Por favor, insira o link do produto Shopee.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedLink('');
    setIsCopied(false);

    try {
      const result = shopeeAffiliateService.generateAffiliateLink(productUrl, affiliateId);
      setGeneratedLink(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao gerar o link. Por favor, verifique os dados e tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productUrl, affiliateId]);

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
          Gerador de Link de Afiliado - Shopee
        </h1>
        <p className="text-md text-dark-text-secondary">
          Cole o link do produto e seu ID de afiliado para criar um link rastreável.
        </p>
      </div>

      <div className="bg-dark-card rounded-xl shadow-2xl shadow-black/20 border border-dark-border p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="productUrl" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Cole aqui o link do produto
              </label>
              <textarea
                id="productUrl"
                name="productUrl"
                rows={3}
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                placeholder="https://shopee.com.br/..."
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="affiliateId" className="block text-sm font-medium text-dark-text-secondary mb-2">
                Seu ID de Afiliado <span className="text-xs">(Opcional)</span>
              </label>
              <input
                type="text"
                id="affiliateId"
                name="affiliateId"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                placeholder="Ex: 123456789"
                disabled={isLoading}
              />
              <p className="text-xs text-dark-text-secondary mt-2">
                Se não informado, será usado o ID configurado no Painel Administrativo
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading || !productUrl}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Gerando...
                </>
              ) : (
                <>
                  <LinkIcon className="h-5 w-5" />
                  Gerar Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangleIcon />
          <p>{error}</p>
        </div>
      )}
      
      {isLoading && (
          <div className="mt-8 bg-dark-card border border-dark-border rounded-xl p-6">
             <div className="space-y-4 animate-pulse-fast">
                <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                <div className="h-10 bg-slate-800 rounded w-full"></div>
            </div>
          </div>
      )}

      {!isLoading && generatedLink && (
        <div className="mt-8 bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-dark-text-primary mb-3">
            ✅ Seu link de afiliado está pronto:
          </h2>
          <div className="bg-slate-800 p-4 rounded-lg border border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-dark-text-secondary">Link gerado:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-500 text-white font-medium py-1 px-3 rounded-md transition-colors"
              >
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                {isCopied ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>
            <p className="text-brand-primary break-all text-sm bg-slate-900 p-3 rounded border">
              {generatedLink}
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>Dica:</strong> Agora você pode compartilhar este link e receber comissões pelas vendas realizadas através dele!
            </p>
          </div>
        </div>
      )}
    </>
  );
};