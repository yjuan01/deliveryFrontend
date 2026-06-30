"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  nome: string;
  email: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    if (savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("delivery-user");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (isRegister && name.trim().length < 2) {
      errors.name = "Informe seu nome completo.";
    }
    if (!isValidEmail(email)) {
      errors.email = "Informe um email válido.";
    }
    if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
    if (!validate()) return;
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
    if (!validate()) return;
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

  function switchMode(toRegister: boolean) {
    setIsRegister(toRegister);
    setMessage("");
    setFieldErrors({});
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
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Conta ativa</p>
                    <h2 className="text-2xl font-semibold text-slate-950">Olá, {user.nome}</h2>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">{user.email}</p>
                <p className="mt-1 text-slate-500">Você já está logado.</p>
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
                  <Link
                    href="/carrinho"
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900"
                  >
                    Ver carrinho
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={`flex-1 rounded-full px-4 py-2 transition ${
                    !isRegister ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={`flex-1 rounded-full px-4 py-2 transition ${
                    isRegister ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Registrar
                </button>
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5" noValidate>
                {isRegister ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Nome</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome completo"
                      className={`mt-2 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                        fieldErrors.name
                          ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                          : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.name}</p>
                    )}
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@email.com"
                    className={`mt-2 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                      fieldErrors.email
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                        : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">Senha</label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••"
                      className={`w-full rounded-3xl border bg-white px-4 py-3 pr-12 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                        fieldErrors.password
                          ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                          : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {loading ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500">
                {isRegister ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(!isRegister)}
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  {isRegister ? "Entrar" : "Registrar"}
                </button>
              </p>

              {message ? (
                <p className="flex items-center gap-2 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <span>⚠️</span> {message}
                </p>
              ) : null}
            </div>)}
        </div>
      </div>
    </div>
  );
}
