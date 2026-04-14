import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { produtos } from '../data/produtos';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('@KoenmaSushi:carrinho');
    if (carrinhoSalvo) {
      setItens(JSON.parse(carrinhoSalvo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('@KoenmaSushi:carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarAoCarrinho = (produtoId, quantidade = 1) => {
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
      toast.error('Item não encontrado no cardápio');
      return;
    }

    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.id === produtoId);
      
      if (itemExistente) {
        toast.success('Quantidade atualizada no pedido!');
        return prevItens.map(item =>
          item.id === produtoId
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        toast.success('Item adicionado ao pedido!');
        return [...prevItens, {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagens[0],
          descricao: produto.descricao,
          categoria: produto.categoria,
          quantidade
        }];
      }
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setItens(prevItens => prevItens.filter(item => item.id !== produtoId));
    toast.success('Item removido do pedido!');
  };

  const atualizarQuantidade = (produtoId, quantidade) => {
    if (quantidade < 1) {
      removerDoCarrinho(produtoId);
      return;
    }

    setItens(prevItens =>
      prevItens.map(item =>
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
    localStorage.removeItem('@KoenmaSushi:carrinho');
    toast.success('Pedido cancelado!');
  };

  const getTotalItens = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  const getPrecoTotal = () => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  return (
    <CarrinhoContext.Provider value={{
      itens,
      loading,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      getTotalItens,
      getPrecoTotal
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};