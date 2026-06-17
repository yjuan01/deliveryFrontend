import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { Header } from './components/Header/Header';
import { routes } from './routes';
import './App.css';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <Header />
          <main className="main">
            <AppRoutes />
          </main>
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}