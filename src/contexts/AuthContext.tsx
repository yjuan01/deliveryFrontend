import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import { AuthContext } from './AuthContextBase';
import api from '../services/api';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }
  return fallback;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const recuperarUsuario = async () => {
      try {
        setCarregando(true);
        const data = await api.obterPerfil();
        setUsuario(data);
        setErro(null);
      } catch (error: unknown) {
        console.error('Erro ao recuperar usuário:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
        setErro('Sessão expirada. Faça login novamente.');
      } finally {
        setCarregando(false);
      }
    };

    void recuperarUsuario();
  }, [token]);

  const login = async (email: string, senha: string) => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await api.login({ email, senha });
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUsuario(response.usuario);
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      const mensagem = getErrorMessage(error, 'Erro ao fazer login');
      setErro(mensagem);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    try {
      setCarregando(true);
      setErro(null);
      const response = await api.registrar({ nome, email, senha });
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUsuario(response.usuario);
    } catch (error: unknown) {
      const mensagem = getErrorMessage(error, 'Erro ao registrar');
      setErro(mensagem);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setErro(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        logado: !!usuario && !!token,
        login,
        registrar,
        logout,
        carregando,
        erro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
