import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { stackServerApp } from "@/lib/stack";

// GET /api/tarefas — lista só as tarefas do usuário logado
export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC",
    [user.id]
  );
  return NextResponse.json(rows);
}

// POST /api/tarefas — cria uma nova tarefa vinculada ao usuário logado
export async function POST(request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const titulo = (body.titulo || "").trim();

  if (!titulo) {
    return NextResponse.json(
      { error: "O título da tarefa é obrigatório." },
      { status: 400 }
    );
  }

  const pool = getPool();
  const { rows } = await pool.query(
    "INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *",
    [titulo, body.descricao || null, user.id]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
