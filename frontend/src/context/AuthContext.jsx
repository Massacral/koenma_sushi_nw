import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// URL do backend no Render
const API_URL = 'https://koenma-sushi-nw.onrender.com';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@KoenmaSushi:usuario');
    const tokenSalvo = localStorage.getItem('@KoenmaSushi:token');
    
    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setLoading(false);
  }, []);

  // FUNÇÃO DE LOGIN CORRIGIDA
  const login = async (email, senha) => {
    try {
      console.log('🔐 Tentando login com:', email);
      console.log('📡 URL:', `${API_URL}/api/login`); // ← ADICIONADO /api/
      
      const response = await axios.post(`${API_URL}/api/login`, { email, senha });
      
      console.log('📦 Resposta do servidor:', response.data);
      
      if (response.data.success) {
        setUsuario(response.data.usuario);
        localStorage.setItem('@KoenmaSushi:usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('@KoenmaSushi:token', response.data.token);
        toast.success(`Bem-vindo, ${response.data.usuario.nome}!`);
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao fazer login');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Erro no login:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erro ao conectar com o servidor';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // FUNÇÃO DE REGISTRO CORRIGIDA - Agora aceita um objeto
  const register = async (userData) => {
    try {
      console.log('📝 Tentando cadastrar:', userData);
      console.log('📡 URL:', `${API_URL}/api/register`); // ← ADICIONADO /api/
      
      const response = await axios.post(`${API_URL}/api/register`, {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        telefone: userData.telefone || '',
        endereco: userData.endereco || "Rua das Flores, 123 - Asa Sul, Brasília - DF"
      });
      
      console.log('📦 Resposta do servidor:', response.data);
      
      if (response.data.success) {
        setUsuario(response.data.usuario);
        localStorage.setItem('@KoenmaSushi:usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('@KoenmaSushi:token', response.data.token);
        toast.success(`Cadastro realizado com sucesso! Bem-vindo, ${userData.nome}!`);
        return { success: true };
      } else {
        toast.error(response.data.message || 'Erro ao cadastrar');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Erro no cadastro:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erro ao conectar com o servidor';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('@KoenmaSushi:usuario');
    localStorage.removeItem('@KoenmaSushi:token');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
