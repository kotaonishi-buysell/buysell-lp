# Google Tag Manager のコンテナ（GTM-PQQFZ723）の中身

2026-10-29 に、担当の方がエクスポートしたファイル（バージョン 4「Add Google tag (G-JP716WPFW5)」）を読んで、まとめました。**ここが変わったら、`src/content/legal.ts`（Privacy と Do Not Sell）も同じ変更で直してください。**

## 入っているタグ（3 つ）
| タグ | 内容 | いつ動くか | 開示した先 |
|---|---|---|---|
| **Meta Pixel**（Meta の変換 API テンプレート。ピクセル ID `1165360529397912`） | **広告**。Facebook・Instagram の広告の計測と、ページを見た人への広告配信 | ページの読み込み時（PageView）と、`dataLayer` の**すべてのイベント**（`gtm.` で始まるもの以外）。このサイトの `cta_click`・`faq_open`・`form_start`・`form_submit` が、そのまま Meta に送られる | Privacy「Who we share it with」、Do Not Sell |
| **Microsoft Clarity**（プロジェクト `z4tn5zttlx`） | 画面の操作の録画とヒートマップ（クリック、タップ、スクロール、マウスの動き）。ユーザー ID に、GA のクライアント ID を使う | 全ページ | Privacy「Information we collect」、Do Not Sell |
| **Google タグ**（GA4。`G-JP716WPFW5`） | アクセスの計測 | 全ページ（Initialization） | 同上 |

どのタグにも、同意の設定（Consent Mode）は付いていません（`NOT_SET`）。

## 反映したこと（このリポジトリ側）
- **Privacy / Do Not Sell の文面を、実態に合わせて書き直しました。** 以前は「広告タグはない。販売も共有もしない」と書いていましたが、Meta Pixel があるため、**「お金のための販売はしない。ただし広告・計測ツールが、Meta・Google・Microsoft に限られたデータを送る。州法によっては、販売・共有・ターゲティング広告にあたりうる。オプトアウトできる」**に変えました。
- **オプトアウトの仕組みを作りました。**
  - Do Not Sell のページのボタンで、そのブラウザでは、GTM（と、その中のすべてのタグ）を読み込まなくなります。タグが作ったクッキー（`_ga*`、`_gid`、`_fbp`、`_fbc`、`_clck`、`_clsk`）も消します。
  - ブラウザが **Global Privacy Control** を送っているときは、最初から GTM を読み込みません。
  - 仕組み：`src/lib/privacy-choice.ts`、`src/layouts/Document.astro`（GTM を読み込む前に判定）、`src/scripts/privacy-choice.ts`、`src/components/PrivacyChoice.astro`。
- **問い合わせフォームに `data-clarity-mask="True"` を付けました。** Clarity の録画で、フォームの入力内容（名前・電話・メール・メッセージ）は、設定にかかわらず、マスクされます。
- 法務ページ自体は、GTM を読み込みません（Home Value も、自前のページで GTM を読み込みません）。

## GTM 側で、担当の方にお願いしたいこと（コードでは直せません）
1. **Meta Pixel を本当に使うか。** 使わないなら、タグを削除するのが、一番簡単で安全です（広告の「共有」が、なくなります）。使うなら、広告の予算と目的に合わせて、送るイベントを絞ってください。今は、すべてのイベントが送られます。
2. **Clarity の設定：** 管理画面で、マスクのモードを「Strict」（すべての入力をマスク）にすることをおすすめします。
3. **同意の設定（Consent Mode）：** 必要に応じて、タグに同意の条件を付けてください。今のサイトの仕組み（オプトアウト）とは別に、より厳しい運用にしたい場合の選択肢です。
4. **タグを足す・変えるときは、先にこのファイルと `legal.ts` を直す**（広告系のタグは特に）。

## 確認していないこと
- 実際の送信内容（ネットワークの通信）は、このコンテナのファイルからは分かりません。本番で、ブラウザの開発者ツールで、Meta や Clarity に送られるデータを確認することをおすすめします。
- Meta Pixel の「詳細マッチング」が有効か（メールや電話番号のハッシュを送る設定）は、Meta 側の設定です。このサイトは、`dataLayer` に個人情報を入れていないので、GTM からは、送られないはずです。
