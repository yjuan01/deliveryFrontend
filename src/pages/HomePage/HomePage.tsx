import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Restaurante } from '../../types';
import api from '../../services/api';
import { Card } from '../../components/Card/Card';
import { MapPin, Phone, UtensilsCrossed, Clock } from 'lucide-react';
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
      <div className={styles.page}>
        <div className={styles.topbar}>
          <div className={styles.topbarInner}>
            <span className={styles.logo}>Food<b>Delivery</b></span>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <span className={styles.logo}>Food<b>Delivery</b></span>
          <p className={styles.tagline}>Escolha um restaurante e comece a pedir</p>
        </div>
      </div>

      <div className={styles.container}>
        {erro && <div className={styles.alert}>{erro}</div>}

        <h2 className={styles.sectionTitle}>Restaurantes</h2>

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
                    <span className={styles.openBadge}>Aberto</span>
                  </div>

                  <div className={styles.body}>
                    <h2 className={styles.nome}>{restaurante.nome}</h2>

                    <p className={styles.descricao}>{restaurante.descricao}</p>

                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <Clock size={13} />
                        30-45 min
                      </span>
                      {restaurante.endereco && (
                        <span className={styles.metaItem}>
                          <MapPin size={13} />
                          <span className={styles.truncate}>{restaurante.endereco}</span>
                        </span>
                      )}
                    </div>

                    {restaurante.telefone && (
                      <div className={styles.metaItem}>
                        <Phone size={13} />
                        <span>{restaurante.telefone}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};