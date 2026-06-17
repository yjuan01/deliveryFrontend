import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import styles from './RegistroPage.module.css';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || error === null) {
    return fallback;
  }

  return (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback;
};

export const RegistroPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);

    try {
      await registrar(nome, email, senha);
      navigate('/');
    } catch (error: unknown) {
      setErro(getErrorMessage(error, 'Erro ao registrar'));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Registrar</h1>

        {erro && <div className={styles.alert}>{erro}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nome"
            placeholder="seu nome"
            value={nome}
            onChange={setNome}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={setEmail}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="sua senha"
            value={senha}
            onChange={setSenha}
            required
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="confirme sua senha"
            value={confirmarSenha}
            onChange={setConfirmarSenha}
            required
          />

          <Button type="submit" fullWidth disabled={carregando}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>

        <p className={styles.footer}>
          Já tem conta? <Link to="/login">Entre aqui</Link>
        </p>
      </Card>
    </div>
  );
};
