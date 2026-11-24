# metro

Windows Phone / Windows 8 のデザインシステム（Metro / Modern UI）を Web で再利用するためのコンポーネント集です。

デモ（Muse の Space「Windows Phone / Windows 8 Design System Demo」）を土台に、タイルやピボット／パノラマといった要素を、再利用可能なコンポーネントとして構造化していくためのリポジトリです。

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

- `Tile` / `FlipTile` / `PhotoTile` / `CalendarTile` / `TileGroup`

ピボット／パノラマ側:

- `Pivot` / `Panorama` / `PanoramaSection` / `PivotHub`
- `HeroPhoto` / `AlbumGrid` / `CameraRoll`
- `PeopleHub` / `PeopleHero` / `PostRow` / `ContactMosaic`

色はタイルの「面」だけが持ち、土台は常に透明、という約束を全コンポーネントで共通にしています。
