import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (você deve fornecer estes valores)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos para o banco de dados
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

// Serviços de autenticação
export class SupabaseAuthService {
  // Cadastro de usuário
  async signUpUser(email: string, password: string, name: string, phone: string): Promise<AuthUser> {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: 'user'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Criar perfil na tabela users
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            phone,
            role: 'user'
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        id: authData.user.id,
        email,
        name,
        phone,
        role: 'user'
      };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  // Login de usuário
  async signInUser(email: string, password: string): Promise<AuthUser> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro no login');

      // Buscar dados do perfil
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
        role: profileData.role
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Login de administrador (com validação de role)
  async signInAdmin(email: string, password: string): Promise<AuthUser> {
    try {
      const user = await this.signInUser(email, password);
      
      if (user.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Apenas administradores podem acessar esta área.');
      }

      return user;
    } catch (error) {
      console.error('Erro no login admin:', error);
      throw error;
    }
  }

  // Logout
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Verificar usuário atual
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) return null;

      return {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
        role: profileData.role
      };
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return null;
    }
  }

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }
}

export const supabaseAuth = new SupabaseAuthService();