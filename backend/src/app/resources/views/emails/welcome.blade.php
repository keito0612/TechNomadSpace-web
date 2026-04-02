<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNomadへようこそ</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            margin: 0 0 15px;
        }
        .highlight {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TechNomad</h1>
        </div>

        <div class="content">
            <p>{{ $user->name }} 様</p>

            <p>TechNomadへのご登録ありがとうございます。</p>

            <div class="highlight">
                <p><strong>登録情報</strong></p>
                <p>ユーザー名: {{ $user->name }}</p>
                <p>メールアドレス: {{ $user->email }}</p>
            </div>

            <p>TechNomadでは、世界中のノマドワーカー向けのスポット情報を共有できます。お気に入りの場所を見つけたり、レビューを投稿したりしてコミュニティに参加しましょう。</p>

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} TechNomad. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
