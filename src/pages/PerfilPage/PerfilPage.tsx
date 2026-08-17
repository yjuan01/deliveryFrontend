import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import api from '../../services/api';
import { Button } from '../../components/Button/Button';
import styles from './PerfilPage.module.css';

export const PerfilPage = () => {
  const navigate = useNavigate();
  const { usuario, logout, logado } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (!logado) {
      navigate('/login');
      return;
    }

    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, [usuario, logado, navigate]);

  const handleAtualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      setErro('Email é obrigatório');
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const payload: any = { nome, email };
      if (novaSenha) {
        payload.senha = novaSenha;
      }

      await api.atualizarUsuario(usuario!.id, payload);
      setSucesso('Perfil atualizado com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setErro(`Erro: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/');
    }
  };

  if (!usuario) {
    return <div className={styles.container}>Acesse para continuar.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Meu Perfil</h1>
        
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
          <div className={styles.info}>
            <h2>{usuario.nome}</h2>
            <p className={styles.email}>{usuario.email}</p>
            <p className={styles.role}>
              {usuario.role === 'admin' ? '🔧 Administrador' : '👤 Cliente'}
            </p>
          </div>
        </div>

        {erro && <div className={styles.alert + ' ' + styles.error}>{erro}</div>}
        {sucesso && <div className={styles.alert + ' ' + styles.success}>{sucesso}</div>}

        <form onSubmit={handleAtualizarPerfil} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className={styles.divider}>Alterar Senha</div>

          <div className={styles.formGroup}>
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite uma nova senha (deixe em branco para não alterar)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </div>

          <div className={styles.actions}>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Voltar
            </Button>
          </div>
        </form>

        <div className={styles.danger}>
          <Button 
            type="button"
            onClick={handleLogout}
          >
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
