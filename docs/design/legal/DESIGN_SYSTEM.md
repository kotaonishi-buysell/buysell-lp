# 共通の法務ページ（/privacy、/terms、/do-not-sell）

LPではなく、**全LPが同じリンクで開く共通ページ**です。LPごとの見た目は持ちません（どのLPから開いても同じ）。

## 構成
- 文面：`src/content/legal.ts`（3ページ分。コピーはここだけ）。会社名・住所・電話・営業時間・登録番号・OCCC は `src/content/site.ts`、メールと発効日は `site.legal` から差し込みます。
- 表示：`src/components/LegalPage.astro`（文面を描画）、`src/layouts/LegalLayout.astro`（ヘッダー、フッター、`<head>`）、`src/styles/legal.css`（`body[data-page="legal"]` に限定）。
- ページ：`src/pages/privacy.astro`、`terms.astro`、`do-not-sell.astro`。リンクは `site.links`（各LPのフッターと問い合わせフォームが使う）。Home Value は `config.ts` の `privacyUrl` と `legalLinks`。
- Do Not Sell のページだけは、オプトアウトのボタンの小さなスクリプト（`scripts/privacy-choice.ts`）を読み込みます（計測ではありません）。GTM の中身と、その開示は [GTM_CONTAINER.md](GTM_CONTAINER.md)。
- 読み込むのはフォント（`fonts.css`）と `legal.css` だけ。**LPのCSS、計測、スクリプトは読み込みません**（Home Value が旧計測を読み込まない決まりも守れます）。

## 見た目
- 読みやすさ優先の1カラム（最大幅760px）。見出しは Newsreader、本文は Instrument Sans（どちらも自前ホスト）。色は中立のインクと薄い背景、リンクは青（下線あり）。
- 目次、キーボードで使える見出しジャンプ、見える焦点リング、スマホ幅で横スクロールなし。
- 未確定の事実は**画面に出しません**（公開ページに TODO を出さない）。項目ごと出さないか、約束にならない書き方にして、確認事項は `legal.ts` の `// TODO:` コメントに残します（`npm run todos` に出ます）。OCCC の登録番号と表記が空の間は、「Our registration」の節ごと出しません。

## 公開前に必要なこと
- **弁護士の確認**。「Draft for legal review」の表示は外してあります（画面に TODO を出さないため）。そのため、**文面は弁護士の確認前の状態で公開されています**。広告を出す前に確認を受けてください。
- `// TODO:` を埋める：問い合わせの保存期間（今は期間を書いていません）、サービス提供業者に他の種類がないか、グループ会社へのデータ提供、裁判地（今は書いていません）、携帯番号・SMS 同意を第三者に共有しない約束、TDPSA の適用、OCCC の登録番号と表記など（確認済みの内容は [RESEARCH.md](RESEARCH.md)）。
- 実態が変わったら文面も変える：分析・広告タグ（GTM など）を足す、個人情報の販売・共有を始める、支払いのルールを変える、など。特に「販売しない」の文面は、事実と一致している必要があります。
