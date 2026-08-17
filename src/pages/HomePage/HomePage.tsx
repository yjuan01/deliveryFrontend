import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Restaurante } from '../../types';
import api from '../../services/api';
import { Card } from '../../components/Card/Card';
import { MapPin, Phone, UtensilsCrossed, ArrowRight } from 'lucide-react';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  const carregarRestaurantes = async () => {
    try {
      setCarregando(true);
      const data = await api.listarRestaurantes();
      setRestaurantes(data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar restaurantes');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const getIniciais = (nome: string) =>
    nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();

  if (carregando) {
    return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.badge}>🍔 Peça agora</span>
          <h1>Bem-vindo ao FoodDelivery</h1>
          <p>Escolha um restaurante e comece a pedir</p>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.badge}>🍔 Peça agora</span>
        <h1>Bem-vindo ao FoodDelivery</h1>
        <p>Escolha um restaurante e comece a pedir</p>
      </div>

      {erro && <div className={styles.alert}>{erro}</div>}

      {restaurantes.length === 0 ? (
        <div className={styles.empty}>
          <UtensilsCrossed size={40} strokeWidth={1.5} />
          <p>Nenhum restaurante disponível no momento</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {restaurantes.map((restaurante) => (
            <Link
              key={restaurante.id}
              to={`/restaurante/${restaurante.id}`}
              className={styles.link}
            >
              <Card className={styles.restauranteCard}>
                <div className={styles.cover}>
                  <span className={styles.coverInitials}>
                    {getIniciais(restaurante.nome)}
                  </span>
                </div>

                <div className={styles.body}>
                  <div className={styles.header}>
                    <h2>{restaurante.nome}</h2>
                  </div>

                  <p className={styles.descricao}>{restaurante.descricao}</p>

                  <div className={styles.info}>
                    {restaurante.endereco && (
                      <div className={styles.infoItem}>
                        <MapPin size={15} />
                        <span>{restaurante.endereco}</span>
                      </div>
                    )}
                    {restaurante.telefone && (
                      <div className={styles.infoItem}>
                        <Phone size={15} />
                        <span>{restaurante.telefone}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.footer}>
                    <span className={styles.cta}>
                      Ver menu <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};