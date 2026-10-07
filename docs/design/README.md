# LPごとのデザインシステム

各LPは独立したデザインシステムを持ちます。この一覧は参照先を案内するもので、全LP共通の見た目を定義するものではありません。

| LP | デザイン仕様 | 実装 |
|---|---|---|
| /downsizing | [Downsizing DESIGN_SYSTEM.md](downsizing/DESIGN_SYSTEM.md) | src/styles/tokens.css、base.css、fonts.css と既存部品 |
| /home-value | [Home Value DESIGN_SYSTEM.md](home-value/DESIGN_SYSTEM.md) | src/styles/home-value.css のLP限定スタイルと既存部品 |

## 編集ルール
- 対象LPの仕様だけを適用し、別のLPの色・フォント・写真・形状・レイアウトを自動的に揃えない。
- 両方のLPに関わる変更は、両方の仕様を読んで影響を確認する。
- 共通部品・フォーム・計測の再利用は可能。見た目を共通化する根拠にはしない。
- home-value は現時点で既存のCSS基盤を継承し、専用CSSで上書きする方式。仕様書は分離済みだが、CSS基盤と部品の実装は一部共有している。
- 共通CSSや部品を変更すると両LPに影響する可能性がある。対象LPだけの見た目変更はLP限定セレクターか専用部品で実装する。
- 新LPを追加するときは docs/design/<slug>/DESIGN_SYSTEM.md を必ず追加し、この一覧に登録する。
