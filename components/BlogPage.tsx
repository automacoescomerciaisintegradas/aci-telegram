import React, { useState } from 'react';
import { Footer } from './Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
}

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Como Automatizar suas Vendas na Shopee em 2025',
      excerpt: 'Descubra as melhores estratégias para automatizar suas vendas e aumentar seus lucros na Shopee usando nossa plataforma.',
      content: 'Conteúdo completo do artigo sobre automação de vendas...',
      author: 'Equipe ACI',
      date: '2025-01-15',
      category: 'Automação',
      readTime: '5 min',
      image: '🤖',
      featured: true
    },
    {
      id: 2,
      title: 'Telegram Marketing: Guia Completo para E-commerce',
      excerpt: 'Aprenda a usar o Telegram como ferramenta de marketing para impulsionar suas vendas online.',
      content: 'Conteúdo completo sobre Telegram marketing...',
      author: 'João Silva',
      date: '2025-01-12',
      category: 'Marketing',
      readTime: '8 min',
      image: '📱',
      featured: true
    },
    {
      id: 3,
      title: 'IA no E-commerce: Tendências para 2025',
      excerpt: 'Explore como a inteligência artificial está revolucionando o comércio eletrônico.',
      content: 'Conteúdo sobre IA no e-commerce...',
      author: 'Maria Santos',
      date: '2025-01-10',
      category: 'Tecnologia',
      readTime: '6 min',
      image: '🧠',
      featured: false
    },
    {
      id: 4,
      title: 'Otimização de Produtos: Dicas para Aumentar Vendas',
      excerpt: 'Técnicas comprovadas para otimizar seus produtos e melhorar seu ranking na Shopee.',
      content: 'Dicas de otimização de produtos...',
      author: 'Pedro Costa',
      date: '2025-01-08',
      category: 'SEO',
      readTime: '7 min',
      image: '📈',
      featured: false
    },
    {
      id: 5,
      title: 'Análise de Concorrência: Ferramentas Essenciais',
      excerpt: 'Conheça as melhores ferramentas para analisar seus concorrentes e se destacar no mercado.',
      content: 'Ferramentas de análise de concorrência...',
      author: 'Ana Oliveira',
      date: '2025-01-05',
      category: 'Estratégia',
      readTime: '4 min',
      image: '🔍',
      featured: false
    },
    {
      id: 6,
      title: 'Gestão de Estoque Automatizada',
      excerpt: 'Como automatizar a gestão do seu estoque e evitar problemas de ruptura ou excesso.',
      content: 'Gestão automatizada de estoque...',
      author: 'Carlos Lima',
      date: '2025-01-03',
      category: 'Automação',
      readTime: '5 min',
      image: '📦',
      featured: false
    }
  ];

  const categories = ['all', 'Automação', 'Marketing', 'Tecnologia', 'SEO', 'Estratégia'];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-3 text-white hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar ao Blog
              </button>
              
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold text-white">ACI</h1>
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{selectedPost.image}</div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {selectedPost.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6 text-center">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-gray-300 mb-8">
                <span>Por {selectedPost.author}</span>
                <span>•</span>
                <span>{new Date(selectedPost.date).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{selectedPost.readTime} de leitura</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                
                <div className="text-gray-200 leading-relaxed space-y-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                    Principais Benefícios
                  </h2>
                  
                  <ul className="list-disc list-inside space-y-2">
                    <li>Automatização completa de processos</li>
                    <li>Integração com múltiplas plataformas</li>
                    <li>Análise de dados em tempo real</li>
                    <li>Suporte 24/7 especializado</li>
                  </ul>
                  
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                    Como Implementar
                  </h2>
                  
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  
                  <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-6 my-8">
                    <h3 className="text-xl font-bold text-blue-300 mb-3">💡 Dica Importante</h3>
                    <p className="text-blue-100">
                      Sempre teste suas automações em um ambiente controlado antes de 
                      implementá-las em produção para evitar problemas inesperados.
                    </p>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                    Conclusão
                  </h2>
                  
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold text-white">ACI</h1>
              </button>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Início
              </button>
              <button 
                onClick={() => onNavigate('categories')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Categorias
              </button>
              <button 
                onClick={() => onNavigate('blog')}
                className="text-blue-300 font-semibold"
              >
                Blog
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Sobre
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Contato
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blog
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              ACI
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fique por dentro das últimas tendências em automação comercial, 
            dicas de marketing e estratégias para aumentar suas vendas.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            ⭐ Posts em Destaque
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="text-5xl mb-4">{post.image}</div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-3">
                  {post.title}
                </h3>
                <p className="text-blue-100 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-blue-200 text-sm">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {post.image}
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            📧 Newsletter ACI
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Receba as últimas novidades, dicas e estratégias diretamente no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};