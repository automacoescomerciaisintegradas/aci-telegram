// Serviço para validação de documentos e consulta CNPJ
export interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao: string;
  porte: string;
  natureza_juridica: string;
  atividade_principal: {
    codigo: string;
    descricao: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  data?: CNPJData;
}

class DocumentValidationService {
  private readonly CNPJ_API_TOKEN = 'd09b2394397dcb41e675e77c84d712acbb7bb625504e64f56157c2d33578839c';
  private readonly CNPJ_API_URL = 'https://api.cnpja.com/office';

  // Validar CPF
  validateCPF(cpf: string): boolean {
    // Remove formatação
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;
    
    if (digit1 !== parseInt(cleanCPF.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;
    
    return digit2 === parseInt(cleanCPF.charAt(10));
  }

  // Validar CNPJ
  validateCNPJ(cnpj: string): boolean {
    // Remove formatação
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (cleanCNPJ.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return digit2 === parseInt(cleanCNPJ.charAt(13));
  }

  // Consultar CNPJ na API
  async consultCNPJ(cnpj: string): Promise<ValidationResult> {
    try {
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      
      // Primeiro valida o formato
      if (!this.validateCNPJ(cleanCNPJ)) {
        return {
          isValid: false,
          message: 'CNPJ inválido. Verifique os dígitos informados.'
        };
      }

      // Consulta na API
      const response = await fetch(`${this.CNPJ_API_URL}/${cleanCNPJ}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.CNPJ_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            isValid: false,
            message: 'CNPJ não encontrado na Receita Federal.'
          };
        }
        throw new Error(`Erro na consulta: ${response.status}`);
      }

      const data: CNPJData = await response.json();
      
      // Verifica se a empresa está ativa
      if (data.situacao !== 'ATIVA') {
        return {
          isValid: false,
          message: `Empresa com situação: ${data.situacao}. Apenas empresas ativas são aceitas.`
        };
      }

      return {
        isValid: true,
        message: 'CNPJ válido e empresa ativa.',
        data
      };

    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      return {
        isValid: false,
        message: 'Erro ao consultar CNPJ. Tente novamente em alguns instantes.'
      };
    }
  }

  // Validar nome (básico)
  validateName(name: string): boolean {
    const cleanName = name.trim();
    
    // Deve ter pelo menos 2 caracteres
    if (cleanName.length < 2) return false;
    
    // Deve ter pelo menos um espaço (nome e sobrenome)
    if (!cleanName.includes(' ')) return false;
    
    // Não deve conter números
    if (/\d/.test(cleanName)) return false;
    
    // Deve conter apenas letras, espaços e acentos
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(cleanName)) return false;
    
    return true;
  }

  // Formatar CPF
  formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // Formatar CNPJ
  formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  // Validação completa do formulário
  async validateForm(documentType: 'CPF' | 'CNPJ', document: string, name: string): Promise<ValidationResult> {
    // Validar nome
    if (!this.validateName(name)) {
      return {
        isValid: false,
        message: 'Nome inválido. Informe nome e sobrenome completos, apenas com letras.'
      };
    }

    // Validar documento
    if (documentType === 'CPF') {
      if (!this.validateCPF(document)) {
        return {
          isValid: false,
          message: 'CPF inválido. Verifique os dígitos informados.'
        };
      }
      
      return {
        isValid: true,
        message: 'CPF válido.'
      };
    } else {
      // Para CNPJ, consulta na API
      return await this.consultCNPJ(document);
    }
  }
}

export const documentValidationService = new DocumentValidationService();