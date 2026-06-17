import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { ShoppingCart, LogOut, Menu } from 'lucide-react';
import styles from './Header.module.css';
import { useState } from 'react';

export const Header = () => {
  const { usuario, logado, logout } = useAuth();
  const { itens } = useCarrinho();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🍕 FoodDelivery
        </Link>

        <button 
          className={styles.menuToggle}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <Menu size={24} />
        </button>

        <nav className={`${styles.nav} ${menuAberto ? styles.navAberto : ''}`}>
          <Link to="/" className={styles.link}>
            Restaurantes
          </Link>

          {logado && (
            <>
              <Link to="/meus-pedidos" className={styles.link}>
                Meus Pedidos
              </Link>
              <Link to="/carrinho" className={styles.cartLink}>
                <ShoppingCart size={20} />
                {itens.length > 0 && <span className={styles.badge}>{itens.length}</span>}
              </Link>
              <div className={styles.user}>
                <span className={styles.username}>{usuario?.nome}</span>
                <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          )}

          {!logado && (
            <>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/registrar" className={styles.link}>
                Registrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
