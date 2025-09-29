import { getDB, isNative } from '@/db/sqlite';

export interface TaskRow {
  id: number;
  title: string;
  category?: string;
  difficulty?: string;
  points?: number;
  timeEstimate?: string;
  completed?: number; // 0/1
  streak?: number;
  locked?: number; // 0/1
  reminderAt?: number | null; // epoch millis
}

export async function setSetting(key: string, value: string) {
  if (!isNative()) return; // no-op on web
  const db = await getDB();
  await db.run('INSERT OR REPLACE INTO settings(key, value) VALUES(?, ?);', [key, value]);
}

export async function getSetting(key: string): Promise<string | null> {
  if (!isNative()) return null;
  const db = await getDB();
  const res = await db.query('SELECT value FROM settings WHERE key = ?;', [key]);
  return res.values?.[0]?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  if (!isNative()) return {};
  const db = await getDB();
  const res = await db.query('SELECT key, value FROM settings;');
  const acc: Record<string, string> = {};
  (res.values || []).forEach((row: any) => {
    acc[row.key] = row.value;
  });
  return acc;
}

export async function upsertTask(task: TaskRow) {
  if (!isNative()) return;
  const db = await getDB();
  await db.run(
    `INSERT INTO tasks (id, title, category, difficulty, points, timeEstimate, completed, streak, locked, reminderAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title,
       category=excluded.category,
       difficulty=excluded.difficulty,
       points=excluded.points,
       timeEstimate=excluded.timeEstimate,
       completed=excluded.completed,
       streak=excluded.streak,
       locked=excluded.locked,
       reminderAt=excluded.reminderAt;
    `,
    [
      task.id,
      task.title,
      task.category ?? null,
      task.difficulty ?? null,
      task.points ?? null,
      task.timeEstimate ?? null,
      task.completed ?? 0,
      task.streak ?? 0,
      task.locked ?? 0,
      task.reminderAt ?? null,
    ]
  );
}

export async function getTasks(): Promise<TaskRow[]> {
  if (!isNative()) return [];
  const db = await getDB();
  const res = await db.query('SELECT * FROM tasks ORDER BY id ASC;');
  return (res.values || []) as TaskRow[];
}

export async function markTaskCompleted(id: number, completed: boolean) {
  if (!isNative()) return;
  const db = await getDB();
  await db.run('UPDATE tasks SET completed = ? WHERE id = ?;', [completed ? 1 : 0, id]);
}

export async function updateTaskStreak(id: number, streak: number) {
  if (!isNative()) return;
  const db = await getDB();
  await db.run('UPDATE tasks SET streak = ? WHERE id = ?;', [streak, id]);
}

