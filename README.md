# Home Appraisal LPs

訪問査定・リセール事業の米国（テキサス）向け英語LP。**Downsizing LP（`/downsizing`）** と **Home Value LP（`/home-value`、初期実装）** を同じAstroアプリで管理します。

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

色・フォント・写真・角丸・レイアウトは各LPの仕様で個別に決めます。
Home Valueは専用CSS・部品・フォーム・計測を使用します。見た目の変更は対象LPに限定します。

## 使い方

Node.js 22.12 以上。

```sh
npm install
npm run dev      # http://localhost:4321/downsizing
npm run build    # dist/ に静的ファイルを出力
npm run preview  # build 結果を確認
npm run check    # 型チェック（astro check）
npm run todos    # 未確定の事業情報（TODO）の一覧
npm run test:home-value # 希望日時フォームと送信境界の機能テスト
```

`/` は `/downsizing` へリダイレクトする（`astro.config.mjs`）。公開ドメインが決まったら `site` を差し替える（canonical と OG 画像の URL に使う）。

## 構成

```
src/
  styles/tokens.css      デザイントークン。仕様のブロックをそのまま貼り、足りない値は下の Additions に追加
  styles/base.css        リセット、文字スタイル（.t-display-xl など）、レイアウト、ボタン
  styles/fonts.css       自前ホストのフォント（public/fonts/、OFL）
  content/site.ts        4LP共通：会社情報、電話、営業時間、対応エリア、法定表記、共通UI文言、GTM
  content/lps/*.ts       LPごと：meta、ボタン文言、セクションの並び順と全コピー、FAQ、フォームの選択肢
  content/lps/index.ts   LPの一覧（1件 = 1ページ /<slug>）
  content/types.ts       コンテンツの型
  components/            仕様の section 4 の部品（1部品1ファイル）＋ PhoneButton / CtaGroup / Section
  layouts/BaseLayout.astro  head（meta、OG、LocalBusiness 構造化データ、GTM）
  pages/[slug].astro     content/lps/*.ts の sections を順に描画
  scripts/               ブラウザ側の処理（計測、フォーム検証、追従バー、FAQ）
  scripts/submit.ts      submitConsultation()：フォーム送信のスタブ
public/images/           OG 画像（仮）
```

- 文言はすべて `src/content/` にあり、部品にはコピーを直書きしていない。
- Downsizingの色・サイズ・角丸は `tokens.css` の変数を参照します。Home Valueは独立した `home-value.css` と専用ページを使用します。

### LP を追加するには

1. `src/content/lps/downsizing.ts` をコピーし、`slug`・`scene`（`move` / `sort` / `memory` / `brand`）・コピー・`sections` の並び順を書き換える。
2. `src/content/lps/index.ts` の `landingPages` に追加する。
3. `docs/design/<slug>/DESIGN_SYSTEM.md` を作成し、`docs/design/README.md` に登録する。
4. 他LPへ影響しない専用スタイルを用意する。既存LPのデザインを自動的に引き継がない。

`scene` を変えると、ヘッダー・ファーストビュー・引用帯・最後の申込みセクションの背景色が切り替わる。`brand` では文字・リンク・フォーカスリング・主ボタンが反転する（濃い背景で pine が読めないため）。フォームの入力欄は、どのLPでも明るいパネルの上に置いている。

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
| `form_submit` | `lp`（送信成功時） |

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
