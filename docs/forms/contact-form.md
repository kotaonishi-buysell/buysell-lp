# 共通問い合わせフォーム

全LPで同じフォーム（項目・入力チェック・送信処理・送信先）を使います。見た目はLPごとに変えます。

## 項目（全LP共通）

| # | ラベル（画面は英語） | 種類 | 必須 | 入力チェックと保存 |
|---|---|---|---|---|
| 1 | First name | text、`autocomplete="given-name"` | 必須 | 文字（アクセント付き・各国の文字を含む）、スペース、ハイフン、アポストロフィ（`'` `’`）、ピリオドを許可。最初は文字。100文字まで。前後の空白を除き、途中の連続スペースは1つにする |
| 2 | Last name | text、`autocomplete="family-name"` | 必須 | 同上 |
| 3 | ZIP code | text、`autocomplete="postal-code"` | 必須 | 5桁、または ZIP+4（`12345-6789`）。ハイフンなしの9桁も受け付け、`12345-6789` に整える |
| 4 | Phone number | `type="tel"`、`autocomplete="tel"` | 必須 | 米国の10桁。`(555) 123-4567`、`555-123-4567`、`555.123.4567`、先頭の `1` や `+1` も許容。保存は数字のみ（10桁） |
| 5 | SMS 同意チェックボックス | checkbox | 任意 | 初期値はオフ。オフでも送信できる。同意の有無、チェックした日時、画面に出した文言を保存 |
| 6 | Email | `type="email"`、`autocomplete="email"` | 任意 | 入力したときだけ一般的な形式をチェック |
| 7 | How can we help you? | textarea | 任意 | 1,000文字まで。残り文字数を表示。前後の空白は保存時に除く |

ミドルネーム欄はありません。エラーメッセージは英語で、該当項目の直下に表示します。送信時にまとめてチェックし、1回送信を試した後は、入力中と欄を離れたときに再チェックします。

## 送信されるデータ

ブラウザは、共通の送信先へ次の内容を送ります（`function` モードではJSON、Netlify Forms モードでは同じ項目をフォーム形式で送ります）。

```json
{
  "lp": "downsizing",
  "firstName": "Maria",
  "lastName": "Lopez",
  "zip": "75201",
  "phone": "2145550123",
  "email": "",
  "message": "Need help with a few things",
  "smsConsent": true,
  "smsConsentAt": "2026-10-20T00:43:42.721Z",
  "smsConsentText": "I agree to receive text messages from ...",
  "submittedAt": "2026-10-20T00:43:42.754Z",
  "utm": { "utm_source": "google", "utm_medium": "cpc" },
  "honeypot": "",
  "elapsedMs": 9000
}
```

- `lp` でどのLPから来たかを区別します。
- `smsConsent` が `false` のとき、`smsConsentAt` と `smsConsentText` は `null` です。
- 日時はブラウザの時計によるUTCです。受け取る側でも、受信日時を記録してください。
- `utm` には `utm_source` `utm_medium` `utm_campaign` `utm_term` `utm_content` だけが入ります（他のパラメータは送りません）。
- `honeypot` と `elapsedMs` は迷惑メール対策です（下の「受付サーバー」を見てください）。

## 送信方法（3つのモード）

送信方法は、環境変数で切り替えます。値は `src/content/contact-form.ts` の `contactFormConfig` が読みます。全LPが同じ設定を使います。

| モード | 設定 | 動き |
|---|---|---|
| **自前の関数（`function`）＝今の設定** | `PUBLIC_CONTACT_ENDPOINT=/api/contact` と `PUBLIC_CONTACT_FALLBACK=netlify-forms`（どちらも `netlify.toml` に設定済み） | ブラウザが `/api/contact`（`src/server/contact.ts`）に送り、関数が確認し直して、**Google スプレッドシートに 1 行追加**します（メールの設定もあれば、メールでも通知）。関数が受け取れなかったとき（Google の設定が未完了、障害など）は、ブラウザが **Netlify Forms** に送るので、問い合わせは失われません。下の「Google スプレッドシートに保存する」を見てください。 |
| Netlify Forms のみ | `PUBLIC_CONTACT_MODE=netlify-forms` | ブラウザが、開いているページ自身のURLに、フォームの内容を送ります。Netlify が受け取って保管し、通知は Netlify の画面で設定します。`netlify.toml` の 2 行を、この 1 行に置き換えると、この方式に戻せます。 |
| プレビュー | どちらも未設定（手元のビルド） | 何も送信せず、「Preview only」と明示します。受付済みとは表示せず、計測の `form_submit` も出しません。 |

