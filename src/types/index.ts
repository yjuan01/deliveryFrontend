// Usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'cliente' | 'admin';
  criadoEm: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

// Restaurante
export interface Restaurante {
  id: number;
  nome: string;
  descricao?: string;
  endereco: string;
  telefone?: string;
  criadoEm: string;
}

// Produto
export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  disponivel: boolean;
  restauranteId: number;
  criadoEm: string;
}

// Pedido
export interface Pedido {
  id: number;
  status: 'pendente' | 'confirmado' | 'em_preparo' | 'saiu_entrega' | 'entregue' | 'cancelado';
  total: number;
  observacao?: string;
  criadoEm: string;
  atualizadoEm: string;
  usuarioId: number;
  restauranteId: number;
  itens: ItemPedido[];
}

// Item do Pedido
export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUni: number;
  pedidoId: number;
  produtoId: number;
}

// Carrinho
export interface CarrinhoItem {
  produtoId: number;
  produto: Produto;
  quantidade: number;
}

export interface CarrinhoContext {
  itens: CarrinhoItem[];
  restauranteId: number | null;
  adicionarItem: (produto: Produto, restauranteId: number, quantidade: number) => void;
  removerItem: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  obterTotal: () => number;
}

// Contexto de autenticação
export interface AuthContext {
  usuario: Usuario | null;
  token: string | null;
  logado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  carregando: boolean;
  erro: string | null;
}
