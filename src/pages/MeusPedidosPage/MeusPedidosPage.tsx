import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Pedido } from '../../types';
import api from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Clock, CheckCircle, AlertCircle, Truck, Home } from 'lucide-react';
import styles from './MeusPedidosPage.module.css';

const statusIcons: { [key: string]: JSX.Element } = {
  pendente: <Clock size={20} />,
  confirmado: <CheckCircle size={20} />,
  em_preparo: <AlertCircle size={20} />,
  saiu_entrega: <Truck size={20} />,
  entregue: <Home size={20} />,
  cancelado: <AlertCircle size={20} />,
};

const statusLabels: { [key: string]: string } = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_preparo: 'Em Preparo',
  saiu_entrega: 'Saiu para Entrega',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const MeusPedidosPage = () => {
  const navigate = useNavigate();
  const { logado } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPedidos = async () => {
    try {
      setCarregando(true);
      const data = await api.listarMeusPedidos();
      setPedidos(data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar pedidos');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!logado) {
      navigate('/login');
      return;
    }
    carregarPedidos();
  }, [logado, navigate, carregarPedidos]);

  if (carregando) {
    return <div className={styles.container}><p>Carregando pedidos...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1>Meus Pedidos</h1>

      {erro && <div className={styles.alert}>{erro}</div>}

      {pedidos.length === 0 ? (
        <Card className={styles.empty}>
          <h2>Você ainda não fez nenhum pedido</h2>
          <p>Comece pedindo algo delicioso agora!</p>
          <Button onClick={() => navigate('/')}>
            Ir para Restaurantes
          </Button>
        </Card>
      ) : (
        <div className={styles.lista}>
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className={styles.pedidoCard}>
              <div className={styles.header}>
                <div className={styles.info}>
                  <h3>Pedido #{pedido.id}</h3>
                  <p className={styles.data}>
                    {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`${styles.status} ${styles[pedido.status]}`}>
                  {statusIcons[pedido.status]}
                  <span>{statusLabels[pedido.status]}</span>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.item}>
                  <span>Restaurante:</span>
                  <strong>ID #{pedido.restauranteId}</strong>
                </div>
                <div className={styles.item}>
                  <span>Itens:</span>
                  <strong>{pedido.itens.length}</strong>
                </div>
                <div className={styles.item}>
                  <span>Total:</span>
                  <strong className={styles.preco}>R$ {pedido.total.toFixed(2)}</strong>
                </div>
              </div>

              {pedido.observacao && (
                <div className={styles.observacao}>
                  <strong>Observações:</strong>
                  <p>{pedido.observacao}</p>
                </div>
              )}

              <div className={styles.itensLista}>
                <strong>Itens do Pedido:</strong>
                <ul>
                  {pedido.itens.map((item) => (
                    <li key={item.id}>
                      Produto #{item.produtoId} - {item.quantidade}x R$ {item.precoUni.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.footer}>
                <Button variant="secondary" onClick={() => navigate(`/`)}>
                  Fazer novo pedido
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
