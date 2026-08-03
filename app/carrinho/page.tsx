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

// Mesma lista de produtos usada em /menu, para conseguir montar o resumo do carrinho.
const products: Product[] = [
  { id: "pizza-mussarela", name: "Pizza quatro queijos", description: "Molho de tomate, mussarela, provolone, parmesão e gorgonzola, com orégano e borda crocante.", price: 45.9, category: "Pizza", tags: ["Clássica", "Queijo"] },
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

export default function CarrinhoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  // Só carrega os dados. NÃO redireciona para /login sozinho.
  useEffect(() => {
    const savedUser = localStorage.getItem("delivery-user");
    const savedCart = localStorage.getItem("delivery-cart");

    if (savedUser) {
      try {
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

  function updateQuantity(productId: string, delta: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: nextQuantity };
    });
  }

  function removeItem(productId: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  const items = useMemo(() => {
    return products
      .map((product) => ({ product, quantity: cart[product.id] ?? 0 }))
      .filter((item) => item.quantity > 0);
  }, [cart]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function handleFinalizarPedido() {
    // Só aqui exigimos login — e ainda assim mandamos para /login,
    // que depois de autenticar volta para /menu (o carrinho continua salvo).
    if (!user) {
      router.push("/login");
      return;
    }
    // Ajuste para sua rota real de checkout/finalização.
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/menu"
            aria-label="Voltar para o cardápio"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#1a1a1a] transition hover:bg-slate-100"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-[#1a1a1a]">Sua sacola</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 pb-32 sm:px-6">
        {!hydrated ? null : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500">
            <span className="text-5xl">🛍️</span>
            <p className="mt-4 text-base font-bold text-[#1a1a1a]">Sua sacola está vazia</p>
            <p className="mt-2 text-sm text-slate-500">Adicione itens no cardápio para vê-los aqui.</p>
            <Link
              href="/menu"
              className="mt-5 rounded-full bg-[#EA1D2C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#C41625]"
            >
              Ver cardápio
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(({ product, quantity }) => (
              <article
                key={product.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-snug text-[#1a1a1a]">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{formatPrice(product.price)} cada</p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
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
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label="Aumentar quantidade"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-[#EA1D2C] transition hover:bg-red-50"
                  >
                    +
                  </button>
                </div>

                <span className="w-20 shrink-0 text-right text-sm font-bold text-[#1a1a1a]">
                  {formatPrice(product.price * quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  aria-label="Remover item"
                  className="shrink-0 text-lg text-slate-400 transition hover:text-[#EA1D2C]"
                >
                  ×
                </button>
              </article>
            ))}

            {!user && (
              <div className="mt-2 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-[#8a1119]">
                Você vai precisar entrar na sua conta para finalizar o pedido.
              </div>
            )}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
              <p className="text-lg font-bold text-[#1a1a1a]">{formatPrice(total)}</p>
            </div>
            <button
              type="button"
              onClick={handleFinalizarPedido}
              className="rounded-full bg-[#EA1D2C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C41625]"
            >
              {user ? "Finalizar pedido" : "Entrar e finalizar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
