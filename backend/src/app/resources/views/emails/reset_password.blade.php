<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード再設定のご案内</title>
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
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
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
            <p>TechNomadをご利用いただきありがとうございます。</p>

            <p>パスワード再設定のリクエストを受け付けました。下のボタンをクリックして、新しいパスワードを設定してください。</p>

            <div class="button-container">
                <a href="{{ $resetUrl }}" class="button">パスワードを再設定する</a>
            </div>

            <div class="warning">
                <p><strong>⚠️ ご注意</strong></p>
                <p>このリンクの有効期限は <strong>{{ $expireTime }}分</strong> です。期限が切れた場合は、もう一度再設定のお手続きをお願いいたします。</p>
            </div>

            <p>もしこのメールにお心当たりがない場合は、操作を行わずにこのメールを削除してください。</p>

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} TechNomad. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
