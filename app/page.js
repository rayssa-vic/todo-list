"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";

export default function Home() {
  const user = useUser();
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [tituloEditado, setTituloEditado] = useState("");

  async function carregarTarefas() {
    setCarregando(true);
    try {
      const res = await fetch("/api/tarefas");
      const dados = await res.json();
      setTarefas(dados);
    } catch {
      setErro("Não foi possível carregar as tarefas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (user) {
      carregarTarefas();
    }
  }, [user]);

  async function adicionarTarefa(e) {
    e.preventDefault();
    if (!titulo.trim()) return;

    const res = await fetch("/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });

    if (res.ok) {
      const nova = await res.json();
      setTarefas([nova, ...tarefas]);
      setTitulo("");
    }
  }

  async function alternarConcluida(tarefa) {
    setTarefas(
      tarefas.map((t) =>
        t.id === tarefa.id ? { ...t, concluida: !t.concluida } : t
      )
    );
    await fetch(`/api/tarefas/${tarefa.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida: !tarefa.concluida }),
    });
  }

  async function excluirTarefa(id) {
    setTarefas(tarefas.filter((t) => t.id !== id));
    await fetch(`/api/tarefas/${id}`, { method: "DELETE" });
  }

  function iniciarEdicao(tarefa) {
    setEditandoId(tarefa.id);
    setTituloEditado(tarefa.titulo);
  }

  async function salvarEdicao(id) {
    if (!tituloEditado.trim()) return;
    setTarefas(
      tarefas.map((t) => (t.id === id ? { ...t, titulo: tituloEditado } : t))
    );
    setEditandoId(null);
    await fetch(`/api/tarefas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: tituloEditado }),
    });
  }

  const pendentes = tarefas.filter((t) => !t.concluida).length;

  if (user === undefined) {
    return (
      <main className="max-w-xl mx-auto px-6 py-14 min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-muted">carregando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-6 py-14 min-h-screen flex flex-col items-center justify-center text-center gap-4">
        <h1 className="font-display text-3xl font-bold text-text">
          Minhas tarefas
        </h1>
        <p className="font-body text-sm text-muted">
          Entre com sua conta para ver suas tarefas.
        </p>
        <a
          href="/handler/sign-in"
          className="font-display font-bold text-sm bg-text text-bg px-4 py-2 rounded-sm hover:bg-pink transition-colors"
        >
          Entrar
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-14 min-h-screen">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-pinkDeep mb-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </p>
          <h1 className="font-display text-4xl font-bold text-text">
            Minhas tarefas
          </h1>
          <p className="font-body text-sm text-muted mt-1">
            {carregando
              ? "carregando..."
              : `${pendentes} pendente${pendentes === 1 ? "" : "s"} de ${tarefas.length}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-body text-xs text-muted mb-1">
            {user?.primaryEmail}
          </p>
          <button
            onClick={() => user.signOut()}
            className="font-body text-xs text-pinkDeep hover:underline"
          >
            sair
          </button>
        </div>
      </header>

      <form onSubmit={adicionarTarefa} className="flex gap-2 mb-8">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="flex-1 bg-surface border-b-2 border-line focus:border-pink outline-none px-3 py-2 rounded-t-sm font-body text-text placeholder:text-muted transition-colors"
        />
        <button
          type="submit"
          className="font-display font-bold text-sm bg-text text-bg px-4 py-2 rounded-sm hover:bg-pink transition-colors"
        >
          Adicionar
        </button>
      </form>

      {erro && <p className="text-pinkDeep font-body text-sm mb-4">{erro}</p>}

      {!carregando && tarefas.length === 0 && (
        <p className="font-body text-muted text-sm italic">
          Nenhuma tarefa por aqui. Que tal adicionar a primeira?
        </p>
      )}

      <ul className="space-y-1">
        {tarefas.map((tarefa) => (
          <li
            key={tarefa.id}
            className="group flex items-center gap-3 py-2.5 border-b border-line/25"
          >
            <button
              onClick={() => alternarConcluida(tarefa)}
              aria-label={
                tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída"
              }
              className={`task-check w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                tarefa.concluida
                  ? "bg-pink border-pink text-bg"
                  : "border-text/40 text-transparent"
              }`}
            >
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {editandoId === tarefa.id ? (
              <input
                autoFocus
                value={tituloEditado}
                onChange={(e) => setTituloEditado(e.target.value)}
                onBlur={() => salvarEdicao(tarefa.id)}
                onKeyDown={(e) => e.key === "Enter" && salvarEdicao(tarefa.id)}
                className="flex-1 bg-transparent border-b border-pink outline-none font-body text-text py-0.5"
              />
            ) : (
              <span
                onClick={() => iniciarEdicao(tarefa)}
                className={`flex-1 font-body cursor-text ${
                  tarefa.concluida ? "strike text-muted" : "text-text"
                }`}
              >
                {tarefa.titulo}
              </span>
            )}

            <button
              onClick={() => excluirTarefa(tarefa.id)}
              aria-label="Excluir tarefa"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted hover:text-pinkDeep transition-opacity font-body text-xs px-2"
            >
              excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
