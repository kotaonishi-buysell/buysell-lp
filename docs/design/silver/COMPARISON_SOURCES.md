# Silver：競合比較の表と「Our view」の根拠

`src/pages/silver.astro` の「06 / A BETTER WAY」。**特定の会社ではなく、3つの業態の一般的な仕組み**を書いています。数字（手数料率や日数）は画面に出していません。

> 調査の限界：この環境では、出典のサイトを直接開けませんでした。下の内容は、検索結果の要約から得たものです。**公開前に、一次情報（出典のページ、各業態の実際の規約）で確認し、法務の確認を受けてください。** 画面には、確認が済むまで TODO を出しています。

## 自社（REWORTH）の列：事業の確定事項
| 行 | 画面の文言 | 根拠 |
|---|---|---|
| どこで査定するか | At your home | 訪問買取 |
| 運ぶ・梱包 | Nothing to pack or carry | 訪問買取 |
| 価格を聞く時 | At the visit, in front of you | 支払いルール（訪問先で金額を伝える） |
| 支払い | By bank transfer, by the end of the next day | 全LP共通の支払いルール（AGENTS.md）。週末・祝日で着金が遅れる注意書きあり |
| 断れるか | Yes. It's free, with no obligation | 査定は無料、売る義務なし |

## 他の業態の列：一般的な説明
| 行 | 画面の文言（要約） | 根拠と注意 |
|---|---|---|
| 質店：店で査定 / 持ち込み / カウンターで価格 / カウンターで支払い | At the shop / You bring the items in / Usually at the counter / Typically at the counter | 質店は店舗で、売却または質入れ（融資）を扱う。質入れは利息と返済期限がある。検索結果の要約：売却は店頭で完結、質入れは30〜90日など（州法による） |
| 質店：断れるか | Yes. Check the terms if you pawn instead of sell | 売却なら断れる。質入れは契約の条件を確認 |
| 通販買取（郵送）：施設で査定 / 梱包して発送 / 受領後に価格 / 承諾後に支払い（会社による） | At their facility / You pack and ship them / After they receive and inspect your items / After you accept their offer; timing varies | 郵送キットで送り、受領後に査定して提示するのが一般的。支払いの時期は会社により異なる（例：承諾が午後3時までなら当日、それ以降は翌営業日、という会社もある） |
| 通販買取：断れるか | Check the terms first: deadlines and return rules vary | 断ると返送される会社が多いが、期限と返送の条件は会社ごと。**米国下院の報告書（House Report 111-673、2010年）に、期限内に断らないと承諾とみなす業者の例**がある（一般論として「確認を」と書いた。特定の会社を悪く書いていない） |
| 遺品整理・エステートセール業者：自宅で査定 / 運ばない / 価格 / 支払い | Usually at your home / Usually not / Items are priced for the sale; a buyout may be offered / After the sale, often a few weeks later | 多くは委託販売（手数料制）で、売却後に精算。検索結果（Checkbook）の要約：手数料は売上に応じて30〜40%台、多くは売却の2〜3週間後に支払い。**買取（バイアウト）を行う会社もある**ため、「買取もありうる」と書いた |
| エステートセール：断れるか | A contract sets the fees and terms | 契約で手数料や条件を決める |

## 「Our view」の書き方
- 各業態が向く場面を、公平に書いています（質店は急ぎで現金、通販は送ってよい銀、エステートセールは家全体の片付けに向く）。
- 自社が向かない場面を書いています（家全体を1点ずつ売る場合は、エステートセールのほうが合うことがある）。
- 「Offers vary」「Many work on commission」など、断定を避ける言い方にしています。

## 出典（検索で見つけたもの。公開前に原文を確認）
- Checkbook（エステートセール）：https://www.checkbook.org/national/estate-sales/
- 米国下院報告書 111-673（貴金属の買取業者）：https://www.govinfo.gov/content/pkg/CRPT-111hrpt673/html/CRPT-111hrpt673.htm
- APMEX（銀製カトラリーの売り方）：https://learn.apmex.com/selling-guide/how-to-sell-silver-flatware/
- 質店の仕組み：テキサス州の質店のガイド記事（広告目的のサイトが多く、数字は参考。テキサス州 OCCC などの一次情報で確認する）

## 公開前の確認リスト
- [ ] 各業態の説明を、一次情報（規約、法令、出典の原文）で確認する
- [ ] 法務が、比較の表現を確認する（特定の会社を指さない、事実と一致、断定しすぎない）
- [ ] 「Paid next day」が実際の運用で守れる（週末・祝日の扱い）
- [ ] 確認後、`silver.astro` の TODO（「legal to confirm this comparison…」）を外す
