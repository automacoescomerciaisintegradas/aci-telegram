import { useState, useEffect, useCallback } from 'react';
import { authService, User, LoginCredentials, SignupCredentials, ResetPasswordCredentials, ChangePasswordCredentials } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<string>;
  changePassword: (credentials: ChangePasswordCredentials) => Promise<string>;
  loginWithGoogle: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Inicializa o estado de autenticação
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        const user = isAuth ? authService.getCurrentUser() : null;
        
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Erro ao verificar autenticação',
        });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await authService.login(credentials);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro no login',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Signup
  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await authService.signup(credentials);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro no cadastro',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh autenticação
  const refreshAuth = useCallback(async () => {
    try {
      await authService.refreshToken();
      const user = authService.getCurrentUser();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
      }));
    } catch (error) {
      logout();
    }
  }, [logout]);

  // Reset password
  const resetPassword = useCallback(async (credentials: ResetPasswordCredentials): Promise<string> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authService.resetPassword(credentials);
      setState(prev => ({ ...prev, isLoading: false }));
      return result.message;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao enviar email de recuperação',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (credentials: ChangePasswordCredentials): Promise<string> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authService.changePassword(credentials);
      setState(prev => ({ ...prev, isLoading: false }));
      return result.message;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao alterar senha',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await authService.loginWithGoogle();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro no login com Google',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    clearError,
    refreshAuth,
    resetPassword,
    changePassword,
    loginWithGoogle,
  };
};