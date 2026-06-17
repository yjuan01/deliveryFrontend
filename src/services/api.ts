import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { 
  Usuario, 
  LoginRequest, 
  RegistroRequest, 
  Restaurante, 
  Produto, 
  Pedido
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Adiciona token ao header se existir
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ─── AUTENTICAÇÃO ────────────────────────────────────────────────────────
  async login(request: LoginRequest): Promise<{ token: string; usuario: Usuario }> {
    const { data } = await this.api.post('/usuarios/login', request);
    return data;
  }

  async registrar(request: RegistroRequest): Promise<{ token: string; usuario: Usuario }> {
    const { data } = await this.api.post('/usuarios/registrar', request);
    return data;
  }

  async obterPerfil(): Promise<Usuario> {
    const { data } = await this.api.get('/usuarios/perfil');
    return data;
  }

  // ─── RESTAURANTES ────────────────────────────────────────────────────────
  async listarRestaurantes(): Promise<Restaurante[]> {
    const { data } = await this.api.get('/restaurantes');
    return data;
  }

  async obterRestaurante(id: number): Promise<Restaurante> {
    const { data } = await this.api.get(`/restaurantes/${id}`);
    return data;
  }

  async criarRestaurante(restaurante: Omit<Restaurante, 'id' | 'criadoEm'>): Promise<Restaurante> {
    const { data } = await this.api.post('/restaurantes', restaurante);
    return data;
  }

  async atualizarRestaurante(id: number, restaurante: Partial<Restaurante>): Promise<Restaurante> {
    const { data } = await this.api.put(`/restaurantes/${id}`, restaurante);
    return data;
  }

  async deletarRestaurante(id: number): Promise<void> {
    await this.api.delete(`/restaurantes/${id}`);
  }

  // ─── PRODUTOS ────────────────────────────────────────────────────────────
  async listarProdutosPorRestaurante(restauranteId: number): Promise<Produto[]> {
    const { data } = await this.api.get(`/produtos/restaurante/${restauranteId}`);
    return data;
  }

  async obterProduto(id: number): Promise<Produto> {
    const { data } = await this.api.get(`/produtos/${id}`);
    return data;
  }

  async criarProduto(produto: Omit<Produto, 'id' | 'criadoEm'>): Promise<Produto> {
    const { data } = await this.api.post('/produtos', produto);
    return data;
  }

  async atualizarProduto(id: number, produto: Partial<Produto>): Promise<Produto> {
    const { data } = await this.api.put(`/produtos/${id}`, produto);
    return data;
  }

  async deletarProduto(id: number): Promise<void> {
    await this.api.delete(`/produtos/${id}`);
  }

  // ─── PEDIDOS ──────────────────────────────────────────────────────────────
  async listarPedidos(): Promise<Pedido[]> {
    const { data } = await this.api.get('/pedidos');
    return data;
  }

  async listarMeusPedidos(): Promise<Pedido[]> {
    const { data } = await this.api.get('/pedidos/meus');
    return data;
  }

  async obterPedido(id: number): Promise<Pedido> {
    const { data } = await this.api.get(`/pedidos/${id}`);
    return data;
  }

  async criarPedido(pedido: {
    restauranteId: number;
    observacao?: string;
    itens: Array<{ produtoId: number; quantidade: number; precoUni: number }>;
  }): Promise<Pedido> {
    const { data } = await this.api.post('/pedidos', pedido);
    return data;
  }

  async atualizarStatusPedido(
    id: number, 
    status: 'pendente' | 'confirmado' | 'em_preparo' | 'saiu_entrega' | 'entregue' | 'cancelado'
  ): Promise<Pedido> {
    const { data } = await this.api.patch(`/pedidos/${id}/status`, { status });
    return data;
  }

  async deletarPedido(id: number): Promise<void> {
    await this.api.delete(`/pedidos/${id}`);
  }
}

export default new ApiService();
