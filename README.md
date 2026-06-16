# TechNomadSpace

ノマドワーカー・リモートワーカー向けのコワーキングスペース検索サービス

### 概要
TechNomadSpaceは、ノマドワーカーや旅行をしながら働く人と気軽に利用したい人向けのコワーキングスペース検索サービスです。

**特徴:**
- 契約や事前予約が不要で、すぐに利用できる施設のみを掲載
- 料金体系は「完全無料」「ワンドリンク制」「ドロップイン（時間課金）」の3種類
- 使った分だけ支払うシンプルな料金システム

月額契約が必要なコワーキングスペースは掲載対象外とし、気軽に立ち寄れる施設だけを厳選して紹介しています。

### このサービスを作った理由

近年、リモートワークやノマドワークが広がる中で、「今すぐ作業できる場所を見つけたい」というニーズが増えています。しかし、既存のコワーキングスペース検索サービスには以下のような課題がありました。

**既存サービスの課題:**
- 月額契約が必要な施設と、ドロップイン利用可能な施設が混在していて分かりにくい
- 予約が必要な施設が多く、急な作業には対応できない。
- 料金体系が複雑で、実際にいくらかかるのか分かりにくい
- 旅行先や出張先で使える施設を探すのに時間がかかる

**TechNomadSpaceが解決すること:**
- ドロップイン利用可能な施設だけを掲載し、「今すぐ使える」を保証
- 料金タイプ（無料/ワンドリンク制/時間課金）を明確に表示
- 地図ベースで現在地周辺の施設をすぐに検索可能
- 実際の利用者レビューで、施設の雰囲気や使い勝手を事前に確認

「作業場所を探すストレスをなくし、作業に集中できる環境をすぐに見つけられる」ことを目指して開発しました。

### ターゲットユーザー
| ユーザー層 | 利用シーン |
|-----------|-----------|
| ノマドワーカー | 各地を移動しながら働く人。新しい作業場所を常に探している |
| リモートワーカー | 自宅以外で集中して作業したい時に利用 |
| 旅行者 | 旅行中に急な仕事が入った時、作業スペースを探す |
| フリーランス | 気分転換に普段と違う場所で作業したい時に利用 |
| ビジネスパーソン | 出張先での空き時間に作業スペースが必要な時に利用 |
| 学生 | カフェ代わりに安く勉強・作業できる場所を探している |

**共通するニーズ:**
- 予約なしですぐに利用したい
- 使った分だけの支払いで済ませたい
- WiFi・電源など作業に必要な設備が整っている場所を探したい
- 事前に施設の雰囲気を知りたい

## URL
https://technomadspace.com

## 特徴

- **すぐ使える施設だけ** - 月額契約が必要な施設は掲載対象外
- **地図ベース検索** - 現在地周辺の施設をマップで一覧表示
- **料金が明確** - 無料/ワンドリンク制/時間課金の3タイプで分類
- **設備情報** - WiFi・電源・モニター・個室ブースの有無を確認可能
- **ユーザーレビュー** - 実際の利用者の評価・写真を閲覧

## 技術スタック

### フロントエンド
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Chakra UI
- Leaflet（地図表示）

### バックエンド
- Laravel 12
- PHP 8.2+
- Laravel Sanctum（認証）
- Laravel Socialite（Google OAuth）

### インフラ（開発環境）
- Docker / Docker Compose
- Mysql
- Nginx

### インフラ（本番環境）
- **Cloudflare Pages** - フロントエンド（Next.js）のホスティング
- **Cloudflare R2** - 画像ストレージ（S3互換）
- **Google Cloud Run** - バックエンド（Laravel API）のホスティング
- **Supabase PostgreSQL** - データベース
- **Firebase Cloud Messaging** - プッシュ通知
- **Resend** - メール送信サービス

#### インフラ構成図

![インフラ構成図](docs/images/infrastructure.png)

## セットアップ

### 必要環境
- Docker Desktop
- Git

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-username/TechNomadSpace.git
cd TechNomadSpace

# 2. 環境変数ファイルを作成
cp backend/src/app/.env.example backend/src/app/.env
cp frontend/next/.env.example frontend/next/.env.local

# 3. Dockerコンテナをビルド・起動
docker compose build
docker compose up -d

# 4. バックエンドのセットアップ
docker compose exec api bash
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
exit

# 5. フロントエンドのセットアップ
docker compose exec next sh
npm install
exit
```

### 開発サーバー

| サービス | URL | 説明 |
|---------|-----|------|
| フロントエンド | http://localhost:3000 | Next.js |
| バックエンドAPI | http://localhost:8000 | Laravel |
| phpMyAdmin | http://localhost:10000 | DB管理 |

## 主な機能

### ユーザー向け機能
- メール/パスワードでのユーザー登録・ログイン
- Googleアカウントでのソーシャルログイン
- コワーキングスペースの検索・詳細閲覧
- レビューの投稿・編集・削除
- お気に入り施設の登録
- プッシュ通知の受信

### 施設情報
- 基本情報（名前、住所、電話番号、Webサイト）
- 料金情報（時間料金、日料金、最低料金）
- 設備情報（WiFi、電源、モニター、個室ブース、フリードリンク）
- 営業時間（曜日別）
- ユーザーレビュー・写真

## ディレクトリ構成

```
TechNomadSpace/
├── frontend/
│   └── next/              # Next.jsアプリケーション
│       ├── app/           # ページ（App Router）
│       ├── components/    # Reactコンポーネント
│       ├── services/      # API通信
│       └── types/         # 型定義
├── backend/
│   └── src/
│       └── app/           # Laravelアプリケーション
│           ├── app/
│           │   ├── Http/Controllers/
│           │   ├── Models/
│           │   └── Services/
│           ├── database/
│           │   ├── migrations/
│           │   └── seeders/
│           └── routes/
├── docker/                # Docker設定
├── docs/                  # ドキュメント
│   ├── SPECIFICATION.md   # 仕様書
│   └── infrastructure.dio # インフラ構成図（draw.io形式）
├── ER.dio                 # ER図（draw.io形式）
└── docker-compose.yml
```

## データベース設計
![ER図](docs/images/ER.png)

## API

### 認証
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/register | ユーザー登録 |
| POST | /api/login | ログイン |
| POST | /api/logout | ログアウト |

### コワーキングスペース
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/locations | 一覧取得 |
| GET | /api/location/{id} | 詳細取得 |

### レビュー
| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/reviews/store | 投稿 |
| POST | /api/reviews/update/{id} | 更新 |
| DELETE | /api/reviews/destroy/{id} | 削除 |

詳細は [仕様書](docs/SPECIFICATION.md) を参照してください。

## 開発コマンド

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# ログ確認
docker compose logs -f

# マイグレーション実行
docker compose exec api php artisan migrate

# シーダー実行
docker compose exec api php artisan db:seed

# キャッシュクリア
docker compose exec api php artisan cache:clear
docker compose exec api php artisan config:clear
```

## 環境変数

### バックエンド（backend/src/app/.env）
```env
APP_NAME=TechNomadSpace
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=techNomad
DB_USERNAME=root
DB_PASSWORD=password

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### フロントエンド（frontend/next/.env.local）
```env
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## ライセンス

MIT License

## 作者

isobekeito