### Google スプレッドシートに保存する（直接送信）

問い合わせを、Netlify を経由せず、自前の関数から、Google スプレッドシートに 1 行ずつ追加します（`src/server/sheets.ts`）。Google のサービスアカウント（機械用のアカウント）でログインし、行を**追加するだけ**です（既存の行を読んだり、変えたりしません）。

**あなたが準備すること（最初の 1 回）**
1. Google Cloud（console.cloud.google.com）で、プロジェクトを作る（または、会社のものを選ぶ）。
2. 「API とサービス」→「ライブラリ」で、**Google Sheets API** を有効にする。
3. 「IAM と管理」→「サービスアカウント」で、サービスアカウントを作る（名前の例：`reworth-form`）。ロールは不要。
4. そのサービスアカウントの「鍵」→「鍵を追加」→「新しい鍵」→ **JSON** で、鍵のファイルをダウンロードする（**このファイルは、誰にも渡さず、リポジトリにも入れない**）。
5. 受け取り用のスプレッドシートを作る。タブ（シート）の名前は **Inquiries**（変えるときは、環境変数 `GOOGLE_SHEET_TAB`）。
6. 1 行目に、下の見出しを貼る（1 つのセルから、横に貼り付ける）。
7. スプレッドシートの「共有」で、サービスアカウントのメールアドレス（鍵のファイルの `client_email`）を、**編集者**として追加する。**ほかの共有は、必要な人だけにする**（電話・メール・SMS の同意記録が入ります）。
8. Netlify の「Site configuration」→「Environment variables」に、次の 3 つを登録する。
   | 名前 | 値 |
   |---|---|
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | 鍵のファイルの `client_email` |
   | `GOOGLE_PRIVATE_KEY` | 鍵のファイルの `private_key`（`-----BEGIN PRIVATE KEY-----` から `-----END PRIVATE KEY-----` まで。改行が `\n` と文字で入っていても動きます） |
   | `GOOGLE_SHEET_ID` | スプレッドシートの URL の `/d/` と `/edit` の間の文字列 |
9. サイトを公開し直す（再デプロイ）。
10. 確認：本番のフォームから、テストを 1 件送り、シートに 1 行増えること、`In service area` などの列が入ることを確かめる。確認用の行は、あとで消す。

**1 行目の見出し（この順番）**

```
Received at (UTC)	Landing page	First name	Last name	ZIP code	In service area	Phone	Email	Message	Text messages (SMS)	SMS agreed at (UTC)	SMS wording shown	Submitted at (UTC, visitor clock)	utm_source	utm_medium	utm_campaign	utm_term	utm_content
```

（`src/server/sheets.ts` の `SHEET_COLUMNS` と同じです。列の順番を変えると、行の中身とずれるので、**列を並べ替えない**でください。「連絡した」「結果」などのメモの列は、**右端（`utm_content` の右）に足してください**。）

**動き**
- ブラウザは、まず自前の関数に送ります。関数は、入力の再チェック、迷惑メール対策（見えない入力欄、入力までの時間、送信元の確認）をしたうえで、シートに追加します。シートが受け付けた後にだけ、「受付済み」と返します。
- 値は、すべて**文字として**保存します（`=` から始まるメッセージも、数式として動かず、電話番号の先頭の 0 も消えません）。
- 関数が**受け取れなかったとき**（Google の設定が未完了、通信の失敗、サーバーのエラー、時間切れ）は、ブラウザが Netlify Forms に送ります。そのため、**設定が終わる前でも、問い合わせは失われません**（今と同じ）。入力の誤りなど、関数が**断った**ときは、Netlify Forms には送らず、お客様に「送れませんでした」と出します。
- まれに、関数が受け取ったのに、返事が届かなかったときは、Netlify Forms にも、同じ問い合わせが入る（二重）ことがあります。問い合わせが失われるより、二重のほうが安全なので、この動きにしています。
- メール通知（`RESEND_API_KEY`、`CONTACT_TO_EMAIL`、`CONTACT_FROM_EMAIL`）も設定すると、シートとメールの両方に送ります。**どちらか一方でも成功すれば、受け付けます**。
- 鍵を替えるとき：Google Cloud で新しい鍵を作り、Netlify の `GOOGLE_PRIVATE_KEY` を差し替えて、古い鍵を削除します。

