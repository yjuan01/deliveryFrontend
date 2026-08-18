import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { ShoppingCart, LogOut, Menu, User } from 'lucide-react';
import styles from './Header.module.css';
import { useState } from 'react';

export const Header = () => {
  const { usuario, logado, logout } = useAuth();
  const { itens } = useCarrinho();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilMenuAberto, setPerfilMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
       <Link to="/" className={styles.logo}>
            Delivery<span className={styles.logoAccent}>food</span>
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
              {usuario?.role === 'admin' && (
                <Link to="/admin" className={styles.link}>
                  ADM
                </Link>
              )}
              <Link to="/meus-pedidos" className={styles.link}>
                Meus Pedidos
              </Link>
              <Link to="/carrinho" className={styles.cartLink}>
                <ShoppingCart size={20} />
                {itens.length > 0 && <span className={styles.badge}>{itens.length}</span>}
              </Link>
              <div className={styles.perfilMenu}>
                <button 
                  className={styles.perfilBtn}
                  onClick={() => setPerfilMenuAberto(!perfilMenuAberto)}
                  title="Menu de perfil"
                >
                  <User size={20} />
                  <span className={styles.username}>{usuario?.nome}</span>
                </button>
                {perfilMenuAberto && (
                  <div className={styles.dropdown}>
                    <Link 
                      to="/perfil" 
                      className={styles.dropdownLink}
                      onClick={() => setPerfilMenuAberto(false)}
                    >
                      <User size={16} /> Editar Perfil
                    </Link>
                    <button 
                      className={styles.dropdownBtn}
                      onClick={() => {
                        handleLogout();
                        setPerfilMenuAberto(false);
                      }}
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                )}
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
