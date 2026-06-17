# 🍕 FoodDelivery - Frontend

Frontend moderno e responsivo para a aplicação de delivery de comida, desenvolvido em React + TypeScript + Vite.

## 📋 Funcionalidades

- ✅ Autenticação (Login e Registro)
- 🏪 Listagem de Restaurantes
- 🍕 Menu de produtos por restaurante
- 🛒 Carrinho de compras
- 📦 Sistema de pedidos
- 👤 Perfil de usuário
- 📱 Design responsivo

## 🚀 Como Começar

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Backend rodando em http://localhost:3000

### Instalação

1. Clonar o repositório
```bash
git clone <repositorio>
cd meu-frontend
```

2. Instalar dependências
```bash
npm install
```

3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

4. Executar em desenvolvimento
```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   └── Header/
├── contexts/           # Context API (Auth, Carrinho)
├── pages/              # Páginas da aplicação
│   ├── HomePage/
│   ├── LoginPage/
│   ├── RegistroPage/
│   ├── RestaurantePage/
│   ├── CarrinhoPage/
│   └── MeusPedidosPage/
├── services/           # Serviços HTTP (API)
├── types/              # Tipos TypeScript
├── App.tsx             # Componente raiz
├── App.css             # Estilos globais
├── main.tsx            # Entry point
└── routes.tsx          # Configuração de rotas
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🎨 Design

- **Cores principais**: 
  - Laranja: `#ff6b35`
  - Cinza: `#333`, `#666`, `#999`
  - Vermelho: `#ef4444`

- **Tipografia**: System fonts com fallback
- **Responsividade**: Mobile-first design

## 📡 API

O frontend comunica com o backend através de endpoints REST:

### Autenticação
- `POST /usuarios/login` - Login
- `POST /usuarios/registrar` - Registro
- `GET /usuarios/perfil` - Obter perfil

### Restaurantes
- `GET /restaurantes` - Listar todos
- `GET /restaurantes/:id` - Detalhes

### Produtos
- `GET /produtos/restaurante/:restauranteId` - Listar por restaurante

### Pedidos
- `GET /pedidos/meus` - Meus pedidos
- `POST /pedidos` - Criar pedido
- `PATCH /pedidos/:id/status` - Atualizar status

## 🔐 Autenticação

O token JWT é armazenado no localStorage e automaticamente incluído em todas as requisições através do interceptor Axios.

## 📱 Responsividade

O projeto é 100% responsivo e funciona bem em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (até 767px)

## 🐛 Troubleshooting

**Erro de conexão com API:**
- Verifique se o backend está rodando em `http://localhost:3000`
- Edite a variável `VITE_API_URL` no arquivo `.env`

**Erro 401 (Não autorizado):**
- Faça login novamente
- Verifique se o token está sendo enviado corretamente

**CORS Error:**
- Verifique a configuração de CORS no backend

## 📦 Dependências Principais

- **React**: Interface
- **React Router**: Roteamento
- **TypeScript**: Type safety
- **Axios**: HTTP client
- **Lucide React**: Ícones
- **Vite**: Build tool

## 🚀 Deploy

Para fazer deploy:

```bash
# Build
npm run build

# Fazer upload da pasta dist para um servidor
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## 💡 Dicas de Desenvolvimento

- Use o React DevTools para debugar componentes
- Use o Redux DevTools se precisar gerenciar estado mais complexo
- Mantenha os componentes pequenos e reutilizáveis
- Use TypeScript para type safety

## 📚 Recursos

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## 📄 Licença

ISC

## 👨‍💼 Autor

Desenvolvido para o Projeto TCC de Delivery
