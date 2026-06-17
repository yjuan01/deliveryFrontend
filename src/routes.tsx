import { Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegistroPage } from './pages/RegistroPage/RegistroPage';
import { RestaurantePage } from './pages/RestaurantePage/RestaurantePage';
import { CarrinhoPage } from './pages/CarrinhoPage/CarrinhoPage';
import { MeusPedidosPage } from './pages/MeusPedidosPage/MeusPedidosPage';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/registrar',
    element: <RegistroPage />,
  },
  {
    path: '/restaurante/:id',
    element: <RestaurantePage />,
  },
  {
    path: '/carrinho',
    element: <CarrinhoPage />,
  },
  {
    path: '/meus-pedidos',
    element: <MeusPedidosPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