**個人情報について**
- シートに入る個人情報は、名前・ZIP・電話・メール・メッセージ・SMS 同意の記録です。共有範囲は、必要な人だけにしてください。
- Privacy Policy の「service providers」に、保管・フォーム処理の業者の区分が入っています（`legal.ts`）。シートの保存期間は、問い合わせの保存期間（TODO）と、そろえます。

### Netlify Forms で受け取る

- フォームの名前は `contact` で、**全LPで同じ**です。そのため、3つのLPの送信が、Netlify の「Forms」の同じ「contact」にまとまります。どのLPからかは、項目 `lp` で区別します。
- Netlify は、公開のたびに、ページのHTMLの `<form data-netlify="true">` を読んで、フォームと項目を登録します（フォーム検出を有効にしておく必要があります）。項目を足したり変えたりしたときは、公開し直してください。
- 送られる内容は、上の「送信されるデータ」と同じです（ブラウザが整形した値）。ただし形式は、フォームの送信と同じ `application/x-www-form-urlencoded` で、`smsConsent` は `yes` か `no`、迷惑メール対策の見えない欄は `homepage_url` です。
- 送信ボタンの上に、「By sending this request, you confirm that you are 18 or older.」を表示します（`ageNote`。サービスは18歳以上のみ。Privacy と Terms も同じ）。
- 自由記述欄（Message）の下に、注意書き「Please don't write ID numbers, bank account details or other sensitive information here.」を表示します（文言は `src/content/contact-form.ts` の `messageHint`。全LP共通）。
- 迷惑メール対策：見えない入力欄（`homepage_url`。ラベルの文字も置かないので、ページの文字を読み取るツールには見えません）は、Netlify のスパム対策（`data-netlify-honeypot`）として働きます。**この方法には、受付サーバーでの確認し直しや、「2秒未満の送信を断る」仕組みはありません。** Netlify 自身のスパムの判定に頼ります。
- 成功の判定：Netlify が 2xx を返したときに、画面に完了を表示します。Netlify がスパムとして捨てた送信にも 2xx を返すので、「届いた」ではなく「受け取られた」という意味です。2xx 以外や通信の失敗では、「We couldn't send your request」と表示し、入力は残します。

#### 設定と確認の手順
1. 変更を公開します（`main` へのマージ、またはデプロイプレビュー）。Netlify の「Forms」に、フォーム「contact」が現れます。出ない場合は、「Forms」で、フォーム検出が有効か確認し、公開し直します。
2. **通知を設定します。** 「Forms」→「Form notifications」→「Add notification」→「Email notification」で、通知先（`ko.onishi@buysell-technologies.com`）と、対象のフォーム「contact」を選びます。
3. 公開されたサイトのフォームに、ダミーの内容を入力して送信します。画面に完了のメッセージが出て、「Preview only」が出なければ、Netlify が受け取っています。
4. Netlify の「Forms」→「contact」→「Verified submissions」に、送信が表示されることを確認します。項目 `lp`、`phone`（数字だけ）、`zip`、`smsConsent` などが、正しく入っているか見てください。
5. 通知のメールが、設定した宛先に届くことを確認します。
6. Netlify の画面で、迷惑メールと判定されたものは「Spam submissions」に入ります。本物が入っていないかを、ときどき確認してください。

#### 注意
- 保管される場所と期間、件数の上限（無料の枠）は、Netlify のプランによります。公式の料金のページで確認してください。上限を超えると、受け取りが止まる場合があります。
- 個人情報が Netlify に保管されます。プライバシーポリシーへの記載の対象です。
- 「Netlify Forms のみ」のモードでは、受付サーバーの関数（`/api/contact`）は使いません。今の設定（自前の関数 ＋ 失敗時の Netlify Forms）では、この節の仕組みは**控え**として働きます：関数が受け取れなかった問い合わせだけが、ここに入ります。Netlify の「Forms」の通知設定は、そのまま使えます。

