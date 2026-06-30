"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Restaurante = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  categoria: string;
};

type User = {
  id: string;
  nome: string;
  email: string;
};

const categoryIcon: Record<string, string> = {
  Pizza: "🍕",
  Hambúrguer: "🍔",
  Açaí: "🍇",
  Bebidas: "🥤",
};

export default function RestaurantesPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState("Pizza");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(false);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  async function fetchRestaurantes() {
    setLoadingList(true);
    setListError(false);
    try {
      const response = await fetch(`${apiUrl}/restaurantes`);
      const data = await response.json();
      if (response.ok) {
        setRestaurantes(data);
      } else {
        setListError(true);
      }
    } catch {
      setListError(true);
    } finally {
      setLoadingList(false);
    }
  }

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

    fetchRestaurantes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (nome.trim().length < 2) errors.nome = "Informe o nome do restaurante.";
    if (endereco.trim().length < 5) errors.endereco = "Informe um endereço válido.";
    if (telefone.trim().length < 8) errors.telefone = "Informe um telefone válido.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!user) {
      setMessage({ type: "error", text: "Faça login para criar um restaurante." });
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/restaurantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, endereco, telefone, categoria }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: "error", text: data?.error ?? "Falha ao criar restaurante." });
        return;
      }

      setRestaurantes((current) => [...current, data]);
      setHighlightId(data.id);
      window.setTimeout(() => setHighlightId(null), 2000);
      setNome("");
      setEndereco("");
      setTelefone("");
      setCategoria("Pizza");
      setFieldErrors({});
      setMessage({ type: "success", text: "Restaurante criado com sucesso!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao conectar com o backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Restaurantes</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950">Restaurantes conectados</h1>
            <p className="mt-3 text-slate-600">Lista de restaurantes retornada pelo backend.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
              >
                Sair
              </button>
            ) : (
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Login</Link>
            )}
            <Link href="/menu" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">Menu</Link>
            <Link href="/carrinho" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Carrinho</Link>
          </div>
        </div>

        {message ? (
          <div
            className={`mb-6 flex items-center gap-2 rounded-3xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <span>{message.type === "success" ? "✓" : "⚠️"}</span>
            {message.text}
          </div>
        ) : null}

        {loadingList ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="h-36 animate-pulse rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40"
              >
                <div className="h-5 w-2/3 rounded-full bg-slate-100" />
                <div className="mt-4 h-3 w-1/2 rounded-full bg-slate-100" />
                <div className="mt-3 h-3 w-3/4 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : listError ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-rose-200 bg-rose-50/60 p-10 text-center text-rose-700">
            <span className="text-4xl">⚠️</span>
            <p className="mt-3 font-semibold">Não foi possível carregar os restaurantes</p>
            <p className="mt-1 text-sm text-rose-600">Verifique se o backend está rodando em {apiUrl}.</p>
            <button
              type="button"
              onClick={fetchRestaurantes}
              className="mt-5 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {restaurantes.map((restaurante) => (
              <article
                key={restaurante.id}
                className={`rounded-[28px] border bg-white p-6 shadow-sm transition-all duration-500 ${
                  highlightId === restaurante.id
                    ? "border-emerald-300 shadow-emerald-100 ring-2 ring-emerald-200"
                    : "border-slate-200 shadow-slate-200/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                    {categoryIcon[restaurante.categoria] ?? "🍽️"}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{restaurante.nome}</h2>
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {restaurante.categoria}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><span>📍</span>{restaurante.endereco}</p>
                  <p className="flex items-center gap-2 font-semibold text-slate-700"><span>📞</span>{restaurante.telefone}</p>
                </div>
              </article>
            ))}

            {restaurantes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
                <span className="text-4xl">🏪</span>
                <p className="mt-3 font-semibold text-slate-700">Nenhum restaurante encontrado</p>
                <p className="mt-1 text-sm">Cadastre o primeiro restaurante usando o formulário abaixo.</p>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-10 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
          <h2 className="text-2xl font-semibold text-slate-950">Criar restaurante</h2>
          <p className="mt-2 text-sm text-slate-600">Crie um novo restaurante para adicionar ao nosso catálogo.</p>

          {!user && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-800">
              <span>🔒</span> Faça <Link href="/login" className="font-semibold underline">login</Link> para poder cadastrar um restaurante.
            </div>
          )}

          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nome</label>
              <input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex: Pizzaria do Bairro"
                className={`mt-2 w-full rounded-3xl border bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                  fieldErrors.nome
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                }`}
              />
              {fieldErrors.nome && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Endereço</label>
              <input
                value={endereco}
                onChange={(event) => setEndereco(event.target.value)}
                placeholder="Rua, número, bairro"
                className={`mt-2 w-full rounded-3xl border bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                  fieldErrors.endereco
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                }`}
              />
              {fieldErrors.endereco && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.endereco}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Telefone</label>
              <input
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                placeholder="(00) 00000-0000"
                className={`mt-2 w-full rounded-3xl border bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 ${
                  fieldErrors.telefone
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-orange-400 focus:ring-orange-200"
                }`}
              />
              {fieldErrors.telefone && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.telefone}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Categoria</label>
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              >
                <option>Pizza</option>
                <option>Hambúrguer</option>
                <option>Açaí</option>
                <option>Bebidas</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? "Criando..." : "Criar restaurante"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
