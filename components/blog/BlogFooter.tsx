import React from 'react';

// Ícones SVG simples
const Icons = {
  Truck: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-3V6a3 3 0 00-6 0v1H8a1 1 0 000 2h1v11a3 3 0 003 3h4a3 3 0 003-3V9h1a1 1 0 100-2zM13 6a1 1 0 00-2 0v1h2V6zm1 15a1 1 0 01-1 1h-4a1 1 0 01-1-1V9h6v12z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Facebook: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Instagram: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z"/>
    </svg>
  ),
  Twitter: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  Youtube: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  RotateCcw: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
};

export const BlogFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-500 p-3 rounded-full">
                <Icons.Truck />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold">Frete Grátis</h4>
                <p className="text-sm text-gray-300">Em pedidos acima de R$ 150</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <Icons.Shield />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold">Compra Segura</h4>
                <p className="text-sm text-gray-300">Seus dados protegidos</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-purple-500 p-3 rounded-full">
                <Icons.RotateCcw />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold">Troca Garantida</h4>
                <p className="text-sm text-gray-300">Até 30 dias</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <Icons.CreditCard />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold">Parcelamento</h4>
                <p className="text-sm text-gray-300">Em até 12x sem juros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg">A</span>
                  <span className="ml-2">ACI</span>
                </div>
              </div>
              <p className="text-gray-300">
                Automações Comerciais Integradas. Produtos de qualidade com tecnologia avançada.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors">
                  <Icons.Facebook />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors">
                  <Icons.Twitter />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors">
                  <Icons.Instagram />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors">
                  <Icons.Youtube />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Links Importantes</h3>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-gray-300 hover:text-red-400 transition-colors">Início</a></li>
                <li><a href="#produto" className="text-gray-300 hover:text-red-400 transition-colors">Produto</a></li>
                <li><a href="#ofertas" className="text-gray-300 hover:text-red-400 transition-colors">Ofertas</a></li>
                <li><a href="#garantias" className="text-gray-300 hover:text-red-400 transition-colors">Garantias</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Categorias</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Eletrônicos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Casa e Jardim</a></li>
                <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Esportes e Lazer</a></li>
                <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Saúde e Beleza</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icons.Phone />
                  <span className="text-gray-300">(88) 9 2156-7214</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icons.Mail />
                  <span className="text-gray-300">contato@aci.com.br</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Icons.MapPin />
                  <span className="text-gray-300">
                    F.C.A. DE QUEIROZ<br />
                    CNPJ: 59.216.642/0001-75
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2024 ACI - Automações Comerciais Integradas. Todos os direitos reservados.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Pagamento:</span>
              <div className="flex space-x-1">
                <div className="bg-gray-800 p-1 rounded text-xs font-bold">VISA</div>
                <div className="bg-gray-800 p-1 rounded text-xs font-bold">MASTER</div>
                <div className="bg-gray-800 p-1 rounded text-xs font-bold">PIX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};