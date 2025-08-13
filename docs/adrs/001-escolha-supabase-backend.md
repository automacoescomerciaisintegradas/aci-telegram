# ADR-001: Escolha do Supabase para Backend e Autenticação

## Título
Escolha do Supabase para Backend e Autenticação

## Status
- [x] Aprovado
- [ ] Superseded (Substituído por ADR-XXX)

## Contexto
No início do desenvolvimento do TelegramShopee, foi necessário escolher uma plataforma de backend que fornecesse:

1. Banco de dados PostgreSQL
2. Sistema de autenticação completo
3. APIs REST e GraphQL
4. Tempo de desenvolvimento rápido
5. Escalabilidade para o futuro

As opções consideradas foram:
- Firebase (Google)
- Supabase
- Desenvolvimento backend customizado com Node.js/Express
- AWS Amplify

## Decisão
Escolher o Supabase como plataforma backend para o projeto TelegramShopee.

## Racional
A decisão foi baseada em vários fatores:

1. **Open Source**: Supabase é open source, o que permite maior controle e personalização
2. **PostgreSQL**: Utiliza PostgreSQL, um banco de dados relacional robusto e confiável
3. **Desenvolvimento Rápido**: Fornece uma solução completa que acelera o desenvolvimento
4. **Compatibilidade**: APIs compatíveis com padrões existentes (PostgREST)
5. **Custo**: Gratuito para projetos em fase inicial com possibilidade de escalar

## Consequências
### Positivas
- Redução significativa no tempo de desenvolvimento do backend
- Sistema de autenticação completo com suporte a diversos provedores
- Banco de dados relacional poderoso
- APIs REST e GraphQL automaticamente geradas

### Negativas
- Depende de um serviço externo
- Possíveis limitações em comparação com uma solução totalmente customizada
- Necessidade de aprender os conceitos específicos do Supabase

## Alternativas Consideradas
### Firebase (Google)
**Razão para rejeição:** Banco de dados NoSQL do Firestore não atende às necessidades relacionais do projeto.

### Desenvolvimento backend customizado
**Razão para rejeição:** Tempo de desenvolvimento muito maior, requer manutenção contínua e infraestrutura.

### AWS Amplify
**Razão para rejeição:** Complexidade maior e custo inicial mais alto para o escopo do projeto.

## Data da Decisão
15/07/2025

## Participantes
- Decisor(es): Equipe de Desenvolvimento
- Consultados: CTO, Product Manager

## Referências
- Documentação Supabase: https://supabase.io/docs
- SUPABASE_SETUP.md
- ATIVAR_SUPABASE.md
- CONFIGURAR_SUPABASE.md