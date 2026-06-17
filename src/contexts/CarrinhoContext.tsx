import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CarrinhoItem, Produto, CarrinhoContext as CarrinhoContextType } from '../types';

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);

  const adicionarItem = (produto: Produto, novoRestauranteId: number, quantidade: number) => {
    // Se trocar de restaurante, limpa carrinho
    if (restauranteId && restauranteId !== novoRestauranteId) {
      setItens([]);
      setRestauranteId(novoRestauranteId);
    } else {
      setRestauranteId(novoRestauranteId);
    }

    setItens((prevItens) => {
      const itemExistente = prevItens.find((item) => item.produtoId === produto.id);

      if (itemExistente) {
        return prevItens.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [...prevItens, { produtoId: produto.id, produto, quantidade }];
    });
  };

  const removerItem = (produtoId: number) => {
    setItens((prevItens) => prevItens.filter((item) => item.produtoId !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    setItens((prevItens) =>
      prevItens.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
    setRestauranteId(null);
  };

  const obterTotal = () => {
    return itens.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        restauranteId,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        obterTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho must be used within CarrinhoProvider');
  }
  return context;
};
