import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const API_URL = 'http://localhost:3006/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@LuxeVintage:usuario');
    const tokenSalvo = localStorage.getItem('@LuxeVintage:token');
    
    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, senha });
      
      if (response.data.success) {
        setUsuario(response.data.usuario);
        localStorage.setItem('@LuxeVintage:usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('@LuxeVintage:token', response.data.token);
        toast.success('Login realizado com sucesso!');
        return { success: true };
      }
    } catch (error) {
      console.error('Erro detalhado:', error); 
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { nome, email, senha });
      
      if (response.data.success) {
        setUsuario(response.data.usuario);
        localStorage.setItem('@LuxeVintage:usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('@LuxeVintage:token', response.data.token);
        toast.success('Cadastro realizado com sucesso!');
        return { success: true };
      }
    } catch (error) {
      console.error('Erro detalhado:', error); 
      toast.error(error.response?.data?.message || 'Erro ao cadastrar');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('@LuxeVintage:usuario');
    localStorage.removeItem('@LuxeVintage:token');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};