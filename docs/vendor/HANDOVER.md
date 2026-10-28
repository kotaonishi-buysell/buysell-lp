# 外部制作LPの納品仕様（4つ目のLP）

制作会社さま向けの資料です。作っていただいたLPを、弊社のリポジトリに **4つ目のLP** として取り込み、既存の3本（`/downsizing` `/home-value` `/silver`）と同じドメインのサブディレクトリ（`/<slug>`）で公開します。
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

フレームワーク（React、Vue、Next など）は使わず、**素のHTML・CSS・JavaScript** でお願いします。弊社は Astro で配信しているため、HTMLを取り込んで載せ替えます（Silver LP は同じ方法で取り込みました）。

## 2. 弊社の側でやること（制作側は気にしなくてよいこと）

- `<head>`（title、description、OG、canonical、構造化データ、GTM）は弊社の共通レイアウトが出力します。**`<head>` の内容はこちらで差し替える**ので、`index.html` に計測タグや meta を入れないでください（title と description の案は `NOTES.md` に書いてください）。
- フォーム（`ContactForm`）を、指定の位置に差し込みます。
- 電話番号・会社名・住所・営業時間・登録番号・法定リンク（プライバシー等）は `src/content/site.ts` の共通の値を使います。
- フォームの送信先は Netlify Forms（`docs/forms/contact-form.md`）。制作側のサーバーや外部フォームサービスは使いません。

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
- **料金、対応エリア、買取できる品目、電話番号、お客様の声、実績の数字を、作り話で書かないでください。** 確定していない事項は `{{TODO: 何が必要か}}` と書いてください。
- お客様の声や価格の例を載せたい場合は、「架空の例」と画面に明記し、`NOTES.md` に書いてください（弊社で可否を確認します）。
- 電話番号と会社情報は、次の差し込み記号で書いてください。弊社が実際の値に置き換えます。

| 記号 | 内容 |
|---|---|
| `{{COMPANY_NAME}}` | 会社名 |
| `{{PHONE_DISPLAY}}` | 表示用の電話番号 |
| `{{PHONE_E164}}` | `tel:` リンク用の電話番号 |
| `{{ADDRESS}}` | 住所 |
| `{{HOURS}}` | 営業時間 |
| `{{REGISTRATION_LABEL}}` `{{REGISTRATION_VALUE}}` | テキサス州の登録番号 |
| `{{PRIVACY_URL}}` `{{TERMS_URL}}` `{{DO_NOT_SELL_URL}}` | 法定リンク |

- ページは英語（米国向け）です。綴りは米国式にしてください（`jewelry`、`afterward` など）。
- 画像は、制作会社が権利を持つもの、またはライセンスが確認できるものだけを使ってください。**他社のLPの画像やレイアウトの流用はできません。** 生成画像を使う場合は、画面に「Illustrative」と分かる表記を入れてください。

## 5. 納品の方法
- ZIP（上記の構成）を、弊社が指定する共有場所に置いてください。
- リポジトリへの直接のプッシュはしていただきません。弊社が取り込み、確認用のURL（Netlify のデプロイプレビュー）を共有します。
- 修正のやりとりは、確認用URLを見ながら、箇所を指定して依頼する形にします。

## 6. 取り込み後に弊社が確認すること（参考）
- `npm run check`、`npm run build`、`npm run todos`、`npm test`
- `/downsizing`、`/home-value`、`/silver`、新LP の4つが生成されること。`/` が `/downsizing` へ転送されること
- 4つのLPのフォームで、入力チェック、送信、Netlify への保管
- スマホ・PCの表示、キーボード操作、横スクロールなし

## 7. 弊社の側の取り込み手順（社内用メモ）
Silver LP と同じ方法です。詳しくは README の「Silver LP」を参照してください。
1. `src/pages/<slug>.astro`：`index.html` の本文を移す。`<!-- CONTACT_FORM -->` を `<ContactForm lp="<slug>" company={...} buttonClass="button" ... />` に置き換える。差し込み記号を `site.ts` の値に置き換える。
2. `src/layouts/<Name>Layout.astro`：`SilverLayout.astro` を元に作る。`tokens.css`、`form-support.css`、LP専用CSS を読み込み、**`base.css` は読まない**。`Document` に `bodyAttrs={{ 'data-lp': slug }}` を渡す。
3. `src/styles/<slug>.css`：`styles.css` と `form-skin.css`。`script.js` は `src/scripts/<slug>.ts` へ。
4. `src/content/lps/<slug>.ts`：meta とフォームの文言（送信ボタン、ボタン下の一文、送信後のメッセージ）。
5. `public/images/<slug>/`：画像とフォント。OG 画像も用意する。
6. `docs/design/<slug>/DESIGN_SYSTEM.md` を置き、`docs/design/README.md` に登録する。
7. `astro.config.mjs` と `netlify.toml` の `/` の転送を見直す（必要な場合）。
8. 3つの既存LPの見た目に変化がないことを確認する（共通CSSを触った場合）。
