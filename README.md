# metro

Windows Phone / Windows 8 のデザインシステム（Metro / Modern UI）を Web
で再利用するためのコンポーネント集です。

デモ（Muse の Space「Windows Phone / Windows 8 Design System
Demo」）を土台に、タイルやピボット／パノラマといった要素を、再利用可能なコンポーネントとして構造化していくためのリポジトリです。

## 方針

- React は使わない。Remix 3 の component の作法に寄せる
  - セットアップは一度だけ、状態はコンポーネントの内側に保持する
  - 状態変化は `handle.update()` で反映する
- デザインの核
  - フラットなタイル、影や枠ではなくコンテンツそのものでレイアウトする
  - 細く大きなタイポグラフィ、小文字のピボット見出し
  - 黒／白ベースにアクセントカラー1色
  - Live Tile の反転、Panorama の横スクロールと視差

## コンポーネント（デモから構造化済み）

タイル側:

- `Tile` / `FlipTile` / `PhotoTile` / `CalendarTile` / `TileGroup` /
  `StartScreen`

ピボット／パノラマ側:

- `Pivot` / `Panorama` / `PanoramaSection` / `PivotHub`
- `PeopleHub` / `PostRow` / `ContactMosaic`

カレンダー:

- `Agenda`（今日からの予定を日ごとに）/ `EventRow`
- `MonthView`（週を縦に無限スクロール。予定は小さなタイルとして日付の下に積み、
  週の高さは一番予定の多い日に合わせて伸びる。月末の次のマスに翌月の数字を大きく入れ、
  6 マスあけて 1 日を始める。7 マス＝1 週なので曜日の列はずれない）
- 予定は `date`（`YYYY-MM-DD`）か `daysFromToday`
  で指定する。後者は日付をブラウザで解決する。`color`
  でカレンダーごとの色を付けられる（既定はアクセント）

設定:

- `AccentPicker`（ダーク／ライトとアクセントカラー。選択は localStorage に保存）

未移植: `HeroPhoto` / `AlbumGrid` / `CameraRoll` / `PeopleHero`

色はタイルの「面」だけが持ち、土台は常に透明、という約束を全コンポーネントで共通にしています。

## 構造

[kuboon/deno-remix-tmpl](https://github.com/kuboon/deno-remix-tmpl) の static
モードに従います（サーバー API・セッション・push・Cloudflare は無し）。

- `web/client/` — ブラウザに渡るもの全て。`deno.ns` 無しで型チェックされる
  - `components/metro/` — コンポーネント。`mod.ts` からまとめて import できる
    - `_lib/` — 共有部品（タイルの土台と面、テーマ store など）
  - `pages/` — デモ。`index.tsx` が Start 画面
  - `static/app.css` — トークン（色、タイルの単位 `--metro-unit`）と既定値
  - `tokens.ts` — トークンの名前
- `web/server/` — router と asset bundler。静的ビルドはこの router
  をクロールする

### 実装上の約束

- **動くのは葉だけ。** `clientEntry` の props は直列化されるので、children
  に渡した要素の `on()` は失われる。`Pivot` / `Panorama` / `TileGroup`
  は普通のコンポーネントにして、動作は兄弟の `PivotHeader` / `PanoramaBackdrop`
  が受け持つ。
- **反転は二段の折りたたみ。** 面は -90deg〜90deg しか回らない。先に表が畳まれ、
  次に裏が開く（逆も対称）。`rotateX(180deg)` と `backface-visibility`
  は使わない。
- **グリッドは 4 列。** 640px 未満では単位を `(100vw - 左右余白 - 3 × gap) / 4`
  とし、画面幅をちょうど埋める。
- **日付はブラウザで読む。** ビルド時の日付を HTML に書き込まない。

## 開発

```bash
deno task dev    # 開発サーバー (http://localhost:8000)
deno task build  # 静的サイトを web/dist へ生成 (サブパス配信は BASE_URL を指定)
deno task check  # 型チェック + lint + fmt
deno task test   # テスト
```
