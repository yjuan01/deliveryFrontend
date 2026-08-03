"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  nome: string;
  email: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se já existir um usuário salvo, manda para /menu.
  // NUNCA deve mandar para /carrinho.
  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    if (savedUser) {
      try {
        JSON.parse(savedUser);
        router.replace("/menu");
      } catch {
        localStorage.removeItem("delivery-user");
      }
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !senha.trim()) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      // Ajuste esta chamada para o endpoint real do seu backend.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const user: User = data.user;
      const token: string = data.token;

      localStorage.setItem("delivery-user", JSON.stringify(user));
      localStorage.setItem("delivery-api-token", token);

      // 👇 Login concluído: vai para o cardápio, nunca para o carrinho.
      router.push("/menu");
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 text-[#1a1a1a]">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/menu"
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#1a1a1a] transition hover:bg-slate-100"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-[#1a1a1a]">Entrar</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-[#8a1119]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#1a1a1a]">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="email"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition focus:border-[#EA1D2C] focus:ring-2 focus:ring-red-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#1a1a1a]">
            Senha
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-16 text-sm text-[#1a1a1a] outline-none transition focus:border-[#EA1D2C] focus:ring-2 focus:ring-red-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#EA1D2C]"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[#EA1D2C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C41625] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-[#EA1D2C] hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
