# 外部制作LPの納品仕様

制作会社さま向けの資料です。作っていただいたLPを、弊社のリポジトリに新しいLPとして取り込み、既存のLPと同じドメインのサブディレクトリ（`/<slug>`）で公開します。

既存のLPは次のとおりです（状態は 2026-11-16 時点）。

| LP | URL | 状態 |
|---|---|---|
| Silver | `/silver` | 公開中 |
| Gold | `/gold` | 公開中 |
| Appraisal | `/appraisal` | 公開中 |
| Downsizing | `/downsizing` | 公開中（2026-11-19 から。事業側の回答待ちの部分は外してある） |
| Home Value | `/home-value` | 公開中（2026-11-19 から） |

プライバシーポリシー・利用規約・個人情報の販売／共有の拒否（`/privacy` `/terms` `/do-not-sell`）は、全LP共通の1組のページです。

**取り込んだLPは、PR（変更の提案）のデプロイプレビュー（本番とは別の URL）で確認し、公開前のチェックを通ってから、マージして公開します**（本書の 6.）。マージするまでは、本番には出ません。
**問い合わせフォームは弊社の共通フォームを使います。** フォームのHTML・入力チェック・送信は弊社側で組み込むため、制作側では作らないでください。見た目（色・形）だけ、このLPに合わせて決めていただきます。

`<slug>` は URL になる英小文字とハイフンの名前です（例：`brand-goods`）。着手前に弊社と決めます。

## 1. 納品していただくもの

| # | 納品物 | 内容 |
|---|---|---|
| 1 | `index.html` | 1ページ完結の静的HTML。コピー（本文）はここに直接書く |
| 2 | `styles.css` | このLP専用のCSS（1ファイル。分割する場合も弊社が結合できる形で） |
| 3 | `script.js` | このLP専用の動き（任意。アコーディオン、スクロール演出など）。ライブラリを使うときは事前に相談 |
| 4 | `assets/` | 画像・フォント。画像は WebP（または SVG）、フォントは自前ホスト（`woff2`）でライセンス表記つき |
| 5 | `form-skin.css` | フォームの配色・形の指定（本書 3.2 のCSS変数だけを書く） |
| 6 | `DESIGN_SYSTEM.md` | 色・フォント・余白・角丸・画像の方針（弊社の `docs/design/<slug>/` に置きます） |
| 7 | `NOTES.md` | 未確定の事業情報の一覧、画像の出典とライセンス、動作確認した環境 |

フレームワーク（React、Vue、Next など）は使わず、**素のHTML・CSS・JavaScript** でお願いします。弊社は Astro で配信しているため、HTMLを取り込んで載せ替えます（Silver、Gold、Appraisal は、同じ方法で取り込みました）。

## 2. 弊社の側でやること（制作側は気にしなくてよいこと）

- `<head>`（title、description、OG、canonical、構造化データ、GTM）は弊社の共通レイアウトが出力します。**`<head>` の内容はこちらで差し替える**ので、`index.html` に計測タグや meta を入れないでください（title と description の案は `NOTES.md` に書いてください）。
- **計測と広告のタグ**（Google Tag Manager のほか、その中の Google 広告、GA4、Meta Pixel、Microsoft Clarity）は、弊社が共通の仕組みで入れます。訪問者が「オプトアウト」したときや、ブラウザが Global Privacy Control を送っているときに止める処理も、弊社側です。**制作側では、計測・広告・チャット・地図などの外部サービスを、足さないでください。** 新しい外部サービスを足すと、法務ページ（プライバシーポリシーなど）の修正が必要になるためです。
- フォーム（`ContactForm`）を、指定の位置に差し込みます。「18歳以上」の確認文、SMS 同意、メッセージ欄の注意書きは、フォームに含まれます。
- 電話番号・会社名・住所・メール・登録番号・OCCC の連絡先は `src/content/company.ts` の共通の値（法定リンクは `src/content/site.ts`）を使います。**営業時間は、今は公開していません**（記号は空になることがあります）。
- フォームの送信先は、弊社の受付の関数です（Google スプレッドシートに保存し、受け取れないときは Netlify Forms に切り替わります。`docs/forms/contact-form.md`）。制作側のサーバーや外部フォームサービスは使いません。

## 3. フォームについて

