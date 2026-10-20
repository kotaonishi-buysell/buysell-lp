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

ブラウザは、共通の送信先へ次のJSONを POST します。

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
  "utm": { "utm_source": "google", "utm_medium": "cpc" }
}
```

- `lp` でどのLPから来たかを区別します。
- `smsConsent` が `false` のとき、`smsConsentAt` と `smsConsentText` は `null` です。
- 日時はブラウザの時計によるUTCです。受け取る側でも、受信日時を記録してください。
- `utm` には `utm_source` `utm_medium` `utm_campaign` `utm_term` `utm_content` だけが入ります（他のパラメータは送りません）。

## 送信先の契約

- 送信先は `src/content/contact-form.ts` の `contactFormConfig.endpoint` **1か所**です（同じオリジンのパス、または `https://` のURL）。全LPがここを使います。
- 送信先は、成功時に **2xx と `{ "accepted": true }`** を返してください。それ以外（2xx以外、空の応答、JSONでない応答、`accepted` が `true` でない応答）は失敗として扱い、入力は残します。15秒でタイムアウトします。
- `endpoint` が `null` の間は**プレビュー**です。何も送信せず、「Preview only」と明示し、受付済みとは表示しません。計測の `form_submit` も出しません。

## 構成

```
src/lib/contact-form.ts            項目のルール、整形、送信データ、送信処理（純粋な関数。テスト済み）
src/content/contact-form.ts        送信先、英語の共通文言、SMS同意の仮文言
src/components/ContactForm.astro   フォームの部品（共通のマークアップ）
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
- 迷惑メール対策（見えない入力欄、人間かどうかの確認、受付側の回数制限など）は、送信先の実装と一緒に入れます。
