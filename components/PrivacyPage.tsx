import React from 'react';
import { Footer } from './Footer';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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
              Política de Privacidade
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6 text-gray-200">
              <p className="text-lg">
                <strong>Última atualização:</strong> 15 de janeiro de 2025
              </p>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Informações Gerais</h2>
                <p>
                  A F.C.A. DE QUEIROZ, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 59.216.642/0001-75, 
                  localizada na LUIZ SATURNINO DE MATOS, 39, Morada Nova, CE, CEP 62940-037, doravante denominada 
                  "ACI" ou "nós", é a responsável pelo tratamento dos dados pessoais coletados através da plataforma 
                  ACI - Automações Comerciais Integradas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Dados Coletados</h2>
                <p>Coletamos os seguintes tipos de dados pessoais:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dados de identificação:</strong> nome completo, e-mail, telefone, CPF/CNPJ</li>
                  <li><strong>Dados de acesso:</strong> login, senha criptografada, histórico de acesso</li>
                  <li><strong>Dados de pagamento:</strong> informações de cobrança e histórico de transações</li>
                  <li><strong>Dados de uso:</strong> logs de atividade, preferências, configurações da conta</li>
                  <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Finalidade do Tratamento</h2>
                <p>Utilizamos seus dados pessoais para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer e manter nossos serviços de automação comercial</li>
                  <li>Processar pagamentos e gerenciar sua conta</li>
                  <li>Comunicar sobre atualizações, novidades e suporte técnico</li>
                  <li>Melhorar nossos serviços através de análises e estatísticas</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Base Legal</h2>
                <p>O tratamento dos seus dados pessoais é fundamentado nas seguintes bases legais:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Execução de contrato:</strong> para prestação dos serviços contratados</li>
                  <li><strong>Consentimento:</strong> para comunicações de marketing e cookies não essenciais</li>
                  <li><strong>Legítimo interesse:</strong> para melhorias dos serviços e segurança</li>
                  <li><strong>Cumprimento de obrigação legal:</strong> para atender exigências fiscais e regulamentares</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Compartilhamento de Dados</h2>
                <p>
                  Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Com prestadores de serviços essenciais (processamento de pagamentos, hospedagem)</li>
                  <li>Para cumprimento de obrigações legais ou ordem judicial</li>
                  <li>Em caso de fusão, aquisição ou venda de ativos (com prévia notificação)</li>
                  <li>Com seu consentimento expresso para finalidades específicas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Segurança dos Dados</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos e autenticação multifator</li>
                  <li>Monitoramento contínuo de segurança e detecção de ameaças</li>
                  <li>Backups regulares e planos de recuperação de desastres</li>
                  <li>Treinamento regular da equipe sobre proteção de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Retenção de Dados</h2>
                <p>
                  Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dados de conta:</strong> durante a vigência do contrato + 5 anos</li>
                  <li><strong>Dados fiscais:</strong> conforme exigido pela legislação (mínimo 5 anos)</li>
                  <li><strong>Logs de acesso:</strong> 6 meses para fins de segurança</li>
                  <li><strong>Dados de marketing:</strong> até a revogação do consentimento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Seus Direitos</h2>
                <p>Você possui os seguintes direitos em relação aos seus dados pessoais:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Acesso:</strong> solicitar informações sobre o tratamento dos seus dados</li>
                  <li><strong>Retificação:</strong> corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Eliminação:</strong> solicitar a exclusão de dados desnecessários ou tratados indevidamente</li>
                  <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
                  <li><strong>Oposição:</strong> opor-se ao tratamento baseado em legítimo interesse</li>
                  <li><strong>Revogação:</strong> retirar o consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Cookies e Tecnologias Similares</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência em nossa plataforma. 
                  Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Transferência Internacional</h2>
                <p>
                  Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. 
                  Nesses casos, garantimos que a transferência seja realizada com adequadas salvaguardas 
                  de proteção, conforme a LGPD.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Alterações nesta Política</h2>
                <p>
                  Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre 
                  alterações significativas através do e-mail cadastrado ou por meio de aviso em nossa plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Contato</h2>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco:
                </p>
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 mt-4">
                  <p><strong>E-mail:</strong> privacidade@aci.com.br</p>
                  <p><strong>Telefone:</strong> (88) 9 2156-7214</p>
                  <p><strong>Endereço:</strong> LUIZ SATURNINO DE MATOS, 39, Morada Nova, CE, CEP 62940-037</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
                <p>
                  Caso não seja possível resolver sua solicitação diretamente conosco, você pode contatar a ANPD:
                </p>
                <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4 mt-4">
                  <p><strong>Site:</strong> www.gov.br/anpd</p>
                  <p><strong>E-mail:</strong> atendimento@anpd.gov.br</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};