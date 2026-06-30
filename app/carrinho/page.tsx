/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
};

const products: Product[] = [
  { id: "pizza-mussarela", name: "Pizza Mussarela", description: "Molho de tomate, mussarela, orégano e borda crocante.", price: 45.9, category: "Pizza", tags: ["Clássica", "Tradicional"] },
  { id: "pizza-portuguesa", name: "Pizza Portuguesa", description: "Presunto, ovos, cebola, azeitona e muito sabor.", price: 54.5, category: "Pizza", tags: ["Saborosa", "Tradicional"] },
  { id: "hamburguer-classico", name: "Hambúrguer Clássico", description: "Pão brioche, carne suculenta, queijo cheddar e molho especial.", price: 29.9, category: "Hambúrguer", tags: ["Cheddar", "Molho Especial"] },
  { id: "acai-tradicional", name: "Açaí Tradicional", description: "Açaí 500ml com banana, granola e mel.", price: 23.5, category: "Açaí", tags: ["Frio", "Energia"] },
];

const categoryIcon: Record<string, string> = {
  Pizza: "🍕",
  Hambúrguer: "🍔",
  Açaí: "🍇",
};

const FREE_DELIVERY_THRESHOLD = 80;
const DELIVERY_FEE = 7.5;

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPrice(value: number) {
  return currency.format(value);
}

export default function CarrinhoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [user, setUser] = useState<{ nome: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  useEffect(() => {
    const savedCart = localStorage.getItem("delivery-cart");
    const savedUser = localStorage.getItem("delivery-user");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart({});
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("delivery-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ product, quantity: cart[product.id] ?? 0 })),
    [cart],
  );

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : DELIVERY_FEE) : 0;
  const total = subtotal + deliveryFee;
  const missingForFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const freeDeliveryProgress = subtotal > 0
    ? Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)
    : 0;

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
    setRemovingId(productId);
    window.setTimeout(() => {
      setCart((current) => {
        const next = { ...current };
        delete next[productId];
        return next;
      });
      setRemovingId(null);
    }, 180);
  }

  function clearCart() {
    setCart({});
    setShowClearConfirm(false);
  }

  async function handleFinalizarPedido() {
    if (!user) {
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: quando houver backend, substituir o bloco abaixo por uma
      // chamada real à API de pedidos, por exemplo:
      //
      // const response = await fetch("/api/pedidos", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ items: cartItems, total }),
      // });
      // if (!response.ok) throw new Error("Falha ao enviar pedido");

      await new Promise((resolve) => setTimeout(resolve, 900));

      setCart({});
      localStorage.removeItem("delivery-cart");
      setOrderPlaced(true);
    } catch (err) {
      console.error("[CARRINHO] erro ao finalizar pedido:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-10 pb-28 sm:pb-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Carrinho</p>
            <h1 className="mt-2 flex items-center gap-3 text-4xl font-semibold text-slate-950">
              Seu carrinho
              {totalItemCount > 0 && (
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-500 px-2 text-base font-bold text-white">
                  {totalItemCount}
                </span>
              )}
            </h1>
            <p className="mt-3 text-slate-600">Revise os itens e finalize o pedido após login.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/menu" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Menu</Link>
            <Link href="/restaurantes" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Restaurantes</Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
              >
                Sair
              </button>
            ) : (
              <Link href="/login" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">Login</Link>
            )}
          </div>
        </div>

        {user ? (
          <div className="mb-6 flex items-center gap-4 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Usuário logado</p>
              <h2 className="text-xl font-semibold text-slate-950">{user.nome}</h2>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-4 rounded-4xl border border-orange-200 bg-orange-50 p-6 text-orange-900 shadow-sm shadow-orange-200/40">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold">Faça login para finalizar o pedido</p>
              <p className="mt-1 text-sm">Seu carrinho está salvo localmente, mas o checkout exige autenticação.</p>
            </div>
          </div>
        )}

        {orderPlaced ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-10 text-center text-emerald-800">
            <p className="text-5xl">🎉</p>
            <p className="mt-3 text-2xl font-semibold">Pedido realizado com sucesso!</p>
            <p className="mt-2">Você receberá atualizações sobre o status da entrega.</p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Voltar ao menu
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-14 text-center text-slate-500">
            <span className="text-6xl">🛒</span>
            <p className="mt-4 text-lg font-semibold text-slate-700">Seu carrinho está vazio</p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">Que tal dar uma olhada no nosso menu e escolher algo delicioso para pedir?</p>
            <Link
              href="/menu"
              className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Ver o menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {totalItemCount} {totalItemCount === 1 ? "item" : "itens"} no carrinho
                </p>
                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm font-semibold text-slate-400 transition hover:text-rose-600"
                  >
                    Esvaziar carrinho
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Tem certeza?</span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Sim, esvaziar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-all duration-200 ${
                    removingId === item.product.id ? "scale-95 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                        {categoryIcon[item.product.category] ?? "🍽️"}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">{item.product.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          aria-label="Diminuir quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm font-semibold text-slate-950">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          aria-label="Aumentar quantidade"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs font-semibold text-slate-400 transition hover:text-rose-600"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-700">
                    <span className="text-slate-500">{formatPrice(item.product.price)} cada</span>
                    <span className="text-base font-semibold text-slate-950">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <h3 className="text-lg font-semibold text-slate-950">Resumo do pedido</h3>

                {!isFreeDelivery && subtotal > 0 && (
                  <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs font-medium text-orange-800">
                      Faltam <span className="font-bold">{formatPrice(missingForFreeDelivery)}</span> para frete grátis
                    </p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-orange-200/60">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {isFreeDelivery && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                    <span>🎁</span> Você ganhou frete grátis!
                  </div>
                )}

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Taxa de entrega</span>
                    <span className={isFreeDelivery ? "font-semibold text-emerald-600" : ""}>
                      {isFreeDelivery ? "Grátis" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-950">
                    <span>Total</span>
                    <span className="text-2xl">{formatPrice(total)}</span>
                  </div>
                </div>

                {!user && (
                  <p className="mt-4 text-xs text-slate-500">Faça login para finalizar o pedido no backend.</p>
                )}

                <button
                  type="button"
                  onClick={handleFinalizarPedido}
                  disabled={isSubmitting}
                  className="mt-6 hidden w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:flex"
                >
                  {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {isSubmitting
                    ? "Enviando pedido..."
                    : user
                      ? "Finalizar pedido"
                      : "Fazer login para finalizar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!orderPlaced && cartItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:hidden">
          <button
            type="button"
            onClick={handleFinalizarPedido}
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex items-center gap-2">
              {isSubmitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isSubmitting ? "Enviando..." : user ? "Finalizar pedido" : "Fazer login"}
            </span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
