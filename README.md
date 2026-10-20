# Home Appraisal LPs

訪問査定・リセール事業の米国（テキサス）向け英語LP。今あるのは次の2本。

- **Downsizing LP（`/downsizing`）**：共通の部品とデザインシステムで組んだ型。残りの3本（Declutter / Parents' belongings / Brand goods）は、コンテンツファイルを1つ足せば同じ部品で作れる構成にしてある。
- **Silver LP（`/silver`）**：Codex で作ったモックを取り込んだ、専用ページ・専用CSSのLP。フォーム・計測・会社情報だけ共通。詳しくは [Silver LP](#silver-lp-silver)。

- 仕様：Home Appraisal LPs — Build Specification（2026-10-07）
- デザイン：Home Appraisal デザインシステム（tokens.json / README）
- 仕様と食い違う点は「LP要件定義書（簡易版）」（2026-09-25）に合わせた（[仕様からの変更点](#仕様からの変更点)）

## 使い方

Node.js 22.12 以上。

```sh
npm install
npm run dev      # http://localhost:4321/downsizing
npm run build    # dist/ に静的ファイルを出力
npm run preview  # build 結果を確認
npm run check    # 型チェック（astro check）
npm run todos    # 未確定の事業情報（TODO）の一覧
```

`/` は `/downsizing` へリダイレクトする（`astro.config.mjs`）。公開ドメインが決まったら `site` を差し替える（canonical と OG 画像の URL に使う）。

## 構成

```
src/
  styles/tokens.css      デザイントークン。仕様のブロックをそのまま貼り、足りない値は下の Additions に追加
  styles/base.css        リセット、文字スタイル（.t-display-xl など）、レイアウト
  styles/form-support.css  フォームが使う部品（ボタン、リンク、.muted、.todo、[hidden] など）。base.css から分離（理由は Silver LP の節）
  styles/fonts.css       自前ホストのフォント（public/fonts/、OFL）
  styles/silver.css      Silver LP 専用。/silver だけが読み込む
  content/site.ts        4LP共通：会社情報、電話、営業時間、対応エリア、法定表記、共通UI文言、GTM
  content/lps/*.ts       LPごと：meta、ボタン文言、セクションの並び順と全コピー、FAQ、フォームの選択肢
  content/lps/index.ts   LPの一覧（1件 = 1ページ /<slug>）。Silver は専用ページなのでここには入れない
  content/lps/silver.ts  Silver：meta、フォーム文言、FAQ
  content/types.ts       コンテンツの型
  components/            仕様の section 4 の部品（1部品1ファイル）＋ PhoneButton / CtaGroup / Section
  layouts/Document.astro    全LP共通の HTML（meta、OG、LocalBusiness 構造化データ、GTM、共通スクリプト）。CSS は読まない
  layouts/BaseLayout.astro  Document ＋ tokens / base / form-support（Downsizing 系）
  layouts/SilverLayout.astro  Document ＋ tokens / form-support / silver.css（base.css は読まない）
  pages/[slug].astro     content/lps/*.ts の sections を順に描画
  pages/silver.astro     Silver のページ本体（Codex のマークアップ）
  scripts/               ブラウザ側の処理（計測、フォーム検証、追従バー、FAQ、ZIP判定）
  scripts/silver.ts      Silver 専用の動き（カテゴリのリボン、スクロール演出、FAQ の開閉、ZIP 欄）
  scripts/submit.ts      submitConsultation()：フォーム送信のスタブ
public/images/           OG 画像（仮）、silver/ は Silver の画像（WebP）
```

- 文言はすべて `src/content/` にあり、部品にはコピーを直書きしていない。
- 色・サイズ・角丸はすべて `tokens.css` の変数を参照している（ブレークポイントの 720px / 1024px だけはメディアクエリに直接書いている）。

### LP を追加するには

1. `src/content/lps/downsizing.ts` をコピーし、`slug`・`scene`（`move` / `sort` / `memory` / `brand`）・コピー・`sections` の並び順を書き換える。
2. `src/content/lps/index.ts` の `landingPages` に追加する。

`scene` を変えると、ヘッダー・ファーストビュー・引用帯・最後の申込みセクションの背景色が切り替わる。`brand` では文字・リンク・フォーカスリング・主ボタンが反転する（濃い背景で pine が読めないため）。フォームの入力欄は、どのLPでも明るいパネルの上に置いている。

## Silver LP（`/silver`）

Codex で作ったモック（`BuySell-Silver-source-2026-10-20`）を取り込んだ、デザインの違う3本目。共通の部品に載せ替えず、**見た目はモックのまま**にして、フォーム・計測・会社情報だけ共通にしてある。

### 何が共通で、何が別か

| | |
|---|---|
| 共通 | 問い合わせフォーム（`ConsultForm`、検証、ZIP判定、UTM、送信 `submit.ts`、TCPA）、計測（`cta_click` / `faq_open` / `form_start` / `form_submit`）、会社名・電話・営業時間・登録番号・OCCC・法定リンク（`site.ts`）、`<head>`・GTM・構造化データ（`Document.astro`） |
| 別 | ページのマークアップ（`pages/silver.astro`）、CSS（`styles/silver.css`）、画像、スクロール演出などの動き（`scripts/silver.ts`） |
| 文言の置き場所 | meta・フォーム・FAQ は `content/lps/silver.ts`。それ以外の見出し・本文は `silver.astro` に直接書いてある（専用レイアウトで、他LPに流用しないため） |

### CSS が他とぶつからないようにしている仕組み

- Silver のCSSは `body` / `a` / `button` / `img` / `h1`〜`h3` / `dialog` などに直接指定がある（モックのまま）。そのため **`silver.css` は `SilverLayout.astro` だけが読み込み、`base.css` と同じページに載せない**。Astro はCSSをページ単位でまとめるので、`/downsizing` には `silver.css` が入らない。
- フォームが `base.css` に頼っていた部品（`.btn`、`.link`、`.muted`、`.todo`、`.visually-hidden`、`[hidden]`、`.t-lead`）は `form-support.css` に移した。`base.css` は変更前と同じ見た目（ピクセル単位で一致を確認済み）。
- フォームの配色は、`silver.css` の末尾で `:root` のトークン（`--pine` など）を上書きして合わせている。`:root` で上書きするのは、`tokens.css` の派生トークン（`--btn-primary-bg: var(--pine)`）が同じ要素で解決されるため。フォームの見た目を変えたいときはこのブロックを触る。
- `silver.css` の先頭コメントに、モックからの変更点を書いてある。モックを更新して取り込み直すときは、そこを見て同じ変更を当てる。

### 取り込み時の変更点

- 電話ボタンはモックの `<button data-phone>`（押すと「番号は未確定」のモーダル）から、`tel:` リンク（`data-cta`）にした。番号は `site.ts` の1か所。
- 予約ボタンは `data-booking`。押すとダイアログ（`#booking-dialog`）が開き、中に共通フォームが入っている（`cta.ts` が `<dialog>` を検出して `showModal()` する）。
- モック独自の予約フォーム、情報ダイアログ（ポリシー用）、`[...]` のダミー値は外し、`{{TODO}}` で表示される `site.ts` の値に置き換えた。
- Google Fonts をやめ、Newsreader（イタリック追加）を自前ホストにした。
- 画像はPNG（合計約10MB）から WebP（約1MB）に変換して `public/images/silver/` に置いた。元のPNGはリポジトリに入れていない。OG 画像 `public/images/og-silver.jpg` は hero 画像から切り出した仮のもの。
- 追従バー（モバイル下部の「Call us / Book a free appraisal」）は、モックどおり常時表示（Downsizing の「ヒーローを過ぎたら出る」挙動にはしていない）。

### 公開前に確認が必要なもの（ダミーのまま取り込み済み）

- スタッフ3名（名前・顔写真）：モックの生成画像。実在のスタッフ名に見えるため、使ってよいか確認する
- お客様の声3件、★5.0、「25 years」「A company of BuySell Technologies Inc.」「Paid same day」、競合比較の表
- 価格帯「$3,300 – $4,400」（「illustrative」と注記あり）
- 画像はすべて生成画像（「Illustrative photography」と表示）
- 画面上部と下部の「DESIGN PREVIEW」帯は `silver.astro` の `showPreviewStrip` で消せる
- フォーム、電話番号、営業時間、登録番号、OCCC、ポリシーのURLなどは Downsizing と同じ未確定事項（`npm run todos`）

## 仕様からの変更点

### 9/25 要件定義書に合わせた点

| 項目 | 実装 |
|---|---|
| メインの問い合わせ手段 | 主ボタンはすべて電話（`tel:`）：ヘッダー、ファーストビュー、中間CTA、最後の申込みセクション、スマホの追従バー。ボタンには電話番号を表示し、直後に「Appraisal only is fine…」と受付時間（CT）を置いた。フォームは補助で、ヘッダーの「Book a consultation」とファーストビューの「Request a visit online」から開く |
| コールトラッキング | ツール未定。電話番号は `site.ts` の1か所から出力し、`data-phone-number` を付けているので、番号差し替え型のツールがそのまま使える。タップは `cta_click`（`method: phone`）で計測 |
| TCPA 同意 | フォームに電話・SMSでの連絡への同意チェックボックスを追加。初期値はオフ、送信の必須条件にはしていない。文言は法務確認待ちで TODO |
| 法定表記 | テキサス州の登録番号をヘッダー・会社情報・フッターに表示。フッターに OCCC の連絡先欄と「Do not sell or share my personal information」リンクを追加 |
| ZIP 判定 | フォームの郵便番号欄を ZIP code（5桁）にし、入力すると対応エリアかどうかを表示。対象の ZIP 一覧（`site.ts` の `zipPrefixes`）が未確定なので、今は TODO を表示 |

ファーストビューに補助ボタン（フォーム）が並ぶのは、デザインシステムの「ファーストビューのボタンは1つ」から外れている。9/25 要件定義書の「電話CTA（大）＋オンライン予約（副）」を優先した。

### 米国向けに直したコピー

| 仕様 | 実装 |
|---|---|
| You decide afterwards. | You decide afterward. |
| Now you know its value, … | Now that you know its value, … |
| …at a time that suits you. | …at a time that works for you. |
| Postcode or area | ZIP code |
| Tableware and ornaments | Tableware and decorative items |
| Jewellery and watches | Jewelry and watches |
| A shelf or cupboard | A shelf or cabinet |
| licence number | Texas registration No. |
| 0120-000-000 | (800) 000-0000 |

### 仕様にないため追加した文言（下書き）

Request a visit online / Or send us a request online / Calls answered {hours}. / ZIP の説明とエリア判定の文言 / How should we reach you? / エラー文言 / プライバシー同意文 / (optional) / Sending your request… / 送信失敗時の文言 / Don't see your area? Call us and we'll check. / Company information / フッターのリンク名 / Skip to main content。

## 計測

`window.dataLayer` に push する。`site.ts` の `analytics.gtmId` を設定すると GTM のタグを読み込む。

| event | パラメータ |
|---|---|
| `cta_click` | `location`: `header` / `hero` / `mid` / `final` / `sticky` / `company`、`method`: `phone`（電話）/ `form`（フォームを開く） |
| `faq_open` | `question_id` |
| `form_start` | フォームへの最初の入力 |
| `form_submit` | `lp`（送信成功時。Silver は `silver`） |

UTM パラメータ（`utm_source` / `utm_medium` / `utm_campaign` / `utm_term` / `utm_content`）は、フォームの hidden 項目に入れる。

## 未確定の事業情報

`npm run todos` で一覧を出せる。画面上では点線の枠で表示される。主なもの：

- 会社名、住所、テキサス州の登録番号、営業時間、電話番号
- OCCC の連絡先と、必要な表記の文言
- 対応エリア、エリア判定用の ZIP 一覧
- 出張費・査定料、支払い方法とタイミング、買い取った品の行き先（FAQ）
- 買取できる品目と例、できない品目（カテゴリとフォームの選択肢）
- 申込み後の連絡までの営業日数
- TCPA 同意の文言
- フォームの送信先（`src/scripts/submit.ts` の `submitConsultation()`。今は console に出力して完了画面を表示する）
- プライバシーポリシー・利用規約・個人情報販売拒否のページの URL
- GTM コンテナ ID、コールトラッキングツール
- ファーストビューの写真と OG 画像（今は無地のプレースホルダー）、ロゴ
- 公開ドメイン（`astro.config.mjs` の `site`）
