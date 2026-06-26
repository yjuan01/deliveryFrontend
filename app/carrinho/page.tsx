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

export default function CarrinhoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [user, setUser] = useState<{ nome: string } | null>(null);
  const [hydrated, setHydrated] = useState(false); // [DEBUG]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleLogout() {
    localStorage.removeItem("delivery-user");
    localStorage.removeItem("delivery-api-token");
    setUser(null);
    router.push("/");
  }

  useEffect(() => {
    console.log("[CARRINHO] montou, lendo localStorage..."); // [DEBUG]
    const savedCart = localStorage.getItem("delivery-cart");
    const savedUser = localStorage.getItem("delivery-user");
    console.log("[CARRINHO] delivery-cart bruto:", savedCart); // [DEBUG]

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log("[CARRINHO] cart parseado:", parsed); // [DEBUG]
        setCart(parsed);
      } catch (err) {
        console.error("[CARRINHO] erro ao parsear cart salvo:", err); // [DEBUG]
        setCart({});
      }
    } else {
      console.log("[CARRINHO] nenhum cart salvo encontrado (null)"); // [DEBUG]
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setHydrated(true); // [DEBUG]
  }, []);

  useEffect(() => {
    if (!hydrated) { // [DEBUG] evita sobrescrever com {} antes de carregar o valor salvo
      console.log("[CARRINHO] ainda não hidratou, ignorando save"); // [DEBUG]
      return;
    }
    console.log("[CARRINHO] salvando cart:", cart); // [DEBUG]
    localStorage.setItem("delivery-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ product, quantity: cart[product.id] ?? 0 })),
    [cart],
  );

  console.log("[CARRINHO] render - cart atual:", cart, "cartItems:", cartItems.length); // [DEBUG]

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 7.5 : 0;
  const total = subtotal + deliveryFee;

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

      await new Promise((resolve) => setTimeout(resolve, 600));

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
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Carrinho</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950">Seu carrinho</h1>
            <p className="mt-3 text-slate-600">Revise os itens e finalize o pedido após login.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/menu" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Menu</Link>
            <Link href="/restaurantes" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-slate-900">Restaurantes</Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 border border-slate-200"
              >
                Sair
              </button>
            ) : (
              <Link href="/login" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">Login</Link>
            )}
          </div>
        </div>

        {user ? (
          <div className="mb-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Usuário logado</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{user.nome}</h2>
          </div>
        ) : (
          <div className="mb-6 rounded-4xl border border-orange-200 bg-orange-50 p-6 text-orange-900 shadow-sm shadow-orange-200/40">
            <p className="font-semibold">Faça login para finalizar o pedido</p>
            <p className="mt-2">Seu carrinho está salvo localmente, mas o checkout exige autenticação.</p>
          </div>
        )}

        {orderPlaced ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-10 text-center text-emerald-800">
            <p className="text-2xl font-semibold">Pedido realizado com sucesso! 🎉</p>
            <p className="mt-2">Você receberá atualizações sobre o status da entrega.</p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Voltar ao menu
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            Seu carrinho está vazio. Vá ao menu para adicionar itens.
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{item.product.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{item.product.description}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="rounded-full bg-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-slate-950">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="rounded-full bg-orange-500 px-3 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              </div>
            ))}

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-600">Taxa de entrega</p>
                  <p className="text-2xl font-semibold text-slate-950">{formatPrice(deliveryFee)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-3xl font-semibold text-slate-950">{formatPrice(total)}</p>
                </div>
              </div>

              {!user && (
                <p className="mt-4 text-sm text-slate-600">Faça login para finalizar o pedido no backend.</p>
              )}

              <button
                type="button"
                onClick={handleFinalizarPedido}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting
                  ? "Enviando pedido..."
                  : user
                    ? "Finalizar pedido"
                    : "Fazer login para finalizar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
