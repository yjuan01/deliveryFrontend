"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  nome: string;
  email: string;
};

export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  async function authenticate(emailValue: string, passwordValue: string) {
    const response = await fetch(`${apiUrl}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        senha: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data?.error ?? "Não foi possível fazer login.");
      return null;
    }

    const authToken = data?.token;
    const authUser = data?.usuario;

    if (!authToken || !authUser) {
      setMessage("Resposta inválida do servidor.");
      return null;
    }

    localStorage.setItem("delivery-api-token", authToken);
    localStorage.setItem("delivery-user", JSON.stringify(authUser));

    return authUser as User;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const authUser = await authenticate(email, password);
      if (authUser) {
        router.push("/menu");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/usuarios/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error ?? "Não foi possível registrar usuário.");
        return;
      }

      const authUser = await authenticate(email, password);
      if (authUser) {
        router.push("/menu");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
                Autenticação
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">
                {isRegister ? "Registrar usuário" : "Entrar na sua conta"}
              </h1>
              <p className="mt-2 text-slate-600">
                Use o backend conectado para fazer login, acessar o cardápio e criar restaurantes.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900"
            >
              Página inicial
            </Link>
          </div>

          {user ? (
            <div className="space-y-6">
              <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Conta ativa</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Olá, {user.nome}</h2>
                <p className="mt-2 text-slate-600">Você já está logado. Use o botão abaixo para sair da conta.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Sair da conta
                  </button>
                  <Link
                    href="/menu"
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900"
                  >
                    Ir para o menu
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <span>{isRegister ? "Já tem conta?" : "Ainda não tem conta?"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setMessage("");
                  }}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  {isRegister ? "Ir para login" : "Registrar"}
                </button>
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5">
                {isRegister ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Nome</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Aguarde..." : isRegister ? "Registrar" : "Entrar"}
                </button>
              </form>

              {message ? (
                <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p>
              ) : null}
            </div>)}
        </div>
      </div>
    </div>
  );
}
