# REWORTH 出張買取LP 制作仕様書（Claude Code向け）

Nov 20, 2026 · @Kota Onishi

## 概要

質屋で品物を売ろうとしている人に、出張買取という選択肢を示して申込み（電話・WEB）につなげる英語LPを、既存の REWORTH シルバーLPと同じトンマナで新規制作する。下の「確認が必要な事項」のうち、支払いタイミングの件は制作前に必ず決める必要がある。

| 項目 | 内容 |
| --- | --- |
| ブランド | REWORTH（BuySell America, Inc.） |
| 買取方法 | 出張買取（house call） |
| 言語 | 英語（米国向け） |
| ターゲット | 質屋で品物を売ろうとしている人。持ち込みの手間、店頭で断りにくいこと、提示額が妥当か分からないことに不安がある |
| CTA | 電話発信と WEB 申込みフォームの併用 |
| 訴求の軸 | 持ち込み不要 / 委託ではなく買取 / 幅広い品目をまとめて買う総合買取 |
| 表現上の制約 | 「質屋に行かないで」と直接書かない。質屋を名指しで比較しない |
| トンマナ | [REWORTH シルバーLP](https://reworth-buysell.com/silver) に合わせる |

文中の【要確認】は事実が未確定の箇所、（仮）は仮置きの文言。

## 確認が必要な事項

最優先は 1 の支払いタイミング。参考LPでは「訪問時には買い取らない。売却を決めたら翌日に集荷（または発送）し、支払いは銀行振込」と明記されており、構成案の「その場で支払う（即金）」と食い違う。どちらかに揃えないと LP 内の Hero・選ばれる理由・流れ・FAQ がすべて変わる。

| # | 確認事項 | 影響する箇所 | 仮置き |
| --- | --- | --- | --- |
| 1 | 支払いタイミングと方法。即金が可能か、参考LPと同じ「翌日集荷・銀行振込」か | Hero、選ばれる理由、比較表、流れ、FAQ | 即金が不可なら「委託ではなく買取。売却確定後すぐ振込」に言い換える |
| 2 | 買取品目。添付画像の品目（食器、楽器、コイン・切手、美術品・骨董品など）とアパレルが、この地域で実際に買えるか。参考LPは宝飾品、金貨、ブランドバッグ、時計、カメラのみ記載 | 買取品目、FAQ | 添付画像の品目＋アパレル |
| 3 | 対応エリア。参考LPと同じテキサス（ダラス・フォートワース、プレイノ、ヒューストン、ザ・ウッドランズ）か | Hero、FAQ、ZIP判定 | 参考LPと同じ |
| 4 | 比較表を載せるか、載せる場合の各セルの値。委託販売・店頭売却との比較は広告審査で確認が必要 | 比較表 | 値は空欄で枠のみ |
| 5 | 掲載URL・リポジトリ・技術スタック。既存サイトと同じリポジトリに追加するか | 実装全体 | 既存サイトと同じ構成で /（パス未定） に追加 |
| 6 | 申込みフォームの送信先と項目。既存LPのフォーム（氏名、ZIP、電話、メール、問い合わせ内容、SMS同意）を流用するか | フォーム | 既存フォームを流用 |
| 7 | 電話番号。既存の (877) 745-7677 か、計測用の別番号か | 全CTA | 既存番号 |
| 8 | 計測。GTM コンテナは既存と同じか、コンバージョンとして送るイベント名 | 計測 | 既存GTM、電話タップとフォーム送信をイベント化 |
| 9 | 素材。Hero写真、査定員写真、品目アイコンを既存から流用するか、新規撮影・制作か。添付のアイコンにはアパレルと「ブランド品」用がない | Hero、買取品目 | 既存素材を流用、アパレルのアイコンは新規 |
| 10 | 想定流入元と検索広告のキーワード。「pawn shop」系キーワードで出稿するか、noindex にするか | Hero、メタ情報 | 検索広告、noindex |
| 11 | フォント。参考サイトのCSSを取得できなかったため、使用書体は未確認 | デザイン全体 | 既存サイトのCSSを Claude Code に確認させる |

## トンマナ・デザイン

[REWORTH シルバーLP](https://reworth-buysell.com/silver) と同じブランドに見えることを最優先にする。落ち着いた温かいトーンで、売り込み感を出さず「あなたのペースで、選ぶのはあなた」という姿勢を保つ。

**文体（参考LPから読み取れる特徴）**

- 短い文で、二人称（you / your）で語りかける
- 見出しは前半を通常体、後半を斜体にする構成（例: Keep the silver at home. *We'll handle the rest.*）
- 各セクションの上に大文字の小見出しと番号を置く（例: 01 / THE SILVER YOU HAVE）
- Hero 直下に安心材料を短いチップで並べる（Free appraisal / No obligation / We come to you など）
- 煽り表現、最上級、カウントダウンなどの緊急性訴求は使わない

**配色（添付の品目アイコン画像から抽出）**

| 用途 | 色 |
| --- | --- |
| 背景（クリーム） | #FFF8ED |
| 文字・線・主ボタン（ダークグリーン） | #074731 |
| アクセント（マスタード） | #F3CA6B |
| カード背景（ピンク） | #F2D6D0 |
| カード背景（ミント） | #D9E8E0 |
| カード背景（ライトブルー） | #E8F1F7 |
| カード背景（オレンジ） | #F1A771 |

参考サイト本体の CSS 変数と照合し、差があればサイト側の値を優先する。

**写真・イラスト**

- 写真: 明るい室内で、スーツと白手袋の査定員がルーペで品物を見ている構図（参考LPの Hero と同系統）
- アイコン: 添付画像のスタイル。ダークグリーンの太めの線、パステル塗り、角丸カードに品目名
- 足りないアイコン: Brand items（バッグ以外も含む表現に）、Apparel

**レイアウト**

- ヘッダー固定。ロゴ、ページ内リンク、電話ボタン、Book online ボタン
- SP では画面下部に Call us / Book a free appraisal の固定バー
- 申込みフォームはモーダルで開く（参考LPと同じ挙動）

## ページ構成

8セクション構成。文言は英語で、そのまま実装に使う。即金に関わる文言は確認事項 1 の結果で差し替える前提で、該当箇所に【要確認 #1】を付けている。

### 1. Hero

役割: 自宅で売れて、すぐ支払われることを一目で伝える。

- Eyebrow: AT YOUR HOME. AT YOUR PACE.（仮）
- Headline: Sell from home. *Get paid right away.*（仮）【要確認 #1】
- Sub: Our appraiser visits your home and buys a wide range of items at once.（仮）
- Chips: Free appraisal / No obligation / We come to you / We buy, not consign
- CTA: Call (877) 745-7677 / Book online
- 写真: 自宅で査定員がルーペで品物を見ている写真

### 2. Reasons to choose us

役割: 選ぶ理由を3つに絞って示す。

- Eyebrow: 01 / THE REWORTH WAY
- Headline: Three reasons to *sell with us.*（仮）
- No need to carry anything: Our appraiser comes to you. Nothing to carry to a shop.
- We buy, not consign: We purchase your items outright and pay you right away. No waiting for someone else to buy them.【要確認 #1】
- One visit, many items: We buy a wide range of items, so you can sell everything in one appointment.

### 3. How we compare

役割: 委託販売・店頭売却との違い（手間と支払いまでの期間）を具体的に示す。質屋の名指しはしない。

- Eyebrow: 02 / A SIMPLER WAY TO SELL
- Headline: How we *compare.*（仮）
- 列: In-home buyout (REWORTH) / Consignment / In-store selling
- 行: Bringing items / When you get paid / Items accepted / Fees / If you decide not to sell
- セルの値【要確認 #4】

### 4. Mid CTA

役割: この時点で決めた人を取りこぼさない。

- Headline: Curious what it's worth? *Let's find out.*
- Sub: Free to ask. No obligation to sell.
- CTA: Call / Book online

### 5. Items we buy

役割: 自分の品物が対象かを確認してもらう。

- Eyebrow: 03 / WHAT WE BUY
- Headline: More than you *might think.*（仮）
- カード（添付画像のアイコンスタイル）: Brand items / Apparel / Watches / Jewelry and accessories / Tableware / Cameras / Musical instruments / Coins and stamps / Art and antiques / Other belongings you would like us to assess
- 補足: Not sure whether something qualifies? Show us. We're happy to take a look.
- 品目の可否【要確認 #2】

### 6. How it works

役割: 申込みから支払いまでの流れを示して不安をなくす。

- Eyebrow: 04 / SIMPLE, FROM START TO FINISH
- Headline: How a house call *works.*
- Step 1 Make a little time: Call or book online. Pick a time that suits you.
- Step 2 We'll take a look: We appraise your items at your home, right in front of you.
- Step 3 The choice is yours: Hear the offer. Ask your questions. There's no fee and no obligation to sell.
- Step 4 Get paid: If you decide to sell, we pay you right away.【要確認 #1】

### 7. FAQ

役割: 申込み前の疑問を解消する。アコーディオン形式。

- Is this consignment? When do I get paid?【要確認 #1】
- Is the appraisal really free?（参考LPと同じ回答）
- What happens if I decide not to sell?（参考LPと同じ回答）
- What ID will I need?（参考LPと同じ回答）
- Can a family member be there during the visit?（参考LPと同じ回答）
- Which areas do you cover?【要確認 #3】

### 8. Final CTA

役割: 今すぐの申込みを促す。

- Eyebrow: A FREE APPRAISAL, AT YOUR TABLE.（仮）
- Headline: See what your things are worth. *Let's take a look.*（仮）
- Sub: Free to ask. No obligation to sell.
- CTA: Call (877) 745-7677 / Book online

## 機能要件

既存の REWORTH サイトの実装（コンポーネント、フォーム、計測）を流用し、新規に作るのはこのLP固有のセクションだけにする。

| 項目 | 要件 |
| --- | --- |
| 電話CTA | `tel:` リンク。ヘッダー、Hero、Mid CTA、Final CTA、SP固定バーに配置 |
| WEB申込み | Book online ボタンでモーダルのフォームを開く。項目・同意文・送信先は既存LPと同じ【要確認 #6】 |
| ZIP判定 | 既存LPの対応エリア判定を流用【要確認 #3】 |
| 計測 | 既存GTMを読み込む。電話タップ、フォームを開く、フォーム送信完了をイベントとして送る【要確認 #8】 |
| メタ情報 | title、description、OGP を新規に設定。noindex の要否【要確認 #10】 |
| レスポンシブ | SP優先。375px幅で崩れないこと。PCは最大幅を既存LPに合わせる |
| アクセシビリティ | Skip to main content リンク、画像の alt、見出し階層、フォームのラベル、キーボード操作でモーダルを開閉できること |
| 表示速度 | 画像は WebP、ファーストビュー以外は遅延読み込み |
| JavaScript 無効時 | フォーム部分に既存LPと同じ案内文を表示 |

## 必須表記・NG表現

必須表記は既存LPのフッター・フォームと同じものを、文言を変えずに流用する。公開前に法務・広告審査部門の確認を受ける。

**必須表記（既存LPから流用）**

- 運営会社名、所在地、電話番号、問い合わせメールアドレス
- テキサス州の登録番号と、テキサス州 OCCC の名称・連絡先（ヘッダーとフッター）
- Privacy policy / Terms of use / Do not sell or share my personal information へのリンク
- フォームの SMS 受信同意文、18歳以上である旨の確認文、機微情報を書かないよう求める注意書き
- BuySell Technologies のグループ会社である旨

**NG表現**

- 「質屋に行かないで」など、質屋の利用を直接止める表現
- 質屋や他社を名指しした比較、他社を下げる表現
- 根拠のない最上級・比較表現（best、highest prices、No. 1 など）
- 買取価格の保証や、具体的な金額の約束
- 支払いタイミングの表現（on the spot、instant cash など）は確認事項 1 が決まるまで確定させない

## Claude Code への依頼文

確認事項が埋まったら、この仕様書を Markdown で書き出してリポジトリに置き、次の文面で依頼する。

```text
REWORTH の出張買取LPを新規に作成してください。仕様は docs/lp-house-call-spec.md にあります。

進め方:
1. まず既存の /silver ページの実装を読み、使っているフレームワーク、CSS変数（色・フォント・余白）、共通コンポーネント（ヘッダー、フッター、フォームモーダル、SP固定バー、FAQアコーディオン）、GTMの読み込み方を一覧にして報告してください。コードはまだ書かないでください。
2. 仕様書の配色と既存のCSS変数に差があれば、既存側を優先する前提で差分を報告してください。
3. 報告を確認したら、仕様書の8セクションを既存コンポーネントを流用して実装してください。新規に作るのは比較表と品目カードだけにしてください。
4. 文言は仕様書の英語をそのまま使い、【要確認】の箇所は TODO コメントを残して仮の文言で実装してください。
5. 必須表記（フッター、登録番号、フォームの同意文）は既存ページから文言を変えずに流用してください。
6. 完成したら、375px と 1280px の幅でスクリーンショットを撮り、/silver と並べてトンマナの差を報告してください。
```
