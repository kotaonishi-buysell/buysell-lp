# Home Appraisal LPs

訪問査定・リセール事業の米国（テキサス）向け英語LP。今あるのは次の3本。

- **Downsizing LP（`/downsizing`）**：共通の部品とデザインシステムで組んだ型。残りの3本（Declutter / Parents' belongings / Brand goods）は、コンテンツファイルを1つ足せば同じ部品で作れる構成にしてある。
- **Silver LP（`/silver`）**：Codex で作ったモックを取り込んだ、専用ページ・専用CSSのLP。フォーム・計測・会社情報だけ共通。詳しくは [Silver LP](#silver-lp-silver)。
- **Home Value LP（`/home-value`）**：専用ページ・専用CSS・専用デザイン仕様のLP（初期実装）。フォーム・計測の部品は共通。詳しくは下の「新LP: Home Value」。

## 新LP: Home Value

- URL: `/home-value`。既存の `/` → `/downsizing` は維持します。
- 文言・事業設定・制作メモ: [src/content/lps/home-value/](src/content/lps/home-value/README.md)
- 機能・コピー要件: [home-value.en.md](docs/requirements/home-value.en.md)
- 専用ページ: `src/pages/home-value.astro`（既存LPのダミー情報・フォーム送信スタブを読み込まない）
- 新デザイン仕様: [Home Value DESIGN_SYSTEM.md](docs/design/home-value/DESIGN_SYSTEM.md)
- 開発ルール: [AGENTS.md](AGENTS.md)
- 専用スタイル: `src/styles/home-value.css`（`body[data-lp="home-value"]` に限定）
- 写真の配置先: `public/images/home-value/`。現在は仮イラスト10点を表示しています。

同じAstroアプリ内で新LP専用のページとフォームを管理します。
電話番号未設定時は発信できない表示にし、送信先未接続のフォームは希望日時のローカル入力確認だけを行います。正式な受信先の了承前に送信完了や予約確定を表示しません。
確認済みの無料査定・出張費無料、1点からの訪問、Dallas–Fort Worth対応、購入完了後3営業日以内の振込を反映しています。未確定の公開条件は制作メモに記録しています。

- 仕様：Home Appraisal LPs — Build Specification（2026-10-07）
- デザイン仕様はLPごとに独立して管理します（[一覧](docs/design/README.md)）。
- 仕様と食い違う点は「LP要件定義書（簡易版）」（2026-09-25）に合わせた（[仕様からの変更点](#仕様からの変更点)）

## LPごとのデザインシステム

| LP | 仕様 |
|---|---|
| `/downsizing` | [Downsizing DESIGN_SYSTEM.md](docs/design/downsizing/DESIGN_SYSTEM.md) |
| `/home-value` | [Home Value DESIGN_SYSTEM.md](docs/design/home-value/DESIGN_SYSTEM.md) |
| `/silver` | [Silver DESIGN_SYSTEM.md](docs/design/silver/DESIGN_SYSTEM.md) |

色・フォント・写真・角丸・レイアウトは各LPの仕様で個別に決めます。
Home Value と Silver は専用のCSSとページを使います。問い合わせフォームと計測は全LP共通です。見た目の変更は対象LPに限定します。

## 使い方

Node.js 22.12 以上。

```sh
npm install
npm run dev      # http://localhost:4321/downsizing
npm run build    # dist/ に静的ファイルを出力
npm run preview  # build 結果を確認
npm run check    # 型チェック（astro check）
npm run todos    # 未確定の事業情報（TODO）の一覧
npm test         # 共通フォームの入力チェック、送信処理、受付サーバーのテスト
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
  content/company.ts     全LP共通の会社情報（唯一の入力元）：ブランド名、会社名、グループ名、住所、受付電話、営業時間、OCCC登録番号・表記。未確定は null
  content/site.ts        Downsizing / Silver 用：company.ts から組み立てた会社情報に、対応エリア、法定リンク、共通UI文言、GTM を加えたもの。company.ts が null の項目は {{TODO}} 表示
  content/lps/*.ts       LPごと：meta、ボタン文言、セクションの並び順と全コピー、FAQ、フォームの選択肢
  content/lps/index.ts   LPの一覧（1件 = 1ページ /<slug>）。Silver は専用ページなのでここには入れない
  content/lps/silver.ts  Silver：meta、フォーム文言、FAQ
  content/types.ts       コンテンツの型
  components/            仕様の section 4 の部品（1部品1ファイル）＋ PhoneButton / CtaGroup / Section
  layouts/Document.astro    全LP共通の HTML（meta、OG、LocalBusiness 構造化データ、GTM、共通スクリプト）。CSS は読まない
  layouts/BaseLayout.astro  Document ＋ tokens / base / form-support（Downsizing 系）
  layouts/SilverLayout.astro  Document ＋ tokens / form-support / silver.css（base.css は読まない）
  pages/[slug].astro     content/lps/*.ts の sections を順に描画
  content/contact-form.ts   全LP共通：問い合わせフォームの送信先、英語の共通文言、SMS同意の仮文言
  components/ContactForm.astro  全LP共通の問い合わせフォーム（スキンはLPごと）
  lib/contact-form.ts    フォームの入力チェック・整形・送信処理（テスト済み）
  pages/silver.astro     Silver のページ本体（Codex のマークアップ）
  scripts/               ブラウザ側の処理（計測、フォーム、追従バー、FAQ、ZIP判定）
  scripts/silver.ts      Silver 専用の動き（カテゴリのリボン、スクロール演出、FAQ の開閉）
  components/ZipCheck.astro  全LP共通のZIP確認の欄（動作は scripts/zip-check.ts、判定は lib/zip-area.ts）
  server/contact.ts      フォームの受付サーバー（確認し直し、迷惑メール対策、メール通知）
netlify/functions/       Netlify Functions（POST /api/contact）。設定は netlify.toml
public/images/           OG 画像（仮）、silver/ は Silver の画像（WebP）
```

- 文言はすべて `src/content/` にあり、部品にはコピーを直書きしていない。
- Downsizingの色・サイズ・角丸は `tokens.css` の変数を参照します。Home Valueは独立した `home-value.css` と専用ページを使用します。

### LP を追加するには

1. `src/content/lps/downsizing.ts` をコピーし、`slug`・`scene`（`move` / `sort` / `memory` / `brand`）・コピー・`sections` の並び順を書き換える。
2. `src/content/lps/index.ts` の `landingPages` に追加する。
3. `docs/design/<slug>/DESIGN_SYSTEM.md` を作成し、`docs/design/README.md` に登録する。
4. 他LPへ影響しない専用スタイルを用意する。既存LPのデザインを自動的に引き継がない。

`scene` を変えると、ヘッダー・ファーストビュー・引用帯・最後の申込みセクションの背景色が切り替わる。`brand` では文字・リンク・フォーカスリング・主ボタンが反転する（濃い背景で pine が読めないため）。フォームの入力欄は、どのLPでも明るいパネルの上に置いている。

### 問い合わせフォーム（全LP共通）

項目、入力チェック、送信処理、送信先は全LPで共通です。見た目（色・余白・角丸）と、見出し・送信ボタン・送信後のメッセージなど少数の文言だけをLPごとに決めます。送信は全LPで同じ **Netlify Forms**（フォーム名 `contact`）に集まり、通知は Netlify の画面で設定します（メールを関数から送る方式にも切り替えられます）。公開先は Netlify です。設定手順は [docs/forms/contact-form.md](docs/forms/contact-form.md) を見てください。

## Silver LP（`/silver`）

Codex で作ったモック（`BuySell-Silver-source-2026-10-20`）を取り込んだ、デザインの違う3本目。共通の部品に載せ替えず、**見た目はモックのまま**にして、フォーム・計測・会社情報だけ共通にしてある。

### 何が共通で、何が別か

| | |
|---|---|
| 共通 | 問い合わせフォーム（`ContactForm`、入力チェック、UTM、送信、迷惑メール対策、SMS同意。[docs/forms/contact-form.md](docs/forms/contact-form.md)）、ZIP確認の欄（`ZipCheck`、対象ZIPは `site.ts`。DFWとヒューストンの都市圏の756件を、`scripts/build-service-area-zips.mjs` で生成）、計測（`cta_click` / `faq_open` / `form_start` / `form_submit`）、会社名・電話・営業時間・住所・登録番号・OCCC（`company.ts`）、法定リンク（`site.ts`）、`<head>`・GTM・構造化データ（`Document.astro`） |
| 別 | ページのマークアップ（`pages/silver.astro`）、CSS（`styles/silver.css`）、画像、スクロール演出などの動き（`scripts/silver.ts`） |
| 文言の置き場所 | meta・フォームの送信ボタンなど少数の文言・ZIP欄・FAQ は `content/lps/silver.ts`。それ以外の見出し・本文は `silver.astro` に直接書いてある（専用レイアウトで、他LPに流用しないため） |

### CSS が他とぶつからないようにしている仕組み

- Silver のCSSは `body` / `a` / `button` / `img` / `h1`〜`h3` / `dialog` などに直接指定がある（モックのまま）。そのため **`silver.css` は `SilverLayout.astro` だけが読み込み、`base.css` と同じページに載せない**。Astro はCSSをページ単位でまとめるので、`/downsizing` には `silver.css` が入らない。
- フォームが `base.css` に頼っていた部品（`.btn`、`.link`、`.muted`、`.todo`、`.visually-hidden`、`[hidden]`、`.t-lead`）は `form-support.css` に移した。`base.css` は変更前と同じ見た目（ピクセル単位で一致を確認済み）。
- 共通フォームの見た目は、`silver.css` の末尾にある `[data-lp='silver']` のブロック（`--cf-*` 変数）で、Silver の配色（アイボリー、緑、角なし）に合わせている。フォームの見た目を変えたいときはこのブロックを触る。リンクや TODO の表示など `form-support.css` の部品は、同じファイルの `:root` のトークン上書きで合わせている。
- 予約ダイアログ（`<dialog id="booking-dialog">`）の中に共通フォームを入れている。ボタンの `data-booking` で開き、`cta.ts` が最初の入力欄にフォーカスする。
- `silver.css` の先頭コメントに、モックからの変更点を書いてある。モックを更新して取り込み直すときは、そこを見て同じ変更を当てる。

### 取り込み時の変更点

- 電話ボタンはモックの `<button data-phone>`（押すと「番号は未確定」のモーダル）から、`tel:` リンク（`data-cta`）にした。番号は `company.ts` の1か所。
- 予約ボタンは `data-booking`。押すとダイアログ（`#booking-dialog`）が開き、中に共通フォームが入っている（`cta.ts` が `<dialog>` を検出して `showModal()` する）。
- モック独自の予約フォーム、情報ダイアログ（ポリシー用）、`[...]` のダミー値は外し、`{{TODO}}` で表示される `company.ts` / `site.ts` の値に置き換えた。
- Google Fonts をやめ、Newsreader（イタリック追加）を自前ホストにした。
- 画像はPNG（合計約10MB）から WebP（約1MB）に変換して `public/images/silver/` に置いた。元のPNGはリポジトリに入れていない。OG 画像 `public/images/og-silver.jpg` は hero 画像から切り出した仮のもの。
- 追従バー（モバイル下部の「Call us / Book a free appraisal」）は、Downsizing と同じく、ヒーローを過ぎたら出て、最後の申込みセクションで隠れる（`scripts/sticky.ts` を共用。モックは常時表示）。

### 公開前に確認が必要なもの（ダミーのまま取り込み済み）

- スタッフ3名（名前・顔写真）：モックの生成画像。実在のスタッフ名に見えるため、使ってよいか確認する
- お客様の声3件、「25 years」「A company of BuySell Technologies Co. Ltd.」「Paid next day」
- 競合比較の表：一般的な説明に書き換え済み（出典と確認すべき点は [docs/design/silver/COMPARISON_SOURCES.md](docs/design/silver/COMPARISON_SOURCES.md)）。公開前に法務の確認が必要（画面に TODO が出ます）
- Google の評価（★）と価格帯（$3,300–$4,400）は削除済み。価格・評価の数字は載せない
- 画像はすべて生成画像（「Illustrative photography」と表示）
- 画面上部と下部の「DESIGN PREVIEW」帯は `silver.astro` の `showPreviewStrip` で消せる
- フォーム、電話番号、営業時間、登録番号、OCCC、ポリシーのURLなどは Downsizing と同じ未確定事項（`npm run todos`）

## 仕様からの変更点

### 9/25 要件定義書に合わせた点

| 項目 | 実装 |
|---|---|
| メインの問い合わせ手段 | 主ボタンはすべて電話（`tel:`）：ヘッダー、ファーストビュー、中間CTA、最後の申込みセクション、スマホの追従バー。ボタンには電話番号を表示し、直後に「Appraisal only is fine…」と受付時間（CT）を置いた。フォームは補助で、ヘッダーの「Book a consultation」とファーストビューの「Request a visit online」から開く |
| コールトラッキング | ツール未定。電話番号は `company.ts` の1か所から出力し、`data-phone-number` を付けているので、番号差し替え型のツールがそのまま使える。タップは `cta_click`（`method: phone`）で計測 |
| TCPA 同意 | フォームに SMS 同意のチェックボックスを置いた。初期値はオフ、送信の必須条件にはしていない。同意の有無・日時・文言を保存する。文言は仮で、法務確認待ち（[共通問い合わせフォーム](docs/forms/contact-form.md)） |
| 法定表記 | テキサス州の登録番号をヘッダー・会社情報・フッターに表示。フッターに OCCC の連絡先欄と「Do not sell or share my personal information」リンクを追加 |
| ZIP | フォームの郵便番号欄を ZIP code（5桁、または ZIP+4）にした。対応エリアの判定は、対象の ZIP 一覧が未確定のため行っていない |

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

Request a visit online / Or send us a request online / Calls answered {hours}. / ZIP の説明 / エラー文言 / (optional) / Sending your request… / 送信失敗時の文言 / Don't see your area? Call us and we'll check. / Company information / フッターのリンク名 / Skip to main content。

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

- 会社名、住所、OCCC の登録番号、営業時間、電話番号、OCCC の連絡先と必要な表記の文言（すべて `src/content/company.ts` に入力する。全LPに反映される）
- 対応エリア（エリア判定をするなら、対象の ZIP 一覧も）
- 出張費・査定料、支払い方法とタイミング、買い取った品の行き先（FAQ）
- 買取できる品目と例、できない品目（カテゴリとフォームの選択肢）
- 申込み後の連絡までの営業日数
- SMS 同意の文言（今は仮。`src/content/contact-form.ts`）
- Netlify Forms の通知の設定（Netlify の「Forms」→「Form notifications」で、通知先のメールを追加）。メールを関数から送る方式を使う場合は、Netlify の環境変数 `RESEND_API_KEY` `CONTACT_TO_EMAIL` `CONTACT_FROM_EMAIL` と、Resend の送信元ドメインの認証
- プライバシーポリシー・利用規約・個人情報販売拒否のページの URL
- コールトラッキングツール（GTM コンテナ ID は設定済み）
- ファーストビューの写真と OG 画像（今は無地のプレースホルダー）、ロゴ
- 公開ドメイン（`astro.config.mjs` の `site`）と、Netlify へのサイトの作成
