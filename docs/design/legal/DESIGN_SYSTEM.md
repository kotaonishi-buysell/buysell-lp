# 共通の法務ページ（/privacy、/terms、/do-not-sell）

LPではなく、**全LPが同じリンクで開く共通ページ**です。LPごとの見た目は持ちません（どのLPから開いても同じ）。

## 構成
- 文面：`src/content/legal.ts`（3ページ分。コピーはここだけ）。会社名・住所・電話・営業時間・登録番号・OCCC は `src/content/site.ts`、メールと発効日は `site.legal` から差し込みます。
- 表示：`src/components/LegalPage.astro`（文面を描画）、`src/layouts/LegalLayout.astro`（ヘッダー、フッター、`<head>`）、`src/styles/legal.css`（`body[data-page="legal"]` に限定）。
- ページ：`src/pages/privacy.astro`、`terms.astro`、`do-not-sell.astro`。リンクは `site.links`（各LPのフッターと問い合わせフォームが使う）。Home Value は `config.ts` の `privacyUrl` と `legalLinks`。
- 読み込むのはフォント（`fonts.css`）と `legal.css` だけ。**LPのCSS、計測、スクリプトは読み込みません**（Home Value が旧計測を読み込まない決まりも守れます）。

## 見た目
- 読みやすさ優先の1カラム（最大幅760px）。見出しは Newsreader、本文は Instrument Sans（どちらも自前ホスト）。色は中立のインクと薄い背景、リンクは青（下線あり）。
- 目次、キーボードで使える見出しジャンプ、見える焦点リング、スマホ幅で横スクロールなし。
- 未確定の事実は `{{TODO: ...}}` として、破線の枠で**画面に出ます**（`npm run todos` にも出ます）。

## 公開前に必要なこと
- **弁護士の確認**。ページ上部の「Draft for legal review」の表示（TODO）は、承認後に `legal.ts` の `legalDraftNotice` を空にして外します。
- TODO を埋める：会社名・住所・電話・営業時間、プライバシーのメール、発効日、保存期間、サービス提供業者、BuySell グループへの提供、準拠法・管轄、最低年齢、テキサス州のプライバシー法（TDPSA）の適用の有無。
- 実態が変わったら文面も変える：分析・広告タグ（GTM など）を足す、個人情報の販売・共有を始める、支払いのルールを変える、など。特に「販売しない」の文面は、事実と一致している必要があります。
