import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

let sqlite: SQLiteConnection | null = null;
let db: SQLiteDBConnection | null = null;

const DB_NAME = 'studybloom';
const DB_VERSION = 1;

export const isNative = () => Capacitor.isNativePlatform();

export async function initDatabase(): Promise<boolean> {
  if (!isNative()) return false;

  if (!sqlite) {
    sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  const isConn = await sqlite.isConnection(DB_NAME, false);
  db = isConn.result
    ? await sqlite.retrieveConnection(DB_NAME, false)
    : await sqlite.createConnection(DB_NAME, false, 'no-encryption', DB_VERSION, false);

  await db.open();

  const createSQL = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      difficulty TEXT,
      points INTEGER,
      timeEstimate TEXT,
      completed INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      locked INTEGER DEFAULT 0,
      reminderAt INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
  `;

  await db.execute(createSQL);
  return true;
}

export async function getDB(): Promise<SQLiteDBConnection> {
  if (!isNative()) throw new Error('SQLite DB only available on native platform');
  if (!db) {
    await initDatabase();
  }
  if (!db) throw new Error('SQLite DB not initialized');
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
  if (sqlite) {
    const isConn = await sqlite.isConnection(DB_NAME, false);
    if (isConn.result) await sqlite.closeConnection(DB_NAME, false);
  }
}