### 受付関数の契約（`function` モード）

- 送信先は `PUBLIC_CONTACT_ENDPOINT`（同じオリジンのパス、または `https://` のURL）です。
- 送信先は、成功時に **2xx と `{ "accepted": true }`** を返してください。それ以外（2xx以外、空の応答、JSONでない応答、`accepted` が `true` でない応答）は失敗として扱い、入力は残します。15秒でタイムアウトします。

## 受付サーバー（Netlify Functions）と通知メール（`function` モード）

`POST /api/contact` を受け付けるサーバー側の機能です。Netlify Forms モードでは使いません。受け取った内容を確認し直して、**チームにメールで通知**します。メールが送れたときだけ `{ "accepted": true }` を返します。

- 本体は `src/server/contact.ts`、Netlify との接続は `netlify/functions/contact.ts`、Netlify の設定は `netlify.toml` です。
- ブラウザの入力チェックとは別に、サーバーでも同じルールで確認し直します（`src/lib/contact-form.ts` を共有）。不正な内容は `400` で断ります。
- **迷惑メール対策**：
  - 見えない入力欄（`honeypot`）に何か入っていたら、ボットとみなします。成功したように応答して、メールは送りません。
  - ページを開いてから2秒未満で送信されたものは、断ります（`too_fast`）。人が操作すれば2秒以上かかるため、通常は起きません。
  - 同じオリジン以外からのPOST、JSON以外、大きすぎる内容（10,000文字超）、POST以外のメソッドも断ります。
  - 回数制限は、このコードには入っていません。必要なら、Netlify の機能（プランによります）か、別のサービスで設けてください。
- メールの件名には、訪問者が入力した文字を入れません（`New inquiry (<LP名>)`）。本文は日本語ではなく英語のテキストで、訪問者の入力から制御文字を取り除いています。返信先（Reply-To）は、メールアドレスが入力されたときだけ設定されます。
- メール送信には Resend を使っています。変更するときは `src/server/contact.ts` の `sendEmail()` だけを差し替えます。
- ログに、訪問者の名前・電話・メールは出しません（失敗の理由だけ）。

### Netlify の設定手順

1. Netlify で「Add new site」→ GitHub のこのリポジトリを選びます。ビルドの設定は `netlify.toml` から読まれます。
2. Resend で、送信元に使うドメインを認証し（DNSの設定）、APIキーを作ります。
3. Netlify の「Site configuration → Environment variables」に、次を設定します。値は **Functions** で使えるスコープにしてください。

   | 名前 | 内容 |
   |---|---|
   | `RESEND_API_KEY` | ResendのAPIキー（Secret にする） |
   | `CONTACT_TO_EMAIL` | 通知を受け取るアドレス（複数ならカンマ区切り） |
   | `CONTACT_FROM_EMAIL` | 送信元。認証済みドメインのアドレス（例：`BuySell <inquiries@example.com>`） |
   | `CONTACT_ALLOWED_ORIGINS` | 任意。サイト自身以外にPOSTを許すオリジン（カンマ区切り） |
   | `CONTACT_DRY_RUN` | 任意。`true` にすると「確認モード」になる（下の「メールなしで受信だけ確認する」）。**本番では必ず外す** |

4. デプロイプレビューで、実際にフォームから送信して、メールが届くことを確認します。
5. 設定が足りないときは、フォームは「送れませんでした」と表示し、受付済みとは表示しません。

### メールなしで受信だけ確認する（確認モード）

メールの設定（Resend）の前に、「フォームの内容が受付サーバーに正しく届くか」だけを確認できます。

