import { signal } from "@preact/signals";

import { tw } from "twind";
import { marked } from "marked";
import DOMPurify from "dompurify";


// コンテンツの入力値を保持する
const value = signal("");
// プレビュー表示するかの状態を保持する
const preview = signal(false);

export default function ContentForm() {

  /**
   * マークダウンをパースする関数
   */
  const parse = (content: string) => {
    console.log(content);
    const parsed = marked(content);
    const purified = DOMPurify.sanitize(parsed);
    return purified;
  };

  /**
   * textareaの入力値が変更された時に呼ばれる関数
   */
  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    value.value = target.value;
  };

  return (
    <div>
      <div class={tw("flex justify-end")}>
        <label class={tw("text-gray-500 text-sm")} htmlFor="content">
          Content
        </label>
        <label class={tw("text-gray-500 text-sm")}>
          Preview
          <input
            type="checkbox"
            id="preview"
            class={tw("ml-2")}
            checked={preview.value}
            onChange={() => preview.value = !preview.value}
          />
        </label>
      </div>
      {preview.value ? (
        <div
          id="contents"
          dangerouslySetInnerHTML={{
            __html: parse(value.value),
          }}
        />
      ) : (
        <textarea
          id="content"
          rows={10}
          class={tw("w-full p-2 border border-gray-300 rounded-md")}
          name="content"
          value={value.value}
          onChange={ handleChange }
        />
      )}
    </div>
  );
}