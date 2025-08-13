# Documento de Design - Sistema de Gerenciamento de Produtos

## Visão Geral

O sistema de gerenciamento de produtos será implementado como uma funcionalidade central da plataforma ACI, permitindo aos usuários gerenciar seus catálogos de e-commerce de forma integrada. O design foca em usabilidade, performance e integração seamless com APIs externas, especialmente o Shopee, utilizando React com TypeScript e serviços modulares.

## Arquitetura

### Estrutura de Componentes

```
components/
├── ProductsPage.tsx              # Página principal de produtos
├── ProductList.tsx               # Lista de produtos com filtros
├── ProductCard.tsx               # Card individual do produto
├── ProductForm.tsx               # Formulário de criação/edição
├── ProductImageUpload.tsx        # Upload de imagens
├── ProductSyncModal.tsx          # Modal de sincronização com Shopee
├── ProductReports.tsx            # Relatórios e métricas
├── StockAlert.tsx                # Componente de alerta de estoque
└── ProductFilters.tsx            # Filtros e busca

services/
├── productService.ts             # CRUD de produtos
├── shopeeIntegrationService.ts   # Integração com Shopee API
├── imageService.ts               # Gerenciamento de imagens
├── stockService.ts               # Controle de estoque
├── reportService.ts              # Geração de relatórios
└── aiContentService.ts           # Geração de conteúdo com IA
```

### Fluxo de Dados

1. **Carregamento**: ProductsPage → productService.getAll() → localStorage/API
2. **Sincronização**: ProductSyncModal → shopeeIntegrationService.sync() → merge local
3. **CRUD**: ProductForm → productService.save() → localStorage → atualização UI
4. **Busca**: ProductFilters → productService.search() → lista filtrada
5. **Relatórios**: ProductReports → reportService.generate() → métricas

## Componentes e Interfaces

### ProductService

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'available' | 'unavailable' | 'low_stock';
  images: ProductImage[];
  shopeeId?: string;
  shopeeData?: ShopeeProductData;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  isPrimary: boolean;
}

interface ProductService {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, updates: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  search(query: string, filters: ProductFilters): Promise<Product[]>;
  updateStock(id: string, quantity: number): Promise<void>;
}
```

### ShopeeIntegrationService

```typescript
interface ShopeeProductData {
  itemId: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  lastSync: Date;
}

interface SyncResult {
  imported: number;
  updated: number;
  conflicts: ProductConflict[];
  errors: string[];
}

interface ProductConflict {
  localProduct: Product;
  shopeeProduct: ShopeeProductData;
  differences: string[];
}

interface ShopeeIntegrationService {
  syncProducts(): Promise<SyncResult>;
  importProduct(shopeeProduct: ShopeeProductData): Promise<Product>;
  exportProduct(product: Product): Promise<void>;
  resolveConflict(conflict: ProductConflict, resolution: 'local' | 'shopee'): Promise<void>;
}
```

### ImageService

```typescript
interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface ImageService {
  upload(file: File): Promise<ImageUploadResult>;
  delete(imageId: string): Promise<void>;
  resize(file: File, maxWidth: number, maxHeight: number): Promise<File>;
  validateImage(file: File): { valid: boolean; error?: string };
}
```

### ReportService

```typescript
interface ProductMetrics {
  totalProducts: number;
  availableProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  categoriesDistribution: { [category: string]: number };
  stockStatus: { available: number; unavailable: number; lowStock: number };
}

interface ReportService {
  getMetrics(): Promise<ProductMetrics>;
  exportToCsv(products: Product[]): Promise<string>;
  generateCategoryReport(): Promise<CategoryReport[]>;
}
```

## Modelos de Dados

### Estrutura no localStorage

```json
{
  "aci_products": {
    "version": "1.0",
    "lastUpdated": "2025-02-08T10:30:00Z",
    "products": [
      {
        "id": "prod_001",
        "name": "Smartphone XYZ",
        "description": "Smartphone com 128GB...",
        "price": 899.99,
        "category": "Eletrônicos",
        "stock": 15,
        "status": "available",
        "images": [
          {
            "id": "img_001",
            "url": "data:image/jpeg;base64,...",
            "filename": "smartphone-front.jpg",
            "size": 1024000,
            "isPrimary": true
          }
        ],
        "shopeeId": "123456789",
        "shopeeData": {
          "itemId": 123456789,
          "shopId": 987654321,
          "lastSync": "2025-02-08T10:30:00Z"
        },
        "createdAt": "2025-02-01T10:00:00Z",
        "updatedAt": "2025-02-08T10:30:00Z"
      }
    ],
    "categories": [
      "Eletrônicos",
      "Roupas",
      "Casa e Jardim",
      "Esportes",
      "Beleza"
    ],
    "settings": {
      "lowStockThreshold": 5,
      "autoSync": false,
      "syncInterval": 3600000
    }
  }
}
```

### Categorias Padrão

```typescript
const DEFAULT_CATEGORIES = [
  'Eletrônicos',
  'Roupas e Acessórios',
  'Casa e Jardim',
  'Esportes e Lazer',
  'Beleza e Cuidados',
  'Livros e Mídia',
  'Brinquedos',
  'Automotivo',
  'Saúde',
  'Outros'
];
```

## Tratamento de Erros

### Estratégias de Erro

1. **Produto Não Encontrado**: Exibir mensagem e redirecionar para lista
2. **Erro de Sincronização**: Mostrar detalhes do erro e permitir retry
3. **Falha no Upload**: Exibir progresso e permitir reenvio
4. **Conflito de Dados**: Modal para resolução manual
5. **Limite de Armazenamento**: Notificar e sugerir limpeza

### Códigos de Erro

```typescript
enum ProductErrorCode {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INVALID_PRODUCT_DATA = 'INVALID_PRODUCT_DATA',
  SHOPEE_API_ERROR = 'SHOPEE_API_ERROR',
  IMAGE_UPLOAD_FAILED = 'IMAGE_UPLOAD_FAILED',
  STORAGE_LIMIT_EXCEEDED = 'STORAGE_LIMIT_EXCEEDED',
  SYNC_CONFLICT = 'SYNC_CONFLICT'
}
```

## Integração com IA (Gemini)

### Geração de Descrições

```typescript
interface AIContentService {
  generateDescription(productName: string, category: string, features?: string[]): Promise<string>;
  generateTags(product: Product): Promise<string[]>;
  optimizeTitle(title: string, category: string): Promise<string>;
}

