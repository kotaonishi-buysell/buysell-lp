# Gold LP のデザイン

`/gold` は、デザイナーが作った静的HTML（`Reworth_LP_金_案2_2026-11-01/公開用/index.html`、2026-11-01）を、Silver と同じ方法で取り込んだLPです。他のLPのデザインシステムは使いません。**見た目の正本は `src/styles/gold.css` と元のHTMLです。**

## 実装
- ページ：`src/pages/gold.astro`、レイアウト：`src/layouts/GoldLayout.astro`（`base.css` と `silver.css` は読み込まない）。
- スタイル：`src/styles/gold.css`（`GoldLayout` 以外から読み込まない。`body`、`a`、`button` などに直接指定があるため）。
- 動き：`src/scripts/gold.ts`（カルーセル、タブ、メニュー、デスクトップの拡大 `--pc-zoom`、追従バー、画面外のアニメーションの停止）。共通の `main.ts`（電話・予約ボタン、FAQ、フォーム）も動く。
- 文言：meta・フォーム文言・未確定の事実を含む文は `src/content/lps/gold.ts`。それ以外の見出し・本文は `gold.astro` に直接書いてある。
- 画像：`public/images/gold/`（WebP。元のJPEGから変換、合計約0.5MB）。OG画像 `public/images/og-gold.jpg` は hero 画像から切り出した仮のもの。
- フォント：Open Sans と Instrument Serif（どちらも SIL OFL）。`public/fonts/` に自前ホスト、`@font-face` は `gold.css`。

## 元のHTMLからの変更点（`gold.css` の先頭コメントにも記載）
- **問い合わせフォーム**：元の独自フォーム（`.rf`、`LP_CONFIG`、送信先なし）は外し、全LP共通の `ContactForm` に替えた。最後の申込みセクションに置き、「Get my free appraisal」ボタンは `data-booking` でそこへスクロールして最初の欄にフォーカスする。見た目は `gold.css` 末尾の `[data-lp='gold']` ブロック（`--cf-*` 変数）。
  - 元のフォームだけが送っていた `gclid` と `fbclid`、`lang`、`page_url` は送らない（共通フォームの項目と、UTM 5項目だけ）。必要なら共通ファイル側で足す（[docs/forms/contact-form.md](../../forms/contact-form.md)）。
  - 計測は共通の `cta_click` / `faq_open` / `form_start` / `form_submit`。元の `lead_form_submit` は出さない。
- **電話・住所・登録番号・OCCC・グループ名**：`company.ts` から出す（`site.ts` 経由）。元の `(XXX) XXX-XXXX`、`#XXXXX` は使わない。
- **ロゴ**：共通の `BrandLogo`（積み上げ型の REWORTH）。元の1行のロゴ（SVG）は使わない。そのため、ヘッダー、タブ、比較表、フッターのロゴの幅は `gold.css` で決め直してある。
- **ボタン**：クラス名 `.btn` を `.gbtn` に変えた（共通の `form-support.css` が `.btn` を持つため）。
- **未確定の事実**：元の `[TBC]` は、画面に出さない（公開ページに TODO を出さないため）。約束になるもの（訪問までの日数、「訪問時にIDを見せる」、保険、Houston の開始時期の「December」）は載せず、`gold.ts` の `// TODO:` コメントに確認事項として残した（`npm run todos` に出る）。「Always true」の約束は5つから4つになった。事実として確認できているものの TBC（無料の訪問と査定、写真付きIDの確認）は外した。
- **買取の流れ**：元の「We send your payment right away」「Paid on the spot」は、全LP共通のルール（`purchase-flow.ts`）に直した。訪問は査定だけで、自宅では買い取らない。売ると決めたら、翌日に引き取りに伺う、または郵送。支払いは銀行振込で、時期は約束しない。**ヒューストン**は、ダラス・フォートワースと同じ「Now visiting」のカードにした（「Coming soon」は削除済み）。
- **フッター**：Do not sell or share のリンクを足した。元の「wholly owned subsidiary … publicly listed Japanese reuse company」の重複する文は、`company.ts` の言い方（part of ○○）に揃えて1つにした。
- **外した節（本物の情報がそろうまで）**：
  - 「Your appraisers」：サンプル写真と `[Real name]` のままだったため。写真2枚（A1、A2）は取り込んでいない。
  - 「What people say after a visit」：元から `hidden` のサンプル3件。実在の声ではないため、文も入れていない。
  - 戻すとき：元のHTMLの該当節を `gold.astro` に戻し、実在の名前・写真・声（本人の許可と出典つき）に差し替える。CSS（`.accent*`、`.person*`、`.rcard*`）は `gold.css` に残してある。
- 元のHTMLの「日本語レビューバー」用の CSS（`.rv`、`.jp`）と、フォーム単独ページ用の切り替え（`formMode: "page"`）は取り込んでいない。
- 追従バー（モバイル下部）は、元のまま `gold.ts` が、ヒーローのボタンと最後の申込みセクションが見えている間は隠す。

## 色・書体（`gold.css` の `:root`）
| 変数 | 値 | 用途 |
|---|---|---|
| `--char` | `#2E2E3A` | 本文、主ボタン、暗い背景 |
| `--cream` | `#FBF7F0` | 薄い背景 |
| `--sand` | `#F6E5D1` | 告知バー、強調の背景 |
| `--signal` | `#C9A86A` | 金色のアクセント |
| `--sky` | `#90C4EB` | ヘッダーの小さなボタン |
| `--serif` / `--sans` | Instrument Serif / Open Sans | 見出し / 本文 |

## 公開前に確認が必要なもの（`npm run todos`。画面には出さない）
- OCCC の登録番号、OCCC の連絡先と必要な表記の文言（`company.ts`。全LPに反映される）
- 申込み後の連絡までの営業日数、訪問までの日数
- 買取できる品目の一覧、Houston の開始時期（今は「coming soon」だけ）、訪問時にIDを見せること（今は載せていない）
- 比較表の文言の確認（U.S. counsel）。**確認まで非表示**（`src/content/lps/gold-comparison.ts`。`enabled: true` と `legalApproved` で戻す）。出典の整理は Silver の [COMPARISON_SOURCES.md](../silver/COMPARISON_SOURCES.md) と同じ扱い
- 保険（Insured）の表記（今は載せていない）、テキサスの登録確認ページのリンク（登録番号を入れるときに、番号の横に足す）
- 写真はすべて生成画像（フッターに「Images are for illustration.」）。会社のオフィスの写真（`company-office.webp`）の使用許諾

## 編集のルール
- Gold の見た目の変更は、`gold.css` と `gold.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、Silver、Downsizing、Home Value、Gold を確認する。
