import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-4xl bg-white p-10 shadow-sm shadow-slate-200/60">
          <div className="mb-10 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
              Delivery com backend
            </p>
            <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
              Acesse o app pelo login e navegue entre menu, carrinho e restaurantes.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600">
              Use as paginas separadas para autenticar, ver o cardapio, consultar o carrinho e listar restaurantes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/login" className="flex h-40 flex-col justify-between rounded-[28px] border border-slate-200 bg-orange-500 p-6 text-white transition hover:bg-orange-600">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Login</p>
                <h2 className="mt-4 text-2xl font-semibold">Entrar ou registrar</h2>
              </div>
              <span className="text-sm font-medium">Acesse sua conta para usar o app.</span>
            </Link>

            <Link href="/menu" className="flex h-40 flex-col justify-between rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-slate-950 transition hover:border-orange-300">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Menu</p>
                <h2 className="mt-4 text-2xl font-semibold">Ver cardápio</h2>
              </div>
              <span className="text-sm font-medium text-slate-600">Adicione ao carrinho e explore os produtos.</span>
            </Link>

            <Link href="/carrinho" className="flex h-40 flex-col justify-between rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-slate-950 transition hover:border-orange-300">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Carrinho</p>
                <h2 className="mt-4 text-2xl font-semibold">Ver itens</h2>
              </div>
              <span className="text-sm font-medium text-slate-600">Confira o carrinho e finalize seu pedido.</span>
            </Link>

            <Link href="/restaurantes" className="flex h-40 flex-col justify-between rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-slate-950 transition hover:border-orange-300">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]">Restaurantes</p>
                <h2 className="mt-4 text-2xl font-semibold">Ver restaurantes</h2>
              </div>
              <span className="text-sm font-medium text-slate-600">Veja os restaurantes do backend.</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
