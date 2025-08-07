import React from 'react';
import { Footer } from './Footer';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-2xl font-bold text-white">ACI</h1>
            </button>
            
            <button 
              onClick={() => onNavigate('home')}
              className="text-white hover:text-blue-300 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Termos de Uso
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6 text-gray-200">
              <p className="text-lg">
                <strong>Última atualização:</strong> 15 de janeiro de 2025
              </p>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar a plataforma ACI - Automações Comerciais Integradas, operada pela 
                  F.C.A. DE QUEIROZ (CNPJ: 59.216.642/0001-75), você concorda em cumprir e ficar vinculado 
                  a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve 
                  utilizar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Descrição dos Serviços</h2>
                <p>
                  A ACI oferece uma plataforma de automação comercial que inclui:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Integração com a Shopee para gerenciamento de produtos e vendas</li>
                  <li>Automação de campanhas de marketing via Telegram</li>
                  <li>Ferramentas de análise e relatórios de desempenho</li>
                  <li>Geração de conteúdo assistida por inteligência artificial</li>
                  <li>Suporte técnico e consultoria especializada</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Conta do Usuário</h2>
                <p>
                  Para utilizar nossos serviços, você deve:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer informações verdadeiras, precisas e completas durante o cadastro</li>
                  <li>Manter suas informações de conta atualizadas</li>
                  <li>Ser responsável pela segurança de sua senha e conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                  <li>Ter pelo menos 18 anos de idade ou consentimento dos pais/responsáveis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Planos e Pagamentos</h2>
                <p>
                  Nossa plataforma opera com sistema de créditos pré-pagos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Os pagamentos devem ser realizados antecipadamente via PIX</li>
                  <li>Os créditos são consumidos conforme o uso dos serviços</li>
                  <li>Não oferecemos reembolso de créditos não utilizados</li>
                  <li>Reservamo-nos o direito de alterar preços com aviso prévio de 30 dias</li>
                  <li>Promoções e descontos têm validade limitada e condições específicas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Uso Aceitável</h2>
                <p>
                  Você concorda em NÃO utilizar nossos serviços para:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Atividades ilegais, fraudulentas ou que violem direitos de terceiros</li>
                  <li>Envio de spam, conteúdo malicioso ou comunicações não solicitadas</li>
                  <li>Tentativas de acesso não autorizado a sistemas ou dados</li>
                  <li>Distribuição de vírus, malware ou código prejudicial</li>
                  <li>Violação de direitos autorais, marcas registradas ou propriedade intelectual</li>
                  <li>Criação de múltiplas contas para contornar limitações</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Propriedade Intelectual</h2>
                <p>
                  Todos os direitos de propriedade intelectual relacionados à plataforma ACI, incluindo 
                  mas não limitado a software, design, textos, imagens e marcas, são de propriedade 
                  exclusiva da F.C.A. DE QUEIROZ ou de seus licenciadores.
                </p>
                <p>
                  Você mantém a propriedade do conteúdo que criar usando nossa plataforma, mas nos 
                  concede uma licença limitada para processar e exibir esse conteúdo conforme necessário 
                  para fornecer nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Disponibilidade e Suporte</h2>
                <p>
                  Nos esforçamos para manter nossa plataforma disponível 24/7, mas não garantimos 
                  disponibilidade ininterrupta. Podemos realizar manutenções programadas com aviso prévio.
                </p>
                <p>
                  Oferecemos suporte técnico através dos seguintes canais:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>WhatsApp: (88) 9 2156-7214 (24/7)</li>
                  <li>E-mail: suporte@aci.com.br</li>
                  <li>Chat interno da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Limitação de Responsabilidade</h2>
                <p>
                  A ACI não se responsabiliza por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Perdas ou danos indiretos, incidentais ou consequenciais</li>
                  <li>Interrupções temporárias dos serviços por manutenção ou falhas técnicas</li>
                  <li>Ações ou políticas de terceiros (Shopee, Telegram, etc.)</li>
                  <li>Uso inadequado da plataforma ou violação destes termos</li>
                  <li>Perda de dados devido a falhas do usuário ou fatores externos</li>
                </ul>
                <p>
                  Nossa responsabilidade total está limitada ao valor pago pelos serviços nos últimos 12 meses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Suspensão e Encerramento</h2>
                <p>
                  Podemos suspender ou encerrar sua conta nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violação destes Termos de Uso</li>
                  <li>Atividades fraudulentas ou ilegais</li>
                  <li>Não pagamento de valores devidos</li>
                  <li>Inatividade prolongada da conta (mais de 12 meses)</li>
                  <li>Solicitação do próprio usuário</li>
                </ul>
                <p>
                  Você pode encerrar sua conta a qualquer momento através das configurações da plataforma 
                  ou entrando em contato conosco.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Modificações dos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                  Alterações significativas serão comunicadas com pelo menos 30 dias de antecedência 
                  através de:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>E-mail para o endereço cadastrado</li>
                  <li>Notificação na plataforma</li>
                  <li>Aviso em nosso site oficial</li>
                </ul>
                <p>
                  O uso continuado dos serviços após as modificações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Lei Aplicável e Jurisdição</h2>
                <p>
                  Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
                  preferencialmente por mediação ou arbitragem. Caso necessário, o foro competente será 
                  o da comarca de Morada Nova, CE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Disposições Gerais</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Se qualquer disposição destes termos for considerada inválida, as demais permanecerão em vigor</li>
                  <li>A tolerância com o descumprimento de qualquer cláusula não constitui renúncia de direitos</li>
                  <li>Estes termos constituem o acordo completo entre as partes</li>
                  <li>Não há relação de parceria, joint venture ou representação entre as partes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contato</h2>
                <p>
                  Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 mt-4">
                  <p><strong>Empresa:</strong> F.C.A. DE QUEIROZ</p>
                  <p><strong>CNPJ:</strong> 59.216.642/0001-75</p>
                  <p><strong>E-mail:</strong> juridico@aci.com.br</p>
                  <p><strong>Telefone:</strong> (88) 9 2156-7214</p>
                  <p><strong>Endereço:</strong> LUIZ SATURNINO DE MATOS, 39, Morada Nova, CE, CEP 62940-037</p>
                </div>
              </section>

              <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-green-300 mb-3">✅ Confirmação de Leitura</h3>
                <p className="text-green-100">
                  Ao utilizar nossa plataforma, você confirma que leu, compreendeu e concorda 
                  com todos os termos e condições estabelecidos neste documento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};