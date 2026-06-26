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

export default function RestaurantesPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState("Pizza");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect 
      setUser(JSON.parse(savedUser));
    }

    async function fetchRestaurantes() {
      try {
        const response = await fetch(`${apiUrl}/restaurantes`);
        const data = await response.json();
        if (response.ok) {
          setRestaurantes(data);
        }
      } catch {
        setRestaurantes([]);
      }
    }

    fetchRestaurantes();
  }, [apiUrl]);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Faça login para criar um restaurante.");
      return;
    }

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
        setMessage(data?.error ?? "Falha ao criar restaurante.");
        return;
      }

      setRestaurantes((current) => [...current, data]);
      setNome("");
      setEndereco("");
      setTelefone("");
      setCategoria("Pizza");
      setMessage("Restaurante criado com sucesso!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro ao conectar com o backend.",
      );
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
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-950">{message}</div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {restaurantes.map((restaurante) => (
            <article key={restaurante.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
              <h2 className="text-xl font-semibold text-slate-950">{restaurante.nome}</h2>
              <p className="mt-3 text-sm text-slate-600">Categoria: {restaurante.categoria}</p>
              <p className="mt-2 text-sm text-slate-600">Endereço: {restaurante.endereco}</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">Telefone: {restaurante.telefone}</p>
            </article>
          ))}

          {restaurantes.length === 0 ? (
            <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
              Nenhum restaurante encontrado.
            </div>
          ) : null}
        </div>

        <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
          <h2 className="text-2xl font-semibold text-slate-950">Criar restaurante</h2>
          <p className="mt-2 text-sm text-slate-600">Cadastrar restaurante usando o backend.</p>
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nome</label>
              <input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Endereço</label>
              <input
                value={endereco}
                onChange={(event) => setEndereco(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Telefone</label>
              <input
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
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
              className="rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar Restaurante"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
