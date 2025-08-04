// Tipos para autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  provider?: 'email' | 'google';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

// Simulação de usuários (em produção, isso viria do backend)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@aci.com',
    name: 'Administrador',
    role: 'admin',
    provider: 'email',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'user@aci.com',
    name: 'Usuário Teste',
    role: 'user',
    provider: 'email',
    createdAt: new Date('2024-01-15'),
  },
];

class AuthService {
  private readonly TOKEN_KEY = 'aci_auth_token';
  private readonly USER_KEY = 'aci_user';
  private readonly REFRESH_TOKEN_KEY = 'aci_refresh_token';
  private currentSession: Session | null = null;

  // Simula login com backend
  async login(credentials: LoginCredentials): Promise<{ user: User; token: AuthToken }> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Busca usuário por email
    const user = MOCK_USERS.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Em produção, verificaria a senha com hash
    // Verifica senha específica para cada usuário
    const validPassword = (user.email === 'admin@aci.com' && credentials.password === 'admin123') ||
      (user.email === 'user@aci.com' && credentials.password === 'user123');

    if (!validPassword) {
      throw new Error('Email ou senha incorretos');
    }

    // Gera tokens
    const token: AuthToken = {
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresAt: new Date(Date.now() + (credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)),
    };

    // Atualiza último login
    user.lastLogin = new Date();

    // Salva no localStorage
    this.saveAuthData(user, token);

    // Cria sessão
    this.currentSession = {
      user: {
        ...user,
        avatar_url: user.avatar
      },
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expires_at: token.expiresAt.getTime()
    };

    return { user, token };
  }

  // Simula cadastro
  async signup(credentials: SignupCredentials): Promise<{ user: User; token: AuthToken }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verifica se email já existe
    if (MOCK_USERS.some(u => u.email === credentials.email)) {
      throw new Error('Email já cadastrado');
    }

    // Cria novo usuário
    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      role: 'user',
      provider: 'email',
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Adiciona à lista
    MOCK_USERS.push(newUser);

    // Gera tokens
    const token: AuthToken = {
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.saveAuthData(newUser, token);

    // Cria sessão
    this.currentSession = {
      user: {
        ...newUser,
        avatar_url: newUser.avatar
      },
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expires_at: token.expiresAt.getTime()
    };

    return { user: newUser, token };
  }

  // Login com Google (simulado)
  async loginWithGoogle(): Promise<{ user: User; token: AuthToken }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const googleUser: User = {
      id: 'google_' + Date.now(),
      email: 'usuario@gmail.com',
      name: 'Usuário Google',
      avatar: 'https://via.placeholder.com/40',
      avatar_url: 'https://via.placeholder.com/40',
      role: 'user',
      provider: 'google',
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    let existingUser = MOCK_USERS.find(u => u.email === googleUser.email);
    if (!existingUser) {
      MOCK_USERS.push(googleUser);
      existingUser = googleUser;
    } else {
      existingUser.lastLogin = new Date();
    }

    const token: AuthToken = {
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    this.saveAuthData(existingUser, token);

    this.currentSession = {
      user: {
        ...existingUser,
        avatar_url: existingUser.avatar
      },
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expires_at: token.expiresAt.getTime()
    };

    return { user: existingUser, token };
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentSession = null;
  }

  // SignOut (alias para logout)
  async signOut(): Promise<void> {
    this.logout();
  }

  // Verifica se usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    return new Date() < new Date(token.expiresAt);
  }

  // Obtém usuário atual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Obtém sessão atual
  getCurrentSession(): Session | null {
    if (!this.isAuthenticated()) return null;

    const user = this.getCurrentUser();
    const token = this.getStoredToken();

    if (!user || !token) return null;

    return {
      user: {
        ...user,
        provider: user.provider || 'email',
        avatar_url: user.avatar
      },
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expires_at: token.expiresAt.getTime()
    };
  }

  // Método para monitorar mudanças de autenticação
  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    // Verifica estado inicial
    const currentSession = this.getCurrentSession();
    callback(currentSession);

    // Simula listener de mudanças
    const interval = setInterval(() => {
      const session = this.getCurrentSession();
      callback(session);
    }, 1000);

    return () => clearInterval(interval);
  }

  // Métodos privados
  private generateToken(): string {
    return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
  }

  private saveAuthData(user: User, token: AuthToken): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token.refreshToken);
  }

  private getStoredToken(): AuthToken | null {
    const tokenStr = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenStr) return null;

    try {
      const token = JSON.parse(tokenStr);
      return {
        ...token,
        expiresAt: new Date(token.expiresAt),
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();