"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  { id: "pizza-mussarela", name: "Pizza Mussarela", description: "Molho de tomate, mussarela, orégano e borda crocante.", price: 45.9, category: "Pizza", tags: ["Clássica", "Queijo"] },
  { id: "pizza-portuguesa", name: "Pizza Portuguesa", description: "Presunto, ovos, cebola, azeitona e muito sabor.", price: 54.5, category: "Pizza", tags: ["Saborosa", "Tradicional"] },
  { id: "hamburguer-classico", name: "Hambúrguer Clássico", description: "Pão brioche, carne suculenta, queijo cheddar e molho especial.", price: 29.9, category: "Hambúrguer", tags: ["Cheddar", "Molho Especial"] },
  { id: "acai-tradicional", name: "Açaí Tradicional", description: "Açaí 500ml com banana, granola e mel.", price: 23.5, category: "Açaí", tags: ["Frio", "Energia"] },
];

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
  const [hydrated, setHydrated] = useState(false); // [DEBUG]

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  // Carrega user + cart do localStorage UMA vez ao montar
  useEffect(() => {
    console.log("[MENU] montou, lendo localStorage..."); // [DEBUG]
    const savedUser = localStorage.getItem("delivery-user");
    const savedCart = localStorage.getItem("delivery-cart");
    console.log("[MENU] delivery-cart bruto:", savedCart); // [DEBUG]

    if (savedUser) {
      try {
        //eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch {
      }
    }

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log("[MENU] cart parseado:", parsed); // [DEBUG]
        setCart(parsed);
      } catch (err) {
        console.error("[MENU] erro ao parsear cart salvo:", err); // [DEBUG]
        setCart({});
      }
    }

    setHydrated(true); // [DEBUG] só depois de carregar é que liberamos o save
  }, []);

  // Salva o cart no localStorage sempre que ele muda — MAS só depois de já ter hidratado
  useEffect(() => {
    if (!hydrated) { // [DEBUG] evita sobrescrever com {} antes de carregar o valor salvo
      console.log("[MENU] ainda não hidratou, ignorando save"); // [DEBUG]
      return;
    }
    console.log("[MENU] salvando cart:", cart); // [DEBUG]
    localStorage.setItem("delivery-cart", JSON.stringify(cart));
    console.log("[MENU] confirmando o que ficou salvo:", localStorage.getItem("delivery-cart")); // [DEBUG]
  }, [cart, hydrated]);

  function updateQuantity(productId: string, delta: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + delta;
      console.log("[MENU] updateQuantity", { productId, delta, current, nextQuantity }); // [DEBUG]
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: nextQuantity };
    });
  }

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
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
            <Link href="/carrinho" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
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

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => {
            const quantity = cart[product.id] ?? 0;
            return (
              <article key={product.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">{product.category}</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
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
                      onClick={() => updateQuantity(product.id, 1)}
                      className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Adicionar
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, -1)}
                        className="rounded-full bg-slate-200 px-3 py-0.5 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-slate-950">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
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
      </div>
    </div>
  );
}