### 3.1 置き場所の指定
フォームを置く場所に、次のコメントとコンテナを書いてください。弊社が中身を差し込みます。

```html
<section id="request" aria-labelledby="request-title">
  <h2 id="request-title">（見出し）</h2>
  <p>（フォームの前の説明）</p>
  <div class="form-panel">
    <!-- CONTACT_FORM -->
  </div>
</section>
```

- 見出し、説明、パネルの背景や余白は制作側で自由に決められます。フォームの中身（項目、ラベル、エラー文言、ボタンの動き）は変えられません。
- 「予約する」「問い合わせる」ボタンは `href="#request"` のページ内リンクにしてください。ダイアログ（モーダル）に入れたい場合は事前に相談してください（Silver は専用の仕組みを使っています）。
- 送信ボタンの文言（既定：`Send my request`）と、ボタンの下の一文、送信後のメッセージは、`NOTES.md` に案を書いてください。弊社が渡します。
- 送信ボタンのクラスは `.button` を想定しています。ボタンのCSSは制作側で `.form-panel .button` として定義してください。

### 3.2 フォームの配色と形（`form-skin.css`）
フォームは、次のCSS変数で見た目が決まります。`[data-lp="<slug>"] :is(.cf, .cf-success)` に値を入れてください（`<slug>` は決まり次第）。

```css
[data-lp="<slug>"] :is(.cf, .cf-success) {
  --cf-text: #1f2937;            /* 文字色 */
  --cf-muted: #6b7280;           /* 補足、(optional)、文字数 */
  --cf-border: #9ca3af;          /* 入力欄の枠線 */
  --cf-border-width: 1px;
  --cf-border-width-strong: 2px; /* エラー時の枠線 */
  --cf-input-bg: #ffffff;
  --cf-radius: 8px;
  --cf-accent: #0f766e;          /* チェックボックス、リンク */
  --cf-focus: #0f766e;           /* フォーカスリング */
  --cf-error: #b91c1c;
  --cf-surface: #f3f4f6;         /* 状態表示、送信後の背景 */
  --cf-gap: 16px;
  --cf-gap-sm: 6px;
  --cf-tap: 48px;                /* 入力欄の最小の高さ（44px以上） */
  --cf-pad-x: 14px;
  --cf-pad-y: 10px;
  --cf-checkbox: 22px;
  --cf-focus-width: 3px;
  --cf-focus-offset: 2px;
  --cf-weight-strong: 600;
}
```

数値は一例です。変数の一覧と意味は `src/styles/contact-form.css` の冒頭にあります。

### 3.3 確認のしかた
フォームの実物は、弊社が組み込んだあとでないと表示されません。制作中は、フォームのパネルに仮の入力欄（`.cf-input` 相当）を置いて、見た目の見当をつけてください。取り込み後、弊社が実物のスクリーンショットを共有します。調整が必要なら、`form-skin.css` の値だけ直していただきます。

## 4. 作るときの決まり

### デザイン・実装
- **ページ全体の見た目は自由です。** 既存LPの色・フォント・レイアウトに合わせる必要はありません。
- スマホで崩れないこと。幅 320px から 1440px で、横スクロールが出ないこと。
- キーボードだけで操作でき、フォーカスが見えること。文字は読みやすいコントラスト（本文 4.5:1 以上）にしてください。
- 画像には `alt`、`width`、`height` を付けます。ファーストビューの画像以外は `loading="lazy"`。
- 外部のCDN、Google Fonts、外部の画像、外部のスクリプトは使わないでください（読み込みが遅くなり、個人情報の扱いにも影響するため）。
- 計測タグ（GA、GTM、Meta Pixel など）は入れないでください。計測は弊社が共通の仕組みで入れます。
- ボタンや電話番号のリンクで計測したいものには、次の属性を付けてください。
  - 電話：`<a href="tel:{{PHONE_E164}}" data-cta="hero" data-cta-method="phone">`
  - フォームへの移動：`<a href="#request" data-cta="hero" data-cta-method="form">`
  - `data-cta` の値は、ボタンを置いた場所です（`header` / `hero` / `mid` / `final` / `sticky` から選ぶ）。`data-cta-method` は `phone` か `form` です。
- CSS は、このLPだけに効くようにしてください。`body[data-lp="<slug>"]` から始まるセレクターにするか、LP専用のクラス名にします。弊社の他のLPには読み込まれません。

