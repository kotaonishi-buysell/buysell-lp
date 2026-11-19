# Gold LP 第2案（gold-v2）のデザイン

`/gold-v2` は、Figma で作られた Gold LP のデザイン（ファイル「バイセルUS_GOLD_LP」、フレーム `SP_W390_A`、幅390px）を、`/gold` とは別に新しく作ったLPです。**`/gold` には一切手を入れていません。** 他のLPのデザインシステムは使いません。**見た目の正本は Figma と `src/styles/gold-v2.css` です。**

- Figma：ファイルキー `D9ezRBg2LGvlPx8KS3D7xY`、フレーム `29:412`（`SP_W390_A`）
- **下書き（draft）です**。公開サイトには出ません。`astro dev`、`npm run build:drafts`、Netlify のデプロイプレビュー（PR のプレビュー）でだけ、`/gold-v2` が見えます。公開するときは、`src/draft-pages/gold-v2.astro` を `src/pages/` に移し、`astro.config.mjs` の `draftRoutes` から行を消します（README を参照）。

## スマホ幅だけ
Figma にはスマホ幅（390px）のデザインしかありません。そのため、**PC でも同じスマホ幅の1列**で表示します。

- 列の幅は最大 430px で、中央に置きます（`.g2-page`）。390〜430px の画面では伸縮し、それより広い画面では、左右に背景色（`--outer` `#EFE8DA`）が出ます。
- `gold-v2.css` に、画面幅で変わるルール（`@media (min-width / max-width)`）は書きません（`tests/gold-v2.test.mjs` が確認します）。`/gold` の PC 用の拡大（`--pc-zoom`）もありません。
- 追従バーも、この列の幅の中に収まります。

## 実装
- ページ：`src/draft-pages/gold-v2.astro`、レイアウト：`src/layouts/GoldV2Layout.astro`（`base.css`、`silver.css`、`gold.css` は読み込まない）。
- スタイル：`src/styles/gold-v2.css`（`GoldV2Layout` 以外から読み込まない）。クラス名はすべて `g2-` で始めます（共通の `form-support.css` が `.btn` などを持つため）。
- 動き：`src/scripts/gold-v2.ts`（メニュー、「What we buy」の前へ・次へボタン、追従バー）。自動で動くものはありません。共通の `main.ts`（電話・予約ボタン、FAQの計測、フォーム）も動きます。
- 文言：meta・フォーム文言・売買の流れの文は `src/content/lps/gold-v2.ts`。それ以外の見出し・本文は `gold-v2.astro` に直接書いてあります。
- 問い合わせフォームは、全LP共通の `ContactForm` です。見た目は `gold-v2.css` の `[data-lp='gold-v2']` ブロック（`--cf-*` 変数）で、Figma の茶色と白に合わせています。
- 電話・住所・登録番号・OCCC・グループ名は `company.ts` から出します。フッターには、Privacy、Terms、Do not sell or share の3つのリンクを置きます。

## 色・書体（`gold-v2.css` の `:root`）
Figma の画面から色を読み取りました。`/gold` のチャコール `#2E2E3A` ではなく、**濃い茶色**が主役です。

| 変数 | 値 | 用途 |
|---|---|---|
| `--brown` | `#382C11` | 見出し、ボタン、エリアのカード |
| `--gold` | `#C9A86A` | お知らせ帯、ヒーローのボタン、会社と申込みの背景、カードの枠 |
| `--cream` | `#FBF7F0` | 手順のカード、安心・FAQ・フッターの背景 |
| `--text` | `#4A4A55` | 本文 |
| `--sand` | `#EAE1CD` | 写真が入る前の空の枠 |
| `--serif` / `--sans` | Instrument Serif / Open Sans | 見出し / 本文（`/gold` と同じ自前ホスト） |

## セクション（Figma のフレームとの対応）
| 順 | セクション | Figma | 備考 |
|---|---|---|---|
| 1 | お知らせ帯・ヘッダー・ナビ・ヒーロー・アイコン3つ・登録番号 | `115:4` FV | ロゴは中央。ヒーローのボタンは金色 |
| 2 | 4つの手順 | `29:638` Process | 縦に4枚（`/gold` のカルーセルではない） |
| 3 | Who we are | `29:632` company | 金色の背景 |
| 4 | What we buy（品目のカルーセル）と案内 | `29:572` buy item | 前へ・次へのボタンつき（自動送りなし） |
| 5 | 安心の4つ | `29:531` benefit | |
| 6 | 訪問エリア | `29:489` area | 「Send us your ZIP code」は、申込みフォームへ移動するボタン |
| 7 | よくある質問 | `29:470` Q&A | |
| 8 | 申込み（電話とフォーム） | `29:425` Contact Form | 共通フォーム |
| 9 | フッター | `29:415` Footer | |
| - | 追従バー | `54:1409` Floating Bar | ヒーローのボタンと申込みフォームが見えている間は隠す |

`/gold` の「画像だけの流れるバー（mq）」「PC 用の2列レイアウト」「手順のアニメーション」「比較表」は、Figma にないため含めていません。

## 写真（空の枠）
Figma から書き出した写真は、まだありません。**すべての写真の枠は、空です**（砂色の背景。ヒーローは茶色のグラデーション）。写真が届いたら、`public/images/gold-v2/` に置き、該当の `<figure class="g2-photo" data-slot="…">` の中に `<img>`（`alt` つき）を入れます。

| `data-slot` | 場所 | 表示サイズ | 書き出しの目安（2倍） |
|---|---|---|---|
| `hero` | ヒーローの背景（下はクリームへ薄くなる） | 幅いっぱい × 480px | 780 × 960 |
| `how-1` 〜 `how-4` | 手順の写真 | 340 × 160 | 680 × 320 |
| `company` | Who we are（オフィスの写真） | 342 × 192 | 684 × 384 |
| `item-chains`、`item-rings`、`item-earrings`、`item-broken`、`item-gold`、`item-watches`、`item-silver` | 品目のカード | 224 × 224 | 448 × 448 |

- WebP で書き出してください。`company`（オフィスの写真）は、使用許諾の確認が必要です。
- 写真がすべて生成画像の場合は、フッターの「Images are for illustration.」を残します。

## 公開前に確認が必要なもの
- 写真の書き出しと配置（上の表）。
- 申込み後の連絡までの営業日数（今は日数を約束しない文。`gold-v2.ts` の `// TODO:`）。Figma も日数を書いていません。
- 買取できる品目の一覧（Figma のカードは、チェーン、指輪、イヤリング、壊れたもの、時計、スターリングシルバー）。
- 訪問までの日数、保険の表記（今は載せていません）。
- 「Do I need an ID?」の答え（今は `/gold` と同じ「売る場合は、はい。テキサス州法で、顔写真つきのIDの確認が必要」）。
- 共通フォームの SMS 同意文は、共通の最新版です。Figma の画面にある文より長くなります。
- OG 画像は、`/gold` と同じ仮のもの（`og-gold.jpg`）です。

## 編集のルール
- gold-v2 の見た目の変更は、`gold-v2.css` と `gold-v2.astro` の中だけで行い、他のLPのスタイルに影響させない。
- 共通のCSS（`tokens.css`、`form-support.css`、`contact-form.css`）を変えたときは、すべてのLPを確認する。
