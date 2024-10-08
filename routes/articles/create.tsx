import { Head } from "$fresh/src/runtime/head.ts";
import { tw } from "twind";

import { createArticle } from "../../utils/db.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

import ContentForm from "../../islands/ContentForm.tsx";

interface Data {
  error: {
    title: string;
    content: string;
  };
  title?: string;
  content?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    // フォームデータの入力値を取得する
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    // タイトルまたはコンテンツどちら未入力の場合はバリデーションエラーを返す
    if (!title || !content) {
      return ctx.render({
        error: {
          title: title ? "" : "Title is required",
          content: content ? "" : "Content is required",
        },
        title,
        content,
      });
    }

    const article = {
      title,
      content,
    };

    // データベースに保存する
    await createArticle(article);

    // トップページにリダイレクトする
    return new Response("", {
      status: 303,
      headers: {
        Location: "/",
      },
    });
  }
};

export default function CreateArticlePage({ data }: PageProps<Data | undefined>) {
  return (
    <div class={tw("min-h-screen bg-gray-200")}>
      <Head>
        <title>Create Post</title>
        <link rel="stylesheet" href="/article.css" />
      </Head>
      <div class={tw("max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col")}>
        <h1 class={tw("font-extrabold text-5xl text-gray-800")}>Create Post</h1>

        <form
          class={tw("rounded-xl border p-5 shadow-md bg-white mt-8")}
          method="POST"
        >
          <div class={tw("flex flex-col gap-y-2")}>
            <div>
              <label class={tw("text-gray-500 text-sm")} htmlFor="title">
                Title
              </label>
              <input
                id="title"
                class={tw("w-full p-2 border border-gray-300 rounded-md")}
                type="text"
                name="title"
                value={data?.title}
              />
              {data?.error?.title && (
                <p class={tw("text-red-500 text-sm")}>{data.error.title}</p>
              )}
            </div>
            <div>
              <label class={tw("text-gray-500 text-sm")} htmlFor="content">
                Content
              </label>
              <ContentForm />
              {data?.error?.content && (
                <p class={tw("text-red-500 text-sm")}>{data.error.content}</p>
              )}
            </div>
          </div>
          <div class={tw("flex justify-end mt-4")}>
            <button
              class={tw(
                "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              )}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
        <br />
        <div class={tw("flex flex-row-reverse")}>
          <a
            href="/"
            class={tw("bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md")}
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}