// Exemplo de prompt para Gemini
const DESCRIPTION_PROMPT = `
Gere uma descrição atrativa e otimizada para vendas do seguinte produto:
Nome: {productName}
Categoria: {category}
Características: {features}

A descrição deve:
- Ter entre 100-200 palavras
- Destacar benefícios principais
- Usar linguagem persuasiva
- Incluir call-to-action
- Ser otimizada para SEO
`;
```

## Interface do Usuário

### Layout Principal

```
┌─────────────────────────────────────────────────────┐
│ Header: Produtos (+ Adicionar) [Sincronizar Shopee] │
├─────────────────────────────────────────────────────┤
│ Filtros: [Busca] [Categoria▼] [Status▼] [Limpar]   │
├─────────────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│ │Prod1│ │Prod2│ │Prod3│ │Prod4│ ...                │
│ │ IMG │ │ IMG │ │ IMG │ │ IMG │                    │
│ │Nome │ │Nome │ │Nome │ │Nome │                    │
│ │R$99 │ │R$149│ │R$79 │ │R$199│                    │
│ │Est:5│ │Est:0│ │Est:12│ │Est:3│                    │
│ └─────┘ └─────┘ └─────┘ └─────┘                    │
├─────────────────────────────────────────────────────┤
│ Paginação: ← 1 2 3 4 5 →                           │
└─────────────────────────────────────────────────────┘
```

### Estados Visuais

1. **Estoque Normal**: Card com borda verde
2. **Estoque Baixo**: Card com borda amarela e ícone de alerta
3. **Sem Estoque**: Card com borda vermelha e overlay "Indisponível"
4. **Sincronizando**: Spinner e overlay semi-transparente
5. **Conflito**: Ícone de aviso e botão "Resolver"

## Estratégia de Testes

### Testes Unitários

1. **ProductService**: CRUD operations, validação de dados
2. **ShopeeIntegrationService**: Sync, import, export, conflict resolution
3. **ImageService**: Upload, resize, validation
4. **ReportService**: Metrics calculation, CSV generation
5. **Componentes**: Rendering, user interactions, state management

### Testes de Integração

1. **Fluxo Completo**: Criar → Editar → Sincronizar → Relatório
2. **Upload de Imagens**: Validação → Upload → Preview → Save
3. **Sincronização**: Fetch Shopee → Compare → Resolve conflicts → Update
4. **Filtros e Busca**: Apply filters → Search → Results update

### Testes de Performance

1. **Lista de Produtos**: Renderização de 1000+ produtos
2. **Upload de Imagens**: Múltiplos uploads simultâneos
3. **Sincronização**: Sync de 500+ produtos
4. **Busca**: Search em catálogo grande

## Considerações de Performance

### Otimizações

1. **Virtualização**: Lista virtual para muitos produtos
2. **Lazy Loading**: Imagens carregadas sob demanda
3. **Debounce**: Busca com delay de 300ms
4. **Caching**: Cache de produtos em memória
5. **Paginação**: Máximo 50 produtos por página

### Limites

1. **Produtos**: Máximo 10.000 produtos
2. **Imagens**: Máximo 5 por produto, 2MB cada
3. **Sincronização**: Máximo 100 produtos por batch
4. **localStorage**: Monitoramento de uso (máximo 5MB)

## Melhorias Futuras

### Fase 2

1. **Backup na Nuvem**: Sincronização com Google Drive/Dropbox
2. **Múltiplas Lojas**: Suporte a diferentes marketplaces
3. **Automação**: Regras de precificação dinâmica
4. **Analytics**: Métricas avançadas de performance

### Fase 3

1. **Colaboração**: Múltiplos usuários por conta
2. **API Própria**: Endpoints para integrações externas
3. **Mobile App**: Aplicativo para gestão mobile
4. **Machine Learning**: Previsão de demanda e otimização automática