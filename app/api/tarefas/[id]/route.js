import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { stackServerApp } from "@/lib/stack";

// PATCH /api/tarefas/:id — edita título/descrição e/ou alterna concluída
export async function PATCH(request, { params }) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const pool = getPool();

  const { rows: existentes } = await pool.query(
    "SELECT * FROM tarefas WHERE id = $1 AND usuario_id = $2",
    [id, user.id]
  );
  if (existentes.length === 0) {
    return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
  }

  const atual = existentes[0];
  const titulo = body.titulo !== undefined ? body.titulo : atual.titulo;
  const descricao = body.descricao !== undefined ? body.descricao : atual.descricao;
  const concluida = body.concluida !== undefined ? body.concluida : atual.concluida;

  const { rows } = await pool.query(
    "UPDATE tarefas SET titulo = $1, descricao = $2, concluida = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *",
    [titulo, descricao, concluida, id, user.id]
  );

  return NextResponse.json(rows[0]);
}

// DELETE /api/tarefas/:id — remove a tarefa (só se for do usuário logado)
export async function DELETE(request, { params }) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = params;
  const pool = getPool();

  await pool.query("DELETE FROM tarefas WHERE id = $1 AND usuario_id = $2", [
    id,
    user.id,
  ]);

  return NextResponse.json({ ok: true });
}
