import { Client } from "postgres";
import "$std/dotenv/load.ts";

/**
 * articles テーブルの型
 */
export type Article = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

// DBクライアントを作成する
const client = new Client({
  database: Deno.env.get("DB_NAME"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  hostname: Deno.env.get("DB_HOST"),
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

// データベースに接続する
await client.connect();

/**
 * 全ての記事を取得する
 */
export const findAllArticles = async () => {
  try {
    const result = await client.queryObject<Article>(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * IDを指定して記事を取得する
 */
export const findArticleById = async (id: string) => {
  try {
    const result = await client.queryObject<Article>(
      "SELECT * FROM articles WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * 記事を作成する
 */
export const createArticle = async (article: Pick<Article, 'title' | 'content'>) => {
  try {
    const result = await client.queryObject<Article>(
      "INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *",
      [article.title, article.content]
    );
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}