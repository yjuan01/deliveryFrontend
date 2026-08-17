import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/useAuth';
import styles from './AdminPage.module.css';

export const AdminPage = () => {
  const { usuario } = useAuth();
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [searchRestaurant, setSearchRestaurant] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [categoria, setCategoria] = useState('Geral');
  const [emoji, setEmoji] = useState('🍽️');
  const [tempo, setTempo] = useState('30-40 min');
  const [nota, setNota] = useState<number | ''>('');
  const [taxa, setTaxa] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEndereco, setEditEndereco] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editCategoria, setEditCategoria] = useState('Geral');
  const [editEmoji, setEditEmoji] = useState('🍽️');
  const [editTempo, setEditTempo] = useState('30-40 min');
  const [editNota, setEditNota] = useState<number | ''>('');
  const [editTaxa, setEditTaxa] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario || usuario.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const [r, u] = await Promise.all([api.listarRestaurantes(), api.listarUsuarios()]);
        setRestaurantes(r);
        setUsuarios(u);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados');
      }
    };

    void fetchData();
  }, [usuario]);

  const filteredRestaurantes = restaurantes.filter((r) => {
    const q = searchRestaurant.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.nome || '').toLowerCase().includes(q) ||
      (r.endereco || '').toLowerCase().includes(q) ||
      (r.categoria || '').toLowerCase().includes(q)
    );
  });

  const filteredUsuarios = usuarios.filter((u) => {
    const q = searchUser.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.nome || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  if (!usuario) return <div className={styles.container}>Acesse para continuar.</div>;
  if (usuario.role !== 'admin') return <div className={styles.container}>Acesso negado: requer admin.</div>;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: any = { nome, endereco };
      if (descricao) payload.descricao = descricao;
      if (telefone) payload.telefone = telefone;
      if (categoria) payload.categoria = categoria;
      if (emoji) payload.emoji = emoji;
      if (tempo) payload.tempo = tempo;
      if (nota !== '') payload.nota = Number(nota);
      if (taxa !== '') payload.taxa = Number(taxa);

      const novo = await api.criarRestaurante(payload);
      setRestaurantes((prev) => [...prev, novo]);
      setNome('');
      setDescricao('');
      setEndereco('');
      setTelefone('');
      setCategoria('Geral');
      setEmoji('🍽️');
      setTempo('30-40 min');
      setNota('');
      setTaxa('');
    } catch (err) {
      setError('Erro ao criar restaurante');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Confirma exclusão do usuário?')) return;
    try {
      await api.deletarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erro ao deletar usuário');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin</h1>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <h2>Gerenciar Restaurantes</h2>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <input className={styles.search} placeholder="Pesquisar restaurantes" value={searchRestaurant} onChange={(e) => setSearchRestaurant(e.target.value)} />
        </div>
        <form onSubmit={handleCreate} className={styles.form}>
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <input placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
          <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <input placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          <input placeholder="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          <input placeholder="Tempo" value={tempo} onChange={(e) => setTempo(e.target.value)} />
          <input placeholder="Nota" value={nota as any} onChange={(e) => setNota(e.target.value === '' ? '' : Number(e.target.value))} />
          <input placeholder="Taxa" value={taxa as any} onChange={(e) => setTaxa(e.target.value === '' ? '' : Number(e.target.value))} />
          <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar'}</button>
        </form>

        <ul className={styles.list}>
          {filteredRestaurantes.map((r) => (
            <li key={r.id} className={styles.restaurantItem}>
              <div className={styles.restaurantHeader}>
                <div className={styles.restaurantInfo}>
                  <div className={styles.restaurantAvatar}>{r.emoji || '🍽️'}</div>
                  <div>
                    <div className={styles.restaurantName}>{r.nome}</div>
                    <div className={styles.chip}>{r.categoria} • {r.tempo}</div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => {
                    setEditingId(r.id === editingId ? null : r.id);
                    setEditNome(r.nome || '');
                    setEditEndereco(r.endereco || '');
                    setEditDescricao(r.descricao || '');
                    setEditTelefone(r.telefone || '');
                    setEditCategoria(r.categoria || 'Geral');
                    setEditEmoji(r.emoji || '🍽️');
                    setEditTempo(r.tempo || '30-40 min');
                    setEditNota(r.nota ?? '');
                    setEditTaxa(r.taxa ?? '');
                  }}>{editingId === r.id ? 'Fechar' : 'Editar'}</button>
                  <button className={styles.primary} onClick={async () => {
                    if (!confirm('Confirma exclusão do restaurante?')) return;
                    try {
                      await api.deletarRestaurante(r.id);
                      setRestaurantes((prev) => prev.filter((p) => p.id !== r.id));
                    } catch (err) {
                      alert('Erro ao deletar restaurante');
                    }
                  }}>Deletar</button>
                </div>
              </div>

              <div className={`${styles.expandable} ${editingId === r.id ? styles.expanded : ''}` }>
                {editingId === r.id && (
                  <div className={styles.editRow}>
                    <input value={editNome} onChange={(e) => setEditNome(e.target.value)} placeholder="Nome" />
                    <input value={editEndereco} onChange={(e) => setEditEndereco(e.target.value)} placeholder="Endereço" />
                    <input value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} placeholder="Descrição" />
                    <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} placeholder="Telefone" />
                    <input value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} placeholder="Categoria" />
                    <input value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} placeholder="Emoji" />
                    <input value={editTempo} onChange={(e) => setEditTempo(e.target.value)} placeholder="Tempo" />
                    <input value={editNota as any} onChange={(e) => setEditNota(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Nota" />
                    <input value={editTaxa as any} onChange={(e) => setEditTaxa(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Taxa" />
                    <div className={styles.rowActions}>
                      <button onClick={async () => {
                        try {
                          const payload: any = { nome: editNome, endereco: editEndereco };
                          if (editDescricao) payload.descricao = editDescricao;
                          if (editTelefone) payload.telefone = editTelefone;
                          if (editCategoria) payload.categoria = editCategoria;
                          if (editEmoji) payload.emoji = editEmoji;
                          if (editTempo) payload.tempo = editTempo;
                          if (editNota !== '') payload.nota = Number(editNota);
                          if (editTaxa !== '') payload.taxa = Number(editTaxa);

                          const updated = await api.atualizarRestaurante(r.id, payload);
                          setRestaurantes((prev) => prev.map((p) => p.id === r.id ? updated : p));
                          setEditingId(null);
                        } catch (err) {
                          alert('Erro ao salvar alterações');
                        }
                      }}>Salvar</button>
                      <button onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Gerenciar Usuários</h2>
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <input className={styles.search} placeholder="Pesquisar usuários" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
        </div>
        <ul className={styles.list}>
          {filteredUsuarios.map((u) => (
            <li key={u.id} className={styles.userRow}>
              <div>
                <strong>{u.nome}</strong> <small>({u.email})</small>
                <div className={styles.chip}>{u.role}</div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleDeleteUser(u.id)}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
