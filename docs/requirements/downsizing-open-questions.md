# Downsizing LP（`/downsizing`）：公開前に、事業側へ確認すること

Downsizing は今、**下書き**です（本番では 404）。公開するには、次の6問への回答が必要です。いずれも、私（開発側）が作り話で埋めてはいけない事業の事実です（AGENTS.md：品目、エリア、料金などを作らない）。

回答は、末尾の「回答用テンプレート」に書き込んで返してください。わからない項目は、「未定」で構いません。その場合の暫定の扱いを、各項目に書きました。

作成日：2026-11-12 ／ 状態を確認したコミット：`af7a316`（main）

## 先に決めてほしいこと：公開するか

**Downsizing（引っ越しの整理）、Home Value（持ち物の価値を知る）、公開中の Appraisal（使っていない物を家で査定）は、提案の重なりが大きい**です。3本とも、「家で、無料で、品物を査定する」提案です。入口の違いは、引っ越し／整理／価値を知る、だけです。

- 3本とも公開する場合は、広告ごとに入口を使い分ける想定か、教えてください。
- 公開しない場合は、Q1〜Q5 に答える必要はありません。

## 質問

### Q1. ヒーロー写真と OG 画像（SNS で共有されたときの画像）
- **現状：** ヒーローは、空の箱に「TODO: hero photo」と出ています。OG 画像は、3KB の無地の仮のものです。
- **必要なもの：** 次のどれかを、決めてください。
  1. 自社で撮影した写真（引っ越し前の、半分荷造りされた明るい部屋、など）
  2. ライセンスを確認できる写真（出典とライセンスを教えてください）
  3. Home Value のような、オリジナルのイラスト（フッターなどに「Illustration.」と注記します）
- **サイズ：** OG 用に 1200×630。ページ用は、横 1200px 以上。
- **注意：** 他社の LP の画像は使えません。生成画像は、「Illustrative photography.」などの注記が必要です。
- **未定の場合：** 公開できません（空の箱が見えるため）。

### Q2. 買取できる品目と、その例
- **現状：** カテゴリ名は、フォームから取った下書きです。**例は、5件とも空です。**

  | カテゴリ（下書き） | 例 |
  |---|---|
  | Furniture and antiques | 未定 |
  | Tableware and decorative items | 未定 |
  | Jewelry and watches | 未定 |
  | Bags and clothing | 未定 |
  | Art and collectibles | 未定 |

- **必要な回答：**
  - カテゴリは、この5つで正しいか。足す、外す、名前を変えるものがあれば、教えてください。
  - 各カテゴリの例を、3〜5個ずつ。
- **注意：** ここに載せた品物は、「買い取れる」と読まれます。実際に買い取る品物だけを書いてください。「査定はできるが、買取は品物による」ものは、例に入れないでください。
- **未定の場合：** カテゴリ名だけを載せ、例を出さない形にできます（私が対応できます）。

### Q3. 買取できない品目
- **現状：** 見出し「We can't accept」の下が、空です。
- **必要な回答：** 買い取れない品目（例：大きすぎる家具、状態の悪い物、法律で買えない物）を、具体的に。
- **未定の場合：** 見出しごと削除できます。ただし、「If you're unsure whether we can take something, ask anyway.」の一文は、残します。

### Q4. 買い取った品物の行き先（FAQ「What happens to the things I sell?」）
- **現状：** 回答が空です。
- **必要な回答：** 事実に基づく1〜2文。たとえば、どう再販するか（自社のオンライン販売、店舗、オークション、グループ会社経由など）。
- **注意：** 海外（日本など）で販売する場合は、その旨を書くかどうか、決めてください。お客様の期待に関わります。
- **未定の場合：** この FAQ 項目を削除できます。

### Q5. 申込みから連絡までの営業日数
- **現状：** フォームの下の文が、「We'll call or email within **TODO** business days…」です。
- **参考：** Silver は、事業側の回答で「**3営業日**」と確定しています。
- **必要な回答：** 3営業日が、全 LP 共通の答えか。共通なら、Downsizing と、現在この約束を載せていない Gold と Home Value にも、同じ文を入れます。
- **未定の場合：** 日数を載せない文にします（「We'll call or email to arrange a time.」）。

### Q6. 対応エリア（Houston）
- **現状：** LP ごとに、言っていることが違います。

  | LP | 内容 |
  |---|---|
  | Silver | Dallas–Fort Worth と Houston の ZIP を対象と判定する。「Dallas–Fort Worth、Plano、Houston、The Woodlands」と表示 |
  | Downsizing（FAQ） | 「Dallas–Fort Worth and Houston metropolitan areas」を訪問する |
  | Gold | Houston は「coming soon」（以前の「December から」は、未確認のため削除） |

- **必要な回答：** 今日の時点で、Houston は訪問していますか。していない場合は、いつからですか。
- **注意：** サービスを提供していない地域を、提供しているように見せない（Downsizing と Silver の表示の見直しが必要になる可能性があります）。
- **併せて：** Downsizing の FAQ に、「Enter your ZIP code on this page」とありますが、Downsizing には ZIP の確認欄がなく、問い合わせフォームの ZIP 欄があるだけです。「Send us your ZIP code and we'll tell you if we come to your area.」に直すことを、提案します。

## 参考：公開済みの LP にも、同種の未確認が残っています
- **Appraisal（公開中）：** `appraisal.ts` に、「各カテゴリの範囲を事業側と確認する」「『そのまま置いておく』が、すべてのカテゴリで正しいか、査定担当者に確認する」という TODO が残っています。Q2 の回答は、Appraisal の確認にも使えます。
- 事業側が確認できていない品目や、お客様への案内が、すでに公開されている可能性があります。優先して確認してください。

## 回答用テンプレート

```
Q1 写真: （1 自社撮影 / 2 ライセンス写真（出典: ） / 3 イラスト / 未定）
Q2 カテゴリ:
  - Furniture and antiques の例:
  - Tableware and decorative items の例:
  - Jewelry and watches の例:
  - Bags and clothing の例:
  - Art and collectibles の例:
  - 追加・削除・名前の変更:
Q3 買取できない品目:
Q4 買い取った品物の行き先（1〜2文）:
Q5 連絡までの営業日数: （3 / 別の日数: / 未定）
   3営業日は全LP共通か: （はい / いいえ）
Q6 Houston: （訪問している / していない。開始時期: ）
公開するか（Downsizing / Home Value / Appraisal との使い分け）:
```

## 回答をもらったあとに私がやること
| 回答 | 反映する場所 |
|---|---|
| Q1 | `src/content/lps/downsizing.ts`（hero の `image` と `ogImage`）、画像を `public/images/` に追加 |
| Q2、Q3 | `downsizing.ts` の `categories` と `notAccepted` |
| Q4 | `downsizing.ts` の FAQ「resale」 |
| Q5 | `downsizing.ts` の `form.afterSubmit`（と、共通なら `gold.ts` ほか） |
| Q6 | Downsizing の FAQ「area」と、必要なら Silver の表示 |

反映後は、ページを `src/draft-pages/` から `src/pages/` に移し、`astro.config.mjs` の該当行を消します。公開前の確認（`npm run check:public`、登録の表示、支払いの表現、ブラウザでの確認）は、公開済みの LP と同じです。
