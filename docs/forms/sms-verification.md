# SMS（トールフリー番号）の審査に出す内容

問い合わせ番号 (877) 745-7677 から SMS を送るための、キャリア審査（Trust center → Toll-free number registration）で使う資料です。

## 同意を取る画面（"Consent form on our website"）

- **URL：`https://reworth-buysell.com/sms`**（`http` ではなく `https`。`/` は `/silver` に転送され、フォームがダイアログの中にあるため、審査には出さない）
- ログイン不要で、開いてすぐ同意チェックボックスが見える公開ページです（`src/pages/sms.astro`、文言は `src/content/sms-consent.ts`）。
- チェックボックスは初期オフ。オフでも送信できます（同意は条件ではない）。
- 文言に入っているもの：送信者（REWORTH / BuySell America, Inc.）、メッセージの種類、月の上限（10通）、料金、同意は条件ではない、STOP / HELP、Terms と Privacy へのリンク。
- 同意の有無・日時・画面に出した文言は、送信ごとに Netlify Forms に保存されます（同意の証跡）。

## 審査フォームに書く内容（英語）

**Use case / Message content**

> REWORTH (operated by BuySell America, Inc.) offers free in-home appraisals of gold, silver, jewelry and watches in Texas. We send text messages only to people who tick the opt-in box on our request form at https://reworth-buysell.com/sms. The messages are replies to the customer's inquiry, scheduling and reminders for the appraisal visit, and, if the customer decides to sell, follow-up about the sale (for example, collecting the items). We do not send advertising or promotional text messages. Up to 10 messages per month per person. Every message identifies REWORTH, and customers can reply STOP to opt out or HELP for help.

**Sample messages**

1. `REWORTH: Thanks for your request. We can visit for a free appraisal on {date}, {time window}. Reply YES to confirm, or call (877) 745-7677. Reply STOP to opt out.`
2. `REWORTH: Reminder: your appraisal visit is {date}, {time window}. Questions? Call (877) 745-7677. Msg&data rates may apply. Reply STOP to opt out, HELP for help.`
3. `REWORTH: Thank you for choosing to sell. We will collect your items on {date}. Questions? Call (877) 745-7677. Reply STOP to opt out.`

（サンプルに支払いの時期や、訪問でその場で買い取る表現を入れない：`src/content/purchase-flow.ts` の規則。）

**Monthly volume**：実際の送信見込みに合わせて選ぶ。1人あたりの上限は10通。

## 送信側で必要なこと

- STOP / HELP への自動応答（STOP、CANCEL、END、QUIT、UNSUBSCRIBE）。送信サービスの標準機能で有効にする。
- STOP した番号には送らない。チェックしていない人には送らない。
- 広告・販促の内容は送らない（Terms と Privacy に「広告には使わない」と書いてある）。

## 却下されたとき（既知のリスク）

キャリアは通常、「携帯番号と SMS 同意を第三者にマーケティング目的で共有しない」という記載を Terms / Privacy に求めます。このサイトは Google と Meta の広告タグを使うため、**その約束はしていません**（事業の判断）。却下の理由がこれだったら、`src/content/legal.ts` の該当 `// TODO`（Privacy の "Text messages"）と `formDataToAdvertisers`、Google の Enhanced conversions・Meta の Advanced matching の設定を合わせて見直してください。