### 文言・事業情報
弊社の方針で、次を守ってください。
- **料金、対応エリア、買取できる品目、電話番号、お客様の声、実績の数字を、作り話で書かないでください。** 確定していない事項は `{{TODO: 何が必要か}}` と書き、`NOTES.md` にも書いてください。
  - **公開ページには、TODO を出せません。** 弊社の公開前のチェック（`npm run check:public`）は、TODO が残っていると、公開用のビルドを失敗させます。TODO は、公開前に、事業側の回答で埋めるか、その文ごと外します。「約束にならない書き方」にできるものは、そう書き直します。
- **他社との比較、お客様の声、実績の数字、価格の例は、法務の確認が済むまで、公開できません。** 入れる場合は、ほかの部分と切り離した、独立したセクションにして、`NOTES.md` に明記してください（弊社が、確認が済むまで非表示にします）。お客様の声や価格の例を載せたい場合は、「架空の例」と画面に明記し、`NOTES.md` に書いてください。
- **対応エリアは、`{{SERVICE_AREA}}` と書いてください。** 地域名や都市名を、制作側で足さないでください。
- **訪問後の流れの表現は、全LP共通のルールに従ってください**（法務の指摘によるもので、`AGENTS.md` にも定めています）。
  - 書いてよい説明は、次のとおりです。**訪問は査定だけで、自宅では買い取りません。** 金額（査定額）は訪問先で伝える。売ると決めたら、翌日に品物を引き取りに伺う、または郵送してもらう。支払いは銀行振込で、**時期は書かない**。弊社の共通文言を使うので、`{{PURCHASE_FLOW}}` と書いてください（下の表）。
  - **「appraise and buy」「offer on the spot」「その場で買取」「Paid same day」「Paid next day」など、自宅で買い取る、または支払いの時期を約束する表現は書かないでください。** 弊社のテストが、公開ページにこれらが残っていないかを確認します。
  - **「写真を撮らない」「何も共有しない」と書かないでください。** テキサス州の買取業の規制で、本人確認書類と品物の記録が必要なためです。
  - 引き取りの料金、郵送の送料と手順は、まだ決まっていません。書かないでください。
- 電話番号と会社情報は、次の差し込み記号で書いてください。弊社が実際の値に置き換えます。

| 記号 | 内容 |
|---|---|
| `{{COMPANY_NAME}}` | 会社名 |
| `{{PHONE_DISPLAY}}` | 表示用の電話番号 |
| `{{PHONE_E164}}` | `tel:` リンク用の電話番号 |
| `{{ADDRESS}}` | 住所 |
| `{{EMAIL}}` | 連絡用のメール |
| `{{SERVICE_AREA}}` | 対応エリア（今は「Dallas–Fort Worth and Houston metropolitan areas, Texas」） |
| `{{HOURS}}` | 営業時間（**今は非公開**。空になることがあるので、営業時間の表示に依存しないでください） |
| `{{REGISTRATION_LABEL}}` `{{REGISTRATION_VALUE}}` | テキサス州の登録番号（取得済み）。**「登録済み」などの文は、制作側で書かず、この記号で出す** |
| `{{PRIVACY_URL}}` `{{TERMS_URL}}` `{{DO_NOT_SELL_URL}}` | 法定リンク（`/privacy` `/terms` `/do-not-sell`。全LP共通のページが実在します。業者は作らず、リンクだけ置く） |
| `{{PURCHASE_FLOW}}` | 訪問後の流れの文言（`src/content/purchase-flow.ts`） |

- ページは英語（米国向け）です。綴りは米国式にしてください（`jewelry`、`afterward` など）。
- 画像は、制作会社が権利を持つもの、またはライセンスが確認できるものだけを使ってください。**他社のLPの画像やレイアウトの流用はできません。**
- **生成画像を使う場合は、`NOTES.md` に、どの画像かを書いてください。** そのうえで、**実在のお客様、スタッフ、実際の訪問の写真に見える使い方をしないでください**（人物の顔写真に実在の名前を付ける、など）。画面に注記を出すかどうかは、弊社が判断して指示します。

## 5. 納品の方法
- ZIP（上記の構成）を、弊社が指定する共有場所に置いてください。
- リポジトリへの直接のプッシュはしていただきません。弊社が取り込み、確認用のURL（PR の Netlify のデプロイプレビュー）を共有します。**このURLは、本番とは別で、PR をマージするまで、本番には出ません。** ただし、URL を知っていれば、誰でも開けます。
- 修正のやりとりは、確認用URLを見ながら、箇所を指定して依頼する形にします。

