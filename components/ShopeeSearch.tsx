import React, { useState, useCallback, FormEvent } from 'react';
import { searchShopeeProductsFromApi, Product } from '../services/geminiService';
import { SearchIcon, SpinnerIcon, AlertTriangleIcon } from './Icons';
import { GenerateLinkModal } from './GenerateLinkModal';

// Main search component
export const ShopeeSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError('Por favor, digite uma palavra-chave para pesquisar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setProducts([]);
    try {
      const results = await searchShopeeProductsFromApi(keyword);
      setProducts(results);
      if(results.length === 0){
        setError("Nenhum produto encontrado. Tente outra palavra-chave.");
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao buscar os produtos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4 animate-pulse-fast">
          <div className="bg-slate-700 h-40 w-full rounded-lg mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-slate-700 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2">Pesquisa de Produto - Shopee</h1>
        <p className="text-md text-dark-text-secondary">Encontre produtos na Shopee para promover como afiliado.</p>
      </div>

      <div className="bg-dark-card rounded-xl shadow-2xl shadow-black/20 border border-dark-border p-6 md:p-8 mb-10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-grow bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            placeholder="Ex: 'fone de ouvido bluetooth'"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !keyword}
            className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 shadow-lg shadow-indigo-500/30"
          >
            {isLoading ? <SpinnerIcon /> : <SearchIcon className="h-5 w-5" />}
            <span>Pesquisar</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3 mb-8">
          <AlertTriangleIcon />
          <p>{error}</p>
        </div>
      )}

      {isLoading && renderSkeletons()}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col group transition-all hover:shadow-2xl hover:border-brand-primary/50">
              <img src={product.image_url} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4 bg-slate-800" />
              <h3 className="text-sm font-semibold text-dark-text-primary flex-grow mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-lg font-bold text-purple-400 mb-4">{product.price}</p>
              <button 
                onClick={() => openModal(product)}
                className="w-full bg-slate-700 text-dark-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-brand-primary hover:text-white transition-colors duration-200 mt-auto"
              >
                Gerar Link
              </button>
            </div>
          ))}
        </div>
      )}
      
      <GenerateLinkModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </>
  );
};