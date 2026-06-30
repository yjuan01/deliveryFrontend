"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  nome: string;
  email: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
};

const products: Product[] = [
  { id: "pizza-mussarela", name: "Pizza quatro queijos", description: "Molho de tomate, mussarela, provolone, parmesão e gorgonzola, com orégano e borda crocante.", price: 45.9, category: "Pizza", tags: ["Clássica", "Queijo"] },
  { id: "pizza-portuguesa", name: "Pizza Portuguesa", description: "Presunto, ovos, cebola, azeitona e muito sabor.", price: 54.5, category: "Pizza", tags: ["Saborosa", "Tradicional"] },
  { id: "hamburguer-classico", name: "Hambúrguer Clássico", description: "Pão brioche, carne suculenta, queijo cheddar e molho especial.", price: 29.9, category: "Hambúrguer", tags: ["Cheddar", "Molho Especial"] },
  { id: "acai-tradicional", name: "Açaí Tradicional", description: "Açaí 500ml com banana, granola e mel.", price: 23.5, category: "Açaí", tags: ["Frio", "Energia"] },
];

const categoryIcon: Record<string, string> = {
  Pizza: "🍕",
  Hambúrguer: "🍔",
  Açaí: "🍇",
};

const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPrice(value: number) {
  return currency.format(value);
}

export default function MenuPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [toast, setToast] = useState<string | null>(null);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    const savedCart = localStorage.getItem("delivery-cart");

    if (savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("delivery-user");
      }
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart({});
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("delivery-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateQuantity(productId: string, delta: number, productName?: string) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: nextQuantity };
    });
    if (delta > 0 && productName) {
      setToast(`${productName} adicionado ao carrinho`);
    }
  }

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10 pb-28 sm:pb-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Menu</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950">Cardápio</h1>
            <p className="mt-3 text-slate-600">Escolha produtos e adicione ao carrinho.</p>
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
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">
                Login
              </Link>
            )}
            <Link href="/carrinho" className="hidden rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-block">
              Carrinho ({totalItems})
            </Link>
            <Link href="/restaurantes" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">
              Restaurantes
            </Link>
          </div>
        </div>

        {!user && (
          <div className="mb-6 rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
            Você pode montar seu carrinho agora e fazer login na hora de finalizar o pedido.
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-orange-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-slate-900"
                }`}
              >
                {category !== "Todos" && categoryIcon[category] ? `${categoryIcon[category]} ` : ""}
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-14 text-center text-slate-500">
            <span className="text-5xl">🔎</span>
            <p className="mt-4 text-lg font-semibold text-slate-700">Nenhum item encontrado</p>
            <p className="mt-2 text-sm text-slate-500">Tente buscar por outro termo ou escolha outra categoria.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProducts.map((product) => {
              const quantity = cart[product.id] ?? 0;
              return (
                <article
                  key={product.id}
                  className={`rounded-[28px] border bg-white p-6 shadow-sm transition ${
                    quantity > 0
                      ? "border-orange-300 shadow-orange-100"
                      : "border-slate-200 shadow-slate-200/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                        {categoryIcon[product.category] ?? "🍽️"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">{product.category}</p>
                        <h3 className="mt-1 text-xl font-semibold text-slate-950">{product.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-slate-950">{formatPrice(product.price)}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {quantity === 0 ? (
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1, product.name)}
                        className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Adicionar
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          aria-label="Diminuir quantidade"
                          className="rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-slate-950">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1, product.name)}
                          aria-label="Aumentar quantidade"
                          className="rounded-full bg-orange-500 px-3 py-0.5 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg sm:bottom-6">
          ✓ {toast}
        </div>
      )}

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:hidden">
          <Link
            href="/carrinho"
            className="flex w-full items-center justify-between rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <span>Ver carrinho ({totalItems})</span>
            <span>{formatPrice(cartTotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
