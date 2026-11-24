# Replace-pwshp LP のデザイン

`/replace-pwshp` は、「持ち込み不要。自宅で査定してもらえる」ことを伝える出張買取（house call）のLPです（**公開ページ**。`src/pages/`）。店頭に品物を持ち込んで売ろうとしている人に、出張査定という選択肢を示し、電話またはWEBフォームの申込みにつなげます。仕様書は [docs/lp-house-call-spec.md](../../lp-house-call-spec.md)。他のLPのデザインシステムは使いません。**見た目の正本は `src/styles/replace-pwshp.css` です。**

## 実装
- ページ：`src/pages/replace-pwshp.astro`、レイアウト：`src/layouts/ReplacePwshpLayout.astro`（`base.css` `silver.css` `gold.css` `appraisal.css` は読み込まない）。
- スタイル：`src/styles/replace-pwshp.css`。`appraisal.css`（= `silver.css` のコピー）に、4ステップ、`.mid-cta`、3列の比較表の変更を加えたもの。`ReplacePwshpLayout` 以外から読み込まない（`body` `a` `button` `dialog` などに直接指定があるため）。
- 動き：`src/scripts/silver.ts` を Silver・Appraisal と**共用**する。動きを変えるときは、3つのLPを確認する。
- 文言：meta、フォームの文言、FAQ、品目カードは `src/content/lps/replace-pwshp.ts`。比較表の表示フラグは `src/content/lps/replace-pwshp-comparison.ts`。それ以外の見出し・本文は `replace-pwshp.astro` に直接書いてある。
- 共通：問い合わせフォーム（`ContactForm`）、ZIP確認（`ZipCheck`）、計測（GTM `GTM-PQQFZ723`、`cta_click` / `faq_open` / `form_start` / `form_submit`）、会社情報（`company.ts`）、法務リンク、買取の流れの文言（`purchase-flow.ts`）。

## 色・書体
`replace-pwshp.css` の `:root`。**Silver と同じ**（アイボリー `#f5f2e9`、本文 `#17251e`、緑 `#00450f`、金 `#aa8740`、補足 `#62695f`、罫線 `#d6d9cd`。見出しは Newsreader（セリフ）、本文は Arial 系。角は丸めない）。

仕様書の配色（クリーム `#FFF8ED`、`#074731`、マスタード `#F3CA6B`、パステル4色のカード）は使わない。仕様書の指示「既存サイトのCSSと差があれば既存側を優先」と、事業側の確認（2026-11-20）による。

## 構成（仕様書の8セクション）
| # | セクション | 実装 |
|---|---|---|
| 1 | Hero | eyebrow「AT YOUR HOME. AT YOUR PACE.」、見出し「Sell from home. *Nothing to carry.*」、チップ4つ、電話ボタン＋Book online、Silver と同じ実写のヒーロー写真 |
| 2 | Reasons to choose us | Silver の `.benefits` 型（3項目） |
| 3 | How we compare | **非表示**（`replace-pwshp-comparison.ts` の `enabled:false`）。表は作ってあり、セルは空 |
| 4 | Mid CTA | 新規の `.mid-cta`（アイボリー、上下に罫線） |
| 5 | Items we buy | Appraisal と同じカテゴリのリボン（線のアイコン）。8枚 |
| 6 | How it works | 4ステップ。4つ目だけ、絵ではなく線のアイコン |
| 7 | FAQ | `<details>`。直前に共通の ZIP 確認（`#areas`。番号なし）を置く |
| 8 | Final CTA | `[data-final-cta]`（SP固定バーの非表示の合図） |

仕様書にない「ZIP確認」のブロックを、機能要件の「ZIP判定を流用」のために加えている。ヘッダーは Silver と同じ（通常のヘッダー＋スクロール後にPCだけ出る細いバー `.compact-bar`）。

## 仕様書から変えた文言（購入ルール）
全LP共通の購入ルール（`src/content/purchase-flow.ts`、`AGENTS.md`、`tests/purchase-flow.test.mjs`）に合わせ、仕様書の支払いの文言は使っていない。

| 仕様書 | 実装 |
|---|---|
| Sell from home. Get paid right away. | Sell from home. Nothing to carry. |
| …and buys a wide range of items at once. | …and looks at a wide range of items in one visit. |
| We purchase your items outright and pay you right away. | We purchase your items outright. … + 「売ると決めたら翌日に集荷（または発送）。支払いは銀行振込」 |
| Step 3「Hear the offer」 | Hear the appraised amount. |
| Step 4 Get paid: we pay you right away. | A simple next step.（集荷と銀行振込。支払い時期は約束しない） |
| FAQ「Is this consignment? When do I get paid?」 | 委託ではなく買取であること＋`purchaseFlow.full` |
| 品目：Brand items / Coins and stamps / Art and antiques / Tableware / Apparel / Musical instruments | 他のLPで確認済みの品目のみ（Designer handbags & goods、Watches、Jewelry & accessories、Cameras、Antiques、Gold coins、Silverware）＋「Other belongings…」。アパレル、楽器、切手、美術品は、買取できると確認が取れるまで載せない |

## 公開前に確認が必要なもの（`npm run todos`）
- 比較表：セルの値、法務・広告審査（承認後に `enabled:true` と `legalApproved`）。質屋や他社を名指ししない。
- 品目：アパレル、楽器、切手、美術品などを買取できるか（できるなら、カードとアイコンを足す）。
- 「We purchase, we do not consign」（委託ではなく買取）の確認。
- 対応エリア：Silver と同じ（DFW、Houston）でよいか。
- ヒーロー写真とステップの絵は Silver のもの。OG 画像も Silver のもの（差し替えるときはファイル名も変える）。
- meta の title と description は仮。

## 編集のルール
- 見た目の変更は、`replace-pwshp.css` と `replace-pwshp.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共有の `silver.ts`、共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、Silver、Gold、Downsizing、Home Value、Appraisal、Replace-pwshp を確認する。
- 質屋の利用を止める表現、質屋や他社の名指し、最上級の表現、価格の約束、支払い時期の約束は書かない（`tests/replace-pwshp.test.mjs`）。
