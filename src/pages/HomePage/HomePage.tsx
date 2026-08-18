import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Restaurante } from '../../types';
import api from '../../services/api';
import { Card } from '../../components/Card/Card';
import {
  MapPin,
  Phone,
  UtensilsCrossed,
  Clock,
  Star,
  Search,
  ShoppingCart,
  ChevronRight,
  User,
  ClipboardList,
} from 'lucide-react';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [searchRestaurant, setSearchRestaurant] = useState('');

  // troque por um hook de auth real (useAuth, contexto, etc.) quando tiver
  const usuarioLogado = false;

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

  const getGradiente = (nome: string) => {
    const paletas = [
      ['#EA1D2C', '#FF6B4A'],
      ['#F0142F', '#FF8A3D'],
      ['#D6122A', '#F0402E'],
      ['#E01A3C', '#FF7A59'],
    ];
    const idx = nome.charCodeAt(0) % paletas.length;
    return `linear-gradient(135deg, ${paletas[idx][0]} 0%, ${paletas[idx][1]} 100%)`;
  };

  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(searchRestaurant.trim().toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerActions}>
            {usuarioLogado && (
              <>
                <Link to="/carrinho" className={styles.iconBtn} title="Carrinho">
                  <ShoppingCart size={20} />
                </Link>
                <Link to="/meus-pedidos" className={styles.iconBtn} title="Meus pedidos">
                  <ClipboardList size={20} />
                </Link>
                <Link to="/perfil" className={styles.iconBtn} title="Perfil">
                  <User size={20} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>

         {/* CATEGORY CARDS */}
        <div className={styles.categoryCards}>
          <Link to="/meus-pedidos" className={styles.cartLink}>
            <div className={`${styles.categoryCard} ${styles.categoryRed}`}>
              <div className={styles.categoryText}>
                <h3>Veja seus pedidos</h3>
                <span className={styles.categoryLink}>
                  Chegue Logo <ChevronRight size={14} />
                </span>
              </div>
              <span className={styles.categoryEmoji}>🍔</span>
            </div>
          </Link>

          <Link to="/carrinho" className={styles.cartLink}>
            <div className={`${styles.categoryCard} ${styles.categoryGreen}`}>
              <div className={styles.categoryText}>
                <h3>Carrinho</h3>
                <span className={styles.categoryLink}>
                  Compre logo antes que acabe! <ChevronRight size={14} />
                </span>
              </div>
              <ShoppingCart size={56} className={styles.categoryIconLarge} />
            </div>
          </Link>
        </div>

        <h1 className={styles.heroTitle}>Fácil, rápido e na sua porta</h1>
        <p className={styles.heroSubtitle}>
          Pesquise aqui seus restaurentes favoritos.
        </p>

        <div className={styles.searchBar}>
          <div className={styles.searchInputWrap}>
            <MapPin size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar restaurantes"
              value={searchRestaurant}
              onChange={(e) => setSearchRestaurant(e.target.value)}
            />
          </div>
          <button className={styles.searchBtn}>
            <Search size={16} />
            Buscar
          </button>
        </div>
      </section>

      {/* RESTAURANT LIST */}
      <div className={styles.container}>
        {erro && <div className={styles.alert}>{erro}</div>}

        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Restaurantes perto de você</h2>
          {!carregando && (
            <span className={styles.sectionCount}>
              {restaurantesFiltrados.length}{' '}
              {restaurantesFiltrados.length === 1 ? 'opção' : 'opções'}
            </span>
          )}
        </div>

        {carregando ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : restaurantesFiltrados.length === 0 ? (
          <div className={styles.empty}>
            <UtensilsCrossed size={40} strokeWidth={1.5} />
            <p>
              {searchRestaurant
                ? 'Nenhum restaurante encontrado para sua busca'
                : 'Nenhum restaurante disponível no momento'}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {restaurantesFiltrados.map((restaurante) => (
              <Link
                key={restaurante.id}
                to={`/restaurante/${restaurante.id}`}
                className={styles.link}
              >
                <Card className={styles.restauranteCard}>
                  <div
                    className={styles.cover}
                    style={{ background: getGradiente(restaurante.nome) }}
                  >
                    <span className={styles.coverInitials}>
                      {getIniciais(restaurante.nome)}
                    </span>
                    <span className={styles.openBadge}>
                      <span className={styles.dot} />
                      Aberto
                    </span>
                  </div>

                  <div className={styles.body}>
                    <div className={styles.titleRow}>
                      <h2 className={styles.nome}>{restaurante.nome}</h2>
                      <span className={styles.rating}>
                        <Star size={12} fill="#FFB800" strokeWidth={0} />
                        4.8
                      </span>
                    </div>

                    <p className={styles.descricao}>{restaurante.descricao}</p>

                    <div className={styles.divider} />

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