## 6. 公開までの流れと、弊社が確認すること（参考）
1. **PR として取り込む。** デプロイプレビューのURLで、見た目と動きを確認します。
2. **未確定の事項を解消する。** `NOTES.md` の一覧を、事業側の回答で埋めます。回答が間に合わない部分は、ページから外します（公開ページに TODO を出せず、TODO が残ると、プレビューのビルドも失敗するため）。
3. **公開前のチェックを通す。**
   - `npm run check`、`npm run build`、`npm run todos`、`npm test`
   - **`npm run check:public`**：公開ページに TODO が残っていないこと（Netlify のビルドでも実行され、残っていると、デプロイが失敗します）
      - `/silver`、`/gold`、`/appraisal`、`/downsizing`、`/home-value`、`/sms`、法務ページ3つ、404 が生成されること。`/` が `/silver` へ転送されること
   - フォームの入力チェック、送信、Google スプレッドシートへの保存（と、予備の Netlify Forms への切り替え）。スマホ・PCの表示、キーボード操作、横スクロールなし
4. **公開する。** PR をマージします。

公開の前に、法務ページの弁護士の確認や、広告・計測の設定の確認が、別に必要になることがあります。

## 7. 弊社の側の取り込み手順（社内用メモ）
Silver、Gold、Appraisal と同じ方法です。詳しくは README の「Silver LP」と「公開と下書き」を参照してください。
0. **ブランチを切り、ページを `src/pages/` に置いて、PR にする。** PR のデプロイプレビューが、確認用のURL（本番とは別）になり、マージまで、本番には出ません。本番とは別に、手元だけで試したいときや、複数回に分けて作るときは、下書きの仕組みも使えます（`src/draft-pages/<slug>.astro` に置き、`astro.config.mjs` の `draftRoutes` に `{ pattern: '/<slug>', entrypoint: './src/draft-pages/<slug>.astro' }` を足す。`npm run dev` のときだけ出る。公開するときは、`src/pages/` に移し、この行を消す）。
1. `src/pages/<slug>.astro`：`index.html` の本文を移す。`<!-- CONTACT_FORM -->` を `<ContactForm lp="<slug>" company={...} buttonClass="button" ... />` に置き換える。差し込み記号を、`company.ts`、`site.ts`、`purchase-flow.ts` の値に置き換える（`{{EMAIL}}` は `company.email`、`{{SERVICE_AREA}}` は `site.serviceArea.summary`）。訪問後の流れ、登録の表示、比較・口コミ・実績の扱いが、上のルールに合っているかも確認する。
2. `src/layouts/<Name>Layout.astro`：`SilverLayout.astro` を元に作る。`tokens.css`、`form-support.css`、LP専用CSS を読み込み、**`base.css` は読まない**。`Document` に `bodyAttrs={{ 'data-lp': slug }}` を渡す。
3. `src/styles/<slug>.css`：`styles.css` と `form-skin.css`。`script.js` は `src/scripts/<slug>.ts` へ。
4. `src/content/lps/<slug>.ts`：meta とフォームの文言（送信ボタン、ボタン下の一文、送信後のメッセージ）。
5. `public/images/<slug>/`：画像とフォント。OG 画像も用意する。
6. `docs/design/<slug>/DESIGN_SYSTEM.md` を置き、`docs/design/README.md` に登録する。
7. `/` の転送は、今は `/silver`（`astro.config.mjs` と `netlify.toml`）。新LPで変えるかは、事業側と決める。
8. 既存の公開LP（Silver、Gold、Appraisal）と法務ページの見た目に変化がないことを確認する（共通CSSを触った場合）。Silver と Appraisal は `src/scripts/silver.ts` を共用しているので、このスクリプトを触るときは、両方を確認する。
9. 他社との比較、お客様の声が入っていたら、`src/content/lps/` に、非表示のフラグ（`enabled: false`、`legalApproved: null`）を作り、法務の承認まで出さない（`silver-comparison.ts` が例）。
10. 計測や外部サービスが、納品物に入っていないかを確認する。入っていたら、取り除く（法務ページの修正が必要になるため）。