1. Netlify の環境変数に、`CONTACT_DRY_RUN` ＝ `true` を追加します（`RESEND_API_KEY` などは不要です）。追加したら、公開し直します。
2. 公開されたサイトのフォームに、**テスト用のダミーの内容**を入力し、**ページを開いて2秒以上たってから**送信します。
3. 画面に「Preview only. Your details are valid, but nothing was sent…」と表示されれば、受付サーバーは、リクエストを受け取って、サーバー側のチェックも通しています。メールは送られず、計測の `form_submit` も記録されません。
4. 受け取った内容は、Netlify の「Logs & metrics」→「Functions」→ `contact` で、「contact dry run: request received and valid」という行を探して見ます。ログには、名前・電話・メール・メッセージの本文は出ません。次のものだけが出ます。
   - LP名、ZIP（整形後）、名前の頭文字と文字数、電話の桁数と末尾4桁、メールのドメイン、メッセージの文字数
   - SMS同意の有無・日時・文言の長さ、UTM、ページを開いてから送信までの時間
5. 確認が済んだら、`CONTACT_DRY_RUN` を**削除**（または `false`）して、メールの設定に進みます。**確認モードのままだと、本物の問い合わせにも、メールが送られません**（画面には「Preview only」と出るので、気づけます）。

画面が「We couldn't send your request」になる場合は、サーバーがリクエストを断っています。ログに出る理由で、原因を判断できます（`invalid_request`＝入力の不備、`too_fast`＝2秒未満の送信、`origin_not_allowed`＝別のサイトからの送信）。

### 手元での確認

- `npm test`：入力チェック、サーバーの処理（メール送信は代用品で確認）、確認モード、Netlify への接続部分をテストします。
- 実物の関数を動かすには、`npx netlify-cli functions:serve --offline --functions netlify/functions` を使います。環境変数 `EMAIL_API_URL`（テスト専用）にダミーの受け口のURLを入れると、メールの代わりにそこへ送られます。

## 構成

```
src/lib/contact-form.ts            項目のルール、整形、送信データ、送信処理（純粋な関数。テスト済み）
src/content/contact-form.ts        送信方法（モード）、英語の共通文言、SMS同意の仮文言
src/components/ContactForm.astro   フォームの部品（共通のマークアップ）
src/server/contact.ts              受付サーバーの本体（確認し直し、迷惑メール対策、メール通知）
netlify/functions/contact.ts       Netlify Functions との接続（POST /api/contact）
netlify.toml                       Netlify の設定（ビルド、関数、転送）
tests/contact-api.test.mjs         受付サーバーのテスト
src/scripts/contact-form.ts        ブラウザ側の動作（分析は含まない）
src/styles/contact-form.css        共通の構造。色・サイズ・角丸は含まない
src/styles/contact-form.<lp>.css   LPごとのスキン（Downsizing）。Home Value は home-value.css 内
tests/contact-form.test.mjs        入力チェックと送信処理のテスト
```

## LPがすること

LPの側でできるのは、見た目と、少数の文言だけです。

- **見た目**：`[data-lp="<slug>"] :is(.cf, .cf-success)` に、`contact-form.css` の冒頭に載せた `--cf-*` 変数を設定します。
- **周りのパネルと見出し**：LPごとに作ります。ボタンのクラスは `buttonClass` で渡します。
- **文言**：`ContactForm` に `submitLabel`、`success`（送信後のメッセージ）、`afterSubmit`（ボタンの下の一文）、`privacyUrl` を渡せます。SMS同意の `{company}` には、`company` を渡します。

項目、入力チェック、送信先、エラーメッセージ、SMS同意の文言は、LPごとには変えられません。変えるときは共通のファイルを直し、全LPで確認してください。

## ZIP確認の欄（`ZipCheck`）

「お住まいのZIPコードは、訪問の対象エリアですか」を確かめる小さな欄です。**問い合わせフォームとは別の部品**で、何も送信せず、ページの上で答えを出すだけです。Netlify の「Forms」にも集まりません（`data-netlify` を付けていません）。全LPで同じ部品を使えます。

