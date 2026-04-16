import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";

export default function PrivacyPage() {
    return (
        <Layout>
            <NavBar onBack />
            <div className="p-4 bg-black py-20">
                <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>

                <div className="space-y-6 text-sm text-gray-700">
                    <section>
                        <h2 className="text-lg font-semibold mb-2">1. はじめに</h2>
                        <p>
                            本プライバシーポリシーは、当社が提供するサービス（以下「本サービス」）における
                            ユーザーの個人情報の取り扱いについて定めるものです。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">2. 収集する情報</h2>
                        <p className="mb-2">当社は、以下の情報を収集することがあります。</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>氏名、メールアドレス等の個人を識別できる情報</li>
                            <li>本サービスの利用履歴</li>
                            <li>端末情報、IPアドレス、ブラウザの種類等の技術情報</li>
                            <li>位置情報（ユーザーの同意がある場合）</li>
                            <li>ユーザーが投稿したレビュー、写真等のコンテンツ</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">3. 情報の利用目的</h2>
                        <p className="mb-2">当社は、収集した情報を以下の目的で利用します。</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>本サービスの提供・運営</li>
                            <li>ユーザーからのお問い合わせへの対応</li>
                            <li>本サービスの改善・新サービスの開発</li>
                            <li>利用規約に違反する行為への対応</li>
                            <li>本サービスに関する重要なお知らせの送信</li>
                            <li>マーケティング活動（ユーザーの同意がある場合）</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">4. 情報の第三者提供</h2>
                        <p>
                            当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                            <li>ユーザーの同意がある場合</li>
                            <li>法令に基づく場合</li>
                            <li>人の生命、身体または財産の保護のために必要がある場合</li>
                            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">5. 情報の安全管理</h2>
                        <p>
                            当社は、個人情報の漏洩、滅失またはき損の防止その他の個人情報の安全管理のために
                            必要かつ適切な措置を講じます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">6. Cookieの使用</h2>
                        <p>
                            本サービスでは、ユーザー体験の向上やサービスの改善のためにCookieを使用しています。
                            ユーザーはブラウザの設定によりCookieを無効にすることができますが、
                            その場合、本サービスの一部機能が利用できなくなる可能性があります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">7. 外部サービスとの連携</h2>
                        <p>
                            本サービスでは、Googleアカウント等の外部サービスを利用したログイン機能を
                            提供しています。これらの外部サービスを利用する場合、当該サービスの
                            プライバシーポリシーも適用されます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">8. 個人情報の開示・訂正・削除</h2>
                        <p>
                            ユーザーは、当社に対して自己の個人情報の開示、訂正、追加、削除、
                            利用停止を求めることができます。ご希望の場合は、お問い合わせフォームより
                            ご連絡ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">9. プライバシーポリシーの変更</h2>
                        <p>
                            当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                            重要な変更がある場合は、本サービス上でお知らせします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">10. お問い合わせ</h2>
                        <p>
                            本プライバシーポリシーに関するお問い合わせは、
                            本サービス内のお問い合わせフォームよりご連絡ください。
                        </p>
                    </section>

                    <p className="text-gray-500 mt-8">最終更新日: 2026年4月1日</p>
                </div>
            </div>
        </Layout>
    );
}
