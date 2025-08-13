# Documentação Técnica

Esta pasta contém documentações técnicas importantes do projeto, incluindo:

- **RFCs (Request For Comments)**: Propostas de mudanças técnicas ou funcionais para discussão da equipe
- **ADRs (Architecture Decision Records)**: Registros das decisões arquiteturais tomadas no projeto

## Estrutura

- `/rfcs` - Contém os RFCs em formato numérico (ex: 001-nome-da-proposta.md)
- `/adrs` - Contém os ADRs em formato numérico (ex: 001-decisao-arquitetural.md)

## Nomeclatura

- Os arquivos são nomeados com um número sequencial seguido de um descritivo em kebab-case
- Exemplos:
  - `001-migracao-para-nova-api.md`
  - `002-integracao-com-servico-x.md`

## Processo

### RFC (Request For Comments)
1. Crie um novo RFC usando o template em `rfcs/template.md`
2. Nomeie com número sequencial e descrição
3. Compartilhe com a equipe para revisão e discussão
4. Após aprovação, implemente as mudanças
5. Converta para ADR após implementação (se relevante)

### ADR (Architecture Decision Record)
1. Criado após uma decisão arquitetural importante
2. Pode ser convertido de um RFC após aprovação e implementação
3. Serve como registro histórico das decisões do projeto