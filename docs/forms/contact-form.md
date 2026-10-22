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
| **Netlify Forms**（Netlify の標準） | `PUBLIC_CONTACT_MODE=netlify-forms`（`netlify.toml` に設定済み） | ブラウザが、開いているページ自身のURLに、フォームの内容を送ります。Netlify が受け取って保管し、通知は Netlify の画面で設定します。 |
| メール送信の関数 | `PUBLIC_CONTACT_ENDPOINT=/api/contact`（`PUBLIC_CONTACT_MODE` は未設定） | ブラウザが `/api/contact`（`src/server/contact.ts`）に送り、関数が確認し直してメールで通知します。下の「受付サーバー」を見てください。 |
| プレビュー | どちらも未設定（手元のビルド） | 何も送信せず、「Preview only」と明示します。受付済みとは表示せず、計測の `form_submit` も出しません。 |

### Netlify Forms で受け取る

- フォームの名前は `contact` で、**全LPで同じ**です。そのため、3つのLPの送信が、Netlify の「Forms」の同じ「contact」にまとまります。どのLPからかは、項目 `lp` で区別します。
- Netlify は、公開のたびに、ページのHTMLの `<form data-netlify="true">` を読んで、フォームと項目を登録します（フォーム検出を有効にしておく必要があります）。項目を足したり変えたりしたときは、公開し直してください。
- 送られる内容は、上の「送信されるデータ」と同じです（ブラウザが整形した値）。ただし形式は、フォームの送信と同じ `application/x-www-form-urlencoded` で、`smsConsent` は `yes` か `no`、迷惑メール対策の見えない欄は `homepage_url` です。
- 迷惑メール対策：見えない入力欄（`homepage_url`）は、Netlify のスパム対策（`data-netlify-honeypot`）として働きます。**この方法には、受付サーバーでの確認し直しや、「2秒未満の送信を断る」仕組みはありません。** Netlify 自身のスパムの判定に頼ります。
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
- このモードで、受付サーバーの関数（`/api/contact`）は使いません。デプロイはされますが、呼ばれません。メールを関数から送る方式に戻すときは、`netlify.toml` の `PUBLIC_CONTACT_MODE` を消し、`PUBLIC_CONTACT_ENDPOINT = "/api/contact"` を設定します。

### メール送信の関数の契約（`function` モード）

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

## 計測

フォームは `cf:event`（`document` 上のカスタムイベント）で、`start` / `submit` / `error` を知らせるだけです。各LPが、それをどう扱うかを決めます。

- Downsizing：`dataLayer` へ `form_start` と `form_submit`（`lp` 付き）。
- Home Value：`measurementEnabled` が `true` のときだけ、`visit_request_submit` と `visit_request_error` を出します（連絡先などは含めません）。

## 公開前の確認

- SMS同意の文言（`contactFormCopy.smsConsent`）は**仮**です。法務確認のあとで差し替えてください。
- 米国の個人情報・電話・SMSに関する法令は、専門家に確認してください。プライバシーポリシーへのリンク（`privacyUrl`）は、ページができたら設定します。
- 迷惑メール対策のうち、回数制限と「人間かどうかの確認」（CAPTCHA）は、まだありません。実際の迷惑メールの状況を見て、追加を判断してください。