- 部品：`src/components/ZipCheck.astro`。動作：`src/scripts/zip-check.ts`。判定：`src/lib/zip-area.ts`。答えの文言：`src/content/zip-check.ts`。
- **対象の ZIP の一覧は、`src/content/site.ts` の `serviceArea.zipPrefixes` 1か所**です（ZIPの先頭の数字、または5桁のZIP。5桁のZIPは、それ自身の先頭です）。空の間は、有効なZIPを入れても、「はい／いいえ」ではなく、`{{TODO: service-area ZIP list}}` の仮の表示を出します。
- **今の一覧**：ダラス・フォートワース都市圏（11郡）とヒューストン都市圏（9郡）の、すべてのZIP（756件）。`src/content/service-area-zips.ts` で、**自動で生成したファイルなので、手で直さない**でください。
  - 郡：DFW＝Collin、Dallas、Denton、Ellis、Hunt、Johnson、Kaufman、Parker、Rockwall、Tarrant、Wise。ヒューストン＝Austin、Brazoria、Chambers、Fort Bend、Galveston、Harris、Liberty、Montgomery、Waller（米国国勢調査局の都市圏の定義、OMB 2023）。
  - 出典：GeoNames の米国の郵便番号データ（CC BY 4.0、<https://www.geonames.org>）。npm の `zipcodes-us@1.2.0` に含まれるものです。
  - **ZIPコードは、ときどき追加・変更されます。** 公開の前と、定期的に、USPS または HUD の最新データと照らして確認してください。
  - 対象を変えるとき（郡を増やす・減らす、郡でなく都市で決める、など）：`scripts/build-service-area-zips.mjs` の `COUNTIES` を直し、元データ（`npm pack zipcodes-us@1.2.0` で取得した `data/US.txt`）を渡して、`node scripts/build-service-area-zips.mjs <US.txt のパス>` を実行します。
  - 郡で決めているので、都市圏の端（Austin 郡の農村部、Galveston 島など）まで含みます。実際の訪問の範囲より広い場合は、郡を減らしてください。
- **対象だったとき、フォームへつなぎます。** 「対象」の答えの下に、ボタン（「Request a visit」。文言は `src/content/zip-check.ts` の `requestButton`、LPごとに `requestLabel` で変えられます）が出ます。押すと、そのページの問い合わせフォームを開き（Silver はダイアログ、ほかは画面内のフォームへスクロール）、**ZIPの欄に、確認したZIPが入った状態**で、最初の欄（First name）にフォーカスします。
  - ZIPの欄への入力は、フォームが受ける `cf:prefill` イベント（`detail: { zip }`）で行います（`src/scripts/contact-form.ts`）。入力の途中のイベントは出さないので、`form_start` は計測されません。
  - ボタンが運ぶのは、**確認したときのZIP**です。確認のあとに入力を変えると、ボタンは消えます（もう一度確認してください）。「対象外」「ZIPとして正しくない」「一覧が未設定」のときは、出ません。
  - ボタンを押す操作は `cta_click`（`location: zip`、`method: form`）として計測されます（Downsizing と Silver の `main.ts`）。この部品は、ページに問い合わせフォーム（`#consult`）があることを前提にします。
- 「ZIPとして正しいか」は、問い合わせフォームと**同じルール**です（`normalizeZip`：5桁、`12345-6789`、ハイフンなしの9桁）。正しくない入力には、「Enter a 5-digit ZIP code.」を表示し、入力欄に戻します。
- 見た目は、LPのCSSで決めます（`.zip-row`、`.zip-result`、`#zip-form` など）。部品には、ボタンのクラス、見出し、ボタンの文言、矢印などを渡せます。同じページに2つ置くときは、`id` を変えてください。
- Silver は、この部品を使っています（見た目は、共通化の前と同一であることを確認済み）。

## 計測

フォームは `cf:event`（`document` 上のカスタムイベント）で、`start` / `submit` / `error` を知らせるだけです。各LPが、それをどう扱うかを決めます。

- Downsizing：`dataLayer` へ `form_start` と `form_submit`（`lp` 付き）。
- Home Value：`measurementEnabled` が `true` のときだけ、`visit_request_submit` と `visit_request_error` を出します（連絡先などは含めません）。

## 公開前の確認

- SMS同意の文言（`contactFormCopy.smsConsent`）は**仮**です。法務確認のあとで差し替えてください。
- 米国の個人情報・電話・SMSに関する法令は、専門家に確認してください。プライバシーポリシーへのリンク（`privacyUrl`）は、ページができたら設定します。
- 迷惑メール対策のうち、回数制限と「人間かどうかの確認」（CAPTCHA）は、まだありません。実際の迷惑メールの状況を見て、追加を判断してください。
