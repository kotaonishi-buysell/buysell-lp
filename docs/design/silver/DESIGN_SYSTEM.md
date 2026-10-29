# Silver LP のデザイン

`/silver` は、Codex で作ったモック（`BuySell-Silver-source-2026-10-20`）をそのまま取り込んだLPです。他のLPのデザインシステムは使いません。**見た目の正本は `src/styles/silver.css` とモックです。**

## 実装
- ページ：`src/pages/silver.astro`、レイアウト：`src/layouts/SilverLayout.astro`（`base.css` は読み込まない）。
- スタイル：`src/styles/silver.css`（このファイルは `SilverLayout` 以外から読み込まない。`body`、`a`、`button`、`dialog` などに直接指定があるため）。
- 動き：`src/scripts/silver.ts`（スクロール演出、カテゴリのリボン、FAQの開閉、ZIP欄、ダイアログの閉じ方）。
- 画像：`public/images/silver/`（生成画像。「Illustrative photography」と表示）。

## 動き
動きは `silver.css` 末尾の「Motion, second layer」と `silver.ts`（`initMotion`）にあります。すべて追加の演出で、`prefers-reduced-motion` の人、JavaScript が使えない場合は、静止した完全な表示のままです。
- **スクロール連動の奥行き**：ヒーロー写真（`silver.ts` が `--hero-shift` を更新、CSS で拡大して端を見せない）、value 画像、手順のイラスト、人物写真（761px以上）。後ろ3つは CSS の `animation-timeline: view()`（`@supports` の中）。`transform` と衝突しないよう `translate` / `scale` を使い、ビルドで短縮形にまとめられないよう `animation-*` は個別に書く。
- **銀の光**：ヒーロー見出しの「silver」（`.glint`）に、読み込み後に光が1回走る。ボタン（`.button`）はホバー・フォーカスで光が通る。自動で繰り返す動きは増やさない。
- **操作時**：予約ダイアログの開閉（`@starting-style`）、モバイル下部バーが下から滑り込む、ヘッダーが見えなくなったらデスクトップだけ細いバー（`.compact-bar`、`silver.ts` が `data-visible` と `inert` を切り替える）が上から出る。
- 新しい動きを足すときは、遅く滑らかに（落ち着いた雰囲気を保つ）、スクロールの乗っ取りはしない。

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

## お客様の声（非表示）
- 「A few words from the kitchen table.」のカードは、本物の声がないため**表示していません**（`src/content/lps/silver-testimonials.ts`、`enabled: false`）。デザイン（`silver.astro` の `.voices`、`silver.css`）は残してあります。
- 戻すとき：①`items` を実在の声に差し替える（本人の許可と、`source`＝出典を必ず記入）②`enabled: true` にする③デザインを直す。`tests/silver-testimonials.test.mjs` が、出典のない声の公開を止めます。
- モックのサンプル（L.M. など）は実在の声ではありません。公開しないでください。

## ZIP確認の欄
- ページ中ほどの「See if we come to your neighborhood」は、全LP共通の `ZipCheck` 部品です（[docs/forms/contact-form.md](../../forms/contact-form.md)）。見た目は `silver.css` の `#zip-form`、`.zip-row`、`.zip-result` で決まります。文言の変更は、見出しだけ `silver.astro` で、答えの文言は共通の `src/content/zip-check.ts` で行います。「対象」の答えの下には、予約ダイアログを、ZIP入力済みで開くボタン（`.zip-request`、`button button-cream`）が出ます。

## 編集のルール
- Silver の見た目の変更は、`silver.css` と `silver.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、Silver、Downsizing、Home Value の3つを確認する。
- 公開前に確認が必要な内容（スタッフの名前と写真、お客様の声、「Paid next day」、競合比較など（価格帯と Google の評価は載せない））は、README の「Silver LP」の節を見てください。
