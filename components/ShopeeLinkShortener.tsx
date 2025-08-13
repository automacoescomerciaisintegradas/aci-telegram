import React, { useState } from 'react';
import { Button, InputField as Input } from './FormComponents';
import { shopeeAffiliateService } from '../services/shopeeAffiliateService'; // Importar o serviço

const ShopeeLinkShortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShortenLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await shopeeAffiliateService.shortenLink(longUrl);
      if (result && result.link) {
        setShortUrl(result.link);
      } else {
        setError('Erro ao encurtar o link. Resposta inválida.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao encurtar o link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Encurtador de Link Shopee</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Cole o link longo da Shopee aqui"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button
        onClick={handleShortenLink}
        disabled={loading || !longUrl}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Encurtando...' : 'Encurtar Link'}
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {shortUrl && (
        <div className="mt-4 p-3 bg-gray-100 border rounded flex items-center justify-between">
          <p className="break-all mr-2">{shortUrl}</p>
          <Button
            onClick={handleCopyLink}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Copiar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShopeeLinkShortener;
