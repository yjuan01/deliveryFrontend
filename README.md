# 1. Documentação Geral do Projeto

Arquivo principal (README.md) contendo:

## Introdução

- Nome do projeto;
- Problema que resolve;
- Objetivo;
- Público-alvo.
# Frontend — Delivery

Este repositório contém o frontend da aplicação Delivery (React + Vite + TypeScript).

Resumo: interface web para clientes (navegar por restaurantes, adicionar ao carrinho, realizar pedidos) e painel administrativo para gerenciar restaurantes e usuários.

## 1. Introdução

- Nome do projeto: Delivery (Frontend)
- Problema: fornecer uma interface amigável para realizar pedidos e gerenciar restaurantes.
- Objetivo: criar uma experiência simples e responsiva semelhante a apps de delivery.
- Público-alvo: clientes, administradores e avaliadores.

## 2. Tecnologias

- TypeScript, React, Vite
- react-router-dom, axios
- CSS Modules (styles por componente)
- Context API para `Auth` e `Carrinho`

## 3. Estrutura do projeto

- `src/pages/` — telas principais (Home, Login, Registro, Restaurante, Carrinho, MeusPedidos, Admin)
- `src/components/` — componentes reutilizáveis (Header, Card, Button, AdminRoute)
- `src/contexts/` — `AuthContext`, `CarrinhoContext`
- `src/services/api.ts` — cliente HTTP central (usa `VITE_API_URL`)
- `src/types` — tipos TypeScript

## 4. Rotas e telas

- `/` — HomePage (lista restaurantes)
- `/login` — LoginPage
- `/registrar` — RegistroPage
- `/restaurante/:id` — RestaurantePage (produtos, adicionar ao carrinho)
- `/carrinho` — CarrinhoPage
- `/meus-pedidos` — MeusPedidosPage
- `/admin` — AdminPage (apenas `role: admin`)

## 5. Integração com a API

Configure `VITE_API_URL` apontando para o backend. Endpoints usados:

- `POST /usuarios/login` — login
- `POST /usuarios/registrar` — registrar usuário
- `GET /usuarios/perfil` — obter perfil (autenticado)
- `GET /restaurantes` — listar restaurantes
- `GET /restaurantes/:id` — obter restaurante
- `POST|PUT|DELETE /restaurantes` — criar/atualizar/deletar (admin)
- `GET /produtos/restaurante/:restauranteId` — listar produtos
- `POST /pedidos` — criar pedido

Observação: o token é salvo em `localStorage` e enviado automaticamente pelo `api.ts`.

## 6. Como executar (desenvolvimento)

1. Instale dependências:

```bash
cd deliveryFrontend
npm install
```

2. Variáveis de ambiente (opcional):

Crie um arquivo `.env` na pasta `deliveryFrontend` com:

```
VITE_API_URL=http://localhost:3001
```

3. Rodar em modo de desenvolvimento:

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
npm run preview
```

## 7. Admin

- Usuário admin de exemplo (seed do backend): `admin@delivery.com` / `admin123`.
- Acessar `/admin` após login exibe painel com busca, edição completa de restaurantes e gerenciamento de usuários.

## 8. Estilização e UX

- Os estilos usam CSS Modules. O `AdminPage` já contém melhorias visuais (cartões, gradiente, animações de expansão) inspiradas em UIs modernas.

## 9. Dicas para desenvolvimento

- Ao alterar tipos ou schema do backend, atualize `src/types` e `api.ts`.
- Para depurar requests, abra DevTools → Network.

## 10. Contribuição

- Use branches por feature e abra PRs com descrição dos testes.

---

Se quiser, posso:
- rodar o frontend agora (`npm run dev`),
- adicionar instruções de deploy (Vercel/Netlify),
- ou gerar imagens/diagramas para a seção de arquitetura.

Diga qual opção prefere.

A documentação do sistema IoT deve conter:

## Hardware Utilizado

Lista de componentes:

- Microcontrolador;
- Sensores;
- Atuadores;
- Módulos.

## Esquemático

- Ligações;
- Circuitos;
- Diagramas elétricos.

## Fluxo de Funcionamento

Descrever:

- Entrada de dados;
- Processamento;
- Ações executadas.

## Código Embarcado

Explicar:

- Estrutura do firmware;
- Bibliotecas utilizadas;
- Funções principais.

---

# Entregáveis

O grupo deverá entregar:

- Código-fontes completo;
- Repositórios organizados;
- Documentação;
- Apresentação;
- Vídeo com demonstração funcional do sistema.

---

# Critérios de Avaliação

## Desenvolvimento Técnico

- Qualidade do código;
- Arquitetura;
- Integração entre sistemas;
- Funcionamento.

## Organização

- Estrutura do projeto;
- Clareza.

## Documentação

- Qualidade técnica;
- Clareza;
- Completude;
- Diagramas;
- Explicações.

## Apresentação

- Demonstração;
- Domínio técnico;
- Explicação da solução.

---

# Observações

Este README é um template inicial. Ajuste e complete cada seção com informações específicas do projeto (nomes, rotas, exemplos de request/response, diagramas, etc.).
