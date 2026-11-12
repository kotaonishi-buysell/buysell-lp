# Appraisal LP のデザイン

`/appraisal` は、Silver LP と同じ骨格・動きで作った、総合買取のLPです（**公開ページ**。`/silver` `/gold` と同じく `src/pages/`）。「家にある、使わないけど捨てられないもの（アクセサリー、ブランド品、時計、ジュエリー、アンティーク、カメラ、金貨、銀食器）を、プロに見てもらう」という訴求です。他のLPのデザインシステムは使いません。**見た目の正本は `src/styles/appraisal.css` です。**

## 実装
- ページ：`src/pages/appraisal.astro`、レイアウト：`src/layouts/AppraisalLayout.astro`（`base.css` `silver.css` `gold.css` は読み込まない）。
- スタイル：`src/styles/appraisal.css`。`silver.css` のコピーに、フォームの外観の範囲（`[data-lp='appraisal']`）と、カテゴリの円の中身（アイコン）の変更を加えたもの。`AppraisalLayout` 以外から読み込まない（`body` `a` `button` `dialog` などに直接指定があるため）。
- 動き：`src/scripts/silver.ts` を Silver と**共用**する（ページが `import '../scripts/silver'`）。カテゴリのセクションは `.buy-section` のクラスで見つける（Silver は `#silver`、Appraisal は `#items`）。動きを変えるときは、両方のLPを確認する。
- 文言：meta、フォームの文言、FAQ、カテゴリ一覧は `src/content/lps/appraisal.ts`。それ以外の見出し・本文は `appraisal.astro` に直接書いてある。
- 共通：問い合わせフォーム、ZIP確認（対応エリアは Silver と同じ）、計測、会社情報（`company.ts`）、法務リンク、買取の流れの文言（`purchase-flow.ts`）。

## Silver からの変更点
- **ヒーロー**：eyebrow「TOO NICE TO TOSS.」、見出し「Not using it. Not tossing it. / Just give us a call.」（光る語は「tossing」）、サブ「Free in-home appraisals for the things that have been sitting around the house.」。ねらいは、「使わないけど高価そうで捨てられない」ものを、「一旦電話して見てもらう」流れ。ヒーローのチップは「Free appraisal / No obligation / One call to start / We come to you」（Silver の「Paid next day」は、04 の約束の節に置く）。
- **カテゴリ（01）**：8つ。メインの3つ（金・プラチナのアクセサリー、ブランドのバッグなど、時計）を先に、続けて、ジュエリー、アンティーク、カメラ、金貨、銀食器。Silver の「And more than silver」の節と、「Please don't polish your silver」の注意は、総合用に書き換えた（「Please don't clean or polish anything.」）。
- **価値の説明（03）**：Silver の「価格×重量×純度」の式は、銀に特有のため使わない。「The item · its materials · its condition」に替えた。
- **スタッフ（05）**：Silver と同じ2名（名前・写真）。役職は「Appraisal professional」（経験は Yosuke Matsuda が5年、Koki Iguchi が4年）。Silver と同じ表記。
- **FAQ**：総合用に書き直した（1点からでも訪問できること、対象品目、状態、クリーニングの可否、箱・書類、支払い、ID）。
- **非表示の節**：お客様の声と競合比較は、Silver と同じく、本物の声と法務の確認がそろうまで置かない。比較の表の CSS は残してある。

## 画像（暫定）
- **カテゴリの円**：写真ではなく、アイコン（`appraisalCategories` の `icon`）。時計、バッグ、金貨などの商品写真は、まだない。生成した写真（白背景の商品写真を3×2に並べたスプライト。`silver-categories.webp` と同じ形式）に差し替える予定。差し替えるときは、`appraisal.css` の `.category-image svg` を、スプライトを背景にするルールに戻す（`silver.css` の `.category-image::before` と同じ）。ブランド品、時計、カメラは、ロゴ・ブランド名・モノグラムが写らないものにする。
- 生成途中のもの：Figma のファイル（Sj4SpBXXIutlwbrKGfLYkb）のノード 1:2 に、1枚目の試作がある（未取り込み）。
- **そのほかの画像**（ヒーロー、手順のイラスト、スタッフの写真、価値の説明の画像）：Silver の `public/images/silver/` を読む。差し替えるときは、`public/images/appraisal/` に置く。
- OG 画像は、Silver のもの（`og-silver-reworth.jpg`）を、暫定で使う。

## 色・書体
`appraisal.css` の `:root`。Silver と同じ（アイボリー `#f5f2e9`、本文 `#17251e`、緑 `#00450f`、金 `#aa8740`。見出しはセリフ体、本文はサンセリフ。角は丸めない）。別の色にする場合は、このファイルだけを変える。

## 公開前に確認が必要なもの（`npm run todos`）
- 各カテゴリの名前と範囲（特に「アクセサリー」を、金・プラチナのものとして扱っていること）、買取できない品目（FAQ に書く）
- 「クリーニングしない」「箱・書類を出す」の案内が、全カテゴリで正しいか
- OG 画像の差し替え、カテゴリの写真
- 画面上部の「DESIGN PREVIEW」の帯と、フッターの「Design preview…」の文言は、削除済み（2026-11-12）。フッターの「Illustrative photography.」は、依頼により削除した。

## 編集のルール
- Appraisal の見た目の変更は、`appraisal.css` と `appraisal.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共有の `silver.ts`、共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、Silver、Gold、Downsizing、Home Value、Appraisal を確認する。
