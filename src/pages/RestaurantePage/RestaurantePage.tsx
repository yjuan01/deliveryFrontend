import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Restaurante, Produto } from '../../types';
import api from '../../services/api';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/useAuth';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import styles from './RestaurantePage.module.css';

export const RestaurantePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logado } = useAuth();
  const { adicionarItem } = useCarrinho();

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [quantidades, setQuantidades] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (id) {
      carregarDados(parseInt(id));
    }
  }, [id]);

  const carregarDados = async (restauranteId: number) => {
    try {
      setCarregando(true);
      const [rest, prods] = await Promise.all([
        api.obterRestaurante(restauranteId),
        api.listarProdutosPorRestaurante(restauranteId),
      ]);
      setRestaurante(rest);
      setProdutos(prods);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar restaurante');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarAoCarrinho = (produto: Produto) => {
    if (!logado) {
      navigate('/login');
      return;
    }

    const quantidade = quantidades[produto.id] || 1;
    if (id) {
      adicionarItem(produto, parseInt(id), quantidade);
      setQuantidades({ ...quantidades, [produto.id]: 0 });
      alert(`${produto.nome} adicionado ao carrinho!`);
    }
  };

  if (carregando) {
    return <div className={styles.container}><p>Carregando...</p></div>;
  }

  if (!restaurante) {
    return (
      <div className={styles.container}>
        <Button onClick={() => navigate('/')} variant="secondary">
          <ArrowLeft size={20} /> Voltar
        </Button>
        <p>{erro || 'Restaurante não encontrado'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button onClick={() => navigate('/')} variant="secondary" className={styles.backBtn}>
        <ArrowLeft size={20} /> Voltar
      </Button>

      <Card className={styles.header}>
        <h1>{restaurante.nome}</h1>
        <p className={styles.descricao}>{restaurante.descricao}</p>
        {restaurante.endereco && <p className={styles.endereco}>📍 {restaurante.endereco}</p>}
        {restaurante.telefone && <p className={styles.telefone}>📞 {restaurante.telefone}</p>}
      </Card>

      <h2 className={styles.title}>Cardápio</h2>

      {produtos.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum produto disponível</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {produtos.map((produto) => (
            <Card key={produto.id} className={styles.produtoCard}>
              <h3>{produto.nome}</h3>
              {produto.descricao && <p className={styles.descProduto}>{produto.descricao}</p>}

              <div className={styles.preco}>
                R$ {produto.preco.toFixed(2)}
              </div>

              {!produto.disponivel && (
                <div className={styles.indisponivel}>Indisponível</div>
              )}

              {produto.disponivel && (
                <div className={styles.controles}>
                  <div className={styles.quantidade}>
                    <button
                      onClick={() =>
                        setQuantidades({
                          ...quantidades,
                          [produto.id]: Math.max(0, (quantidades[produto.id] || 1) - 1),
                        })
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quantidades[produto.id] || 1}</span>
                    <button
                      onClick={() =>
                        setQuantidades({
                          ...quantidades,
                          [produto.id]: (quantidades[produto.id] || 1) + 1,
                        })
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <Button
                    onClick={() => handleAdicionarAoCarrinho(produto)}
                    variant="primary"
                  >
                    Adicionar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
