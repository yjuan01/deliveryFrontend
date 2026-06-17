import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/useAuth';
import api from '../../services/api';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Trash2, ArrowLeft, Minus, Plus } from 'lucide-react';
import styles from './CarrinhoPage.module.css';

export const CarrinhoPage = () => {
  const navigate = useNavigate();
  const { itens, restauranteId, removerItem, atualizarQuantidade, limparCarrinho, obterTotal } =
    useCarrinho();
  const { logado } = useAuth();
  const [observacao, setObservacao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  if (!logado) {
    return (
      <div className={styles.container}>
        <Card>
          <h1>Você precisa fazer login</h1>
          <p>Faça login para continuar com seu pedido</p>
          <Button onClick={() => navigate('/login')} fullWidth>
            Ir para Login
          </Button>
        </Card>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos de um restaurante para começar</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Voltar para Restaurantes
          </Button>
        </div>
      </div>
    );
  }

  const handleFinalizarPedido = async () => {
    try {
      setCarregando(true);
      setErro('');

      if (!restauranteId) {
        setErro('Erro: restaurante não identificado');
        return;
      }

      const pedidoData = {
        restauranteId,
        observacao: observacao || undefined,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUni: item.produto.preco,
        })),
      };

      await api.criarPedido(pedidoData);
      limparCarrinho();
      alert('Pedido realizado com sucesso! 🎉');
      navigate('/meus-pedidos');
    } catch (error: unknown) {
      const mensagem =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setErro(mensagem || 'Erro ao finalizar pedido');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const total = obterTotal();

  return (
    <div className={styles.container}>
      <Button onClick={() => navigate('/')} variant="secondary" className={styles.backBtn}>
        <ArrowLeft size={20} /> Continuar Comprando
      </Button>

      <div className={styles.content}>
        <div className={styles.itens}>
          <h1>Seu Carrinho</h1>

          {erro && <div className={styles.alert}>{erro}</div>}

          <div className={styles.listaItens}>
            {itens.map((item) => (
              <Card key={item.produtoId} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h3>{item.produto.nome}</h3>
                  <button
                    onClick={() => removerItem(item.produtoId)}
                    className={styles.removeBtn}
                    title="Remover"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className={styles.itemPreco}>R$ {item.produto.preco.toFixed(2)}</p>

                <div className={styles.itemControles}>
                  <div className={styles.quantidade}>
                    <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className={styles.subtotal}>
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className={styles.resumo}>
          <h2>Resumo do Pedido</h2>

          <Input
            label="Observações"
            placeholder="Alergias, preferências, etc..."
            value={observacao}
            onChange={setObservacao}
          />

          <div className={styles.resumoItems}>
            <div className={styles.resumoItem}>
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className={styles.resumoItem}>
              <span>Taxa de Entrega:</span>
              <span>R$ 0,00</span>
            </div>
            <div className={styles.resumoTotal}>
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleFinalizarPedido}
            fullWidth
            disabled={carregando || itens.length === 0}
          >
            {carregando ? 'Finalizando...' : 'Finalizar Pedido'}
          </Button>
        </Card>
      </div>
    </div>
  );
};
