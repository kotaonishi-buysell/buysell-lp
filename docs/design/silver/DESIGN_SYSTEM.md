# Silver LP のデザイン

`/silver` は、Codex で作ったモック（`BuySell-Silver-source-2026-10-20`）をそのまま取り込んだLPです。他のLPのデザインシステムは使いません。**見た目の正本は `src/styles/silver.css` とモックです。**

## 実装
- ページ：`src/pages/silver.astro`、レイアウト：`src/layouts/SilverLayout.astro`（`base.css` は読み込まない）。
- スタイル：`src/styles/silver.css`（このファイルは `SilverLayout` 以外から読み込まない。`body`、`a`、`button`、`dialog` などに直接指定があるため）。
- 動き：`src/scripts/silver.ts`（スクロール演出、カテゴリのリボン、FAQの開閉、ZIP欄、ダイアログの閉じ方）。
- 画像：`public/images/silver/`（生成画像。「Illustrative photography」と表示）。

## 色・書体（`silver.css` の `:root`）
| 変数 | 値 | 用途 |
|---|---|---|
| `--ivory` | `#f5f2e9` | ページの背景 |
| `--ink` | `#17251e` | 本文 |
| `--green` | `#00450f` | 主ボタン、アクセント |
| `--gold` | `#aa8740` | リンクのホバー、飾り |
| `--muted` | `#62695f` | 補足の文字 |
| `--line` | `#d6d9cd` | 罫線 |
| `--serif` / `--sans` | Georgia 系 / Arial 系 | 見出し / 本文（Newsreader の自前ホストも読み込み） |

角は丸めません（ボタン、入力欄とも角なし）。

## 問い合わせフォーム
- 全LP共通の `ContactForm` を、予約ダイアログ（`#booking-dialog`）の中に入れています。項目・入力チェック・送信先は共通で、変えません（[docs/forms/contact-form.md](../../forms/contact-form.md)）。
- 見た目は `silver.css` 末尾の `[data-lp='silver']` ブロック（`--cf-*` 変数）で、アイボリー・緑・角なしに合わせています。送信ボタンはモックの `.button` を使います。

## ZIP確認の欄
- ページ中ほどの「See if we come to your neighborhood」は、全LP共通の `ZipCheck` 部品です（[docs/forms/contact-form.md](../../forms/contact-form.md)）。見た目は `silver.css` の `#zip-form`、`.zip-row`、`.zip-result` で決まります。文言の変更は、見出しだけ `silver.astro` で、答えの文言は共通の `src/content/zip-check.ts` で行います。

## 編集のルール
- Silver の見た目の変更は、`silver.css` と `silver.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、Silver、Downsizing、Home Value の3つを確認する。
- 公開前に確認が必要な内容（スタッフの名前と写真、お客様の声、価格帯、「Paid same day」など）は、README の「Silver LP」の節を見てください。
