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
    // 👇 antes ia para "/", agora volta para o próprio cardápio (/menu)
    router.push("/menu");
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
      setToast(`${productName} adicionado à sacola`);
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
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a]">
      {/* Header fixo estilo iFood */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/restaurantes"
              aria-label="Voltar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#1a1a1a] transition hover:bg-slate-100"
            >
              ←
            </Link>
            <h1 className="text-lg font-bold text-[#1a1a1a]">Cardápio</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] transition hover:border-[#EA1D2C] hover:text-[#EA1D2C]"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] transition hover:border-[#EA1D2C] hover:text-[#EA1D2C]"
              >
                Entrar
              </Link>
            )}
            <Link
              href="/carrinho"
              className="hidden items-center gap-1.5 rounded-full bg-[#EA1D2C] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#C41625] sm:inline-flex"
            >
              🛍️ Sacola ({totalItems})
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:pb-10">
        {!user && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-[#8a1119]">
            Você pode montar sua sacola agora e fazer login na hora de finalizar o pedido.
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition focus:border-[#EA1D2C] focus:ring-2 focus:ring-red-100"
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
                    ? "bg-[#EA1D2C] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#EA1D2C] hover:text-[#1a1a1a]"
                }`}
              >
                {category !== "Todos" && categoryIcon[category] ? `${categoryIcon[category]} ` : ""}
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500">
            <span className="text-5xl">🔎</span>
            <p className="mt-4 text-base font-bold text-[#1a1a1a]">Nenhum item encontrado</p>
            <p className="mt-2 text-sm text-slate-500">Tente buscar por outro termo ou escolha outra categoria.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product) => {
              const quantity = cart[product.id] ?? 0;
              return (
                <article
                  key={product.id}
                  className={`flex gap-4 rounded-lg border bg-white p-4 transition ${
                    quantity > 0 ? "border-[#EA1D2C]" : "border-slate-200"
                  }`}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-2xl">
                    {categoryIcon[product.category] ?? "🍽️"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#EA1D2C]">{product.category}</p>
                        <h3 className="mt-0.5 text-sm font-bold leading-snug text-[#1a1a1a]">{product.name}</h3>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#1a1a1a]">{formatPrice(product.price)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.description}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {quantity === 0 ? (
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1, product.name)}
                          className="shrink-0 rounded-full border border-[#EA1D2C] px-4 py-1.5 text-xs font-bold text-[#EA1D2C] transition hover:bg-red-50"
                        >
                          Adicionar
                        </button>
                      ) : (
                        <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            aria-label="Diminuir quantidade"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-[#EA1D2C] transition hover:bg-red-50"
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center text-sm font-bold text-[#1a1a1a]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1, product.name)}
                            aria-label="Aumentar quantidade"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-[#EA1D2C] transition hover:bg-red-50"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg sm:bottom-6">
          ✓ {toast}
        </div>
      )}

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-4 sm:hidden">
          <Link
            href="/carrinho"
            className="flex w-full items-center justify-between rounded-full bg-[#EA1D2C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C41625]"
          >
            <span>Ver sacola ({totalItems})</span>
            <span>{formatPrice(cartTotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
