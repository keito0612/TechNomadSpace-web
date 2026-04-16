import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";

export default function TermsPage() {
    return (
        <Layout>
            <NavBar onBack />
            <div className="bg-black p-4 py-20">
                <h1 className="text-2xl font-bold mb-6">利用規約</h1>

                <div className="space-y-6 text-sm text-gray-700">
                    <section>
                        <h2 className="text-lg font-semibold mb-2">第1条（適用）</h2>
                        <p>
                            本規約は、本サービスの利用に関する条件を定めるものであり、
                            本サービスを利用するすべてのユーザーに適用されます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第2条（利用登録）</h2>
                        <p>
                            登録希望者が本規約に同意の上、所定の方法によって利用登録を申請し、
                            当社がこれを承認することによって、利用登録が完了するものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第3条（ユーザーIDおよびパスワードの管理）</h2>
                        <p>
                            ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを
                            適切に管理するものとします。ユーザーは、いかなる場合にも、ユーザーIDおよび
                            パスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第4条（禁止事項）</h2>
                        <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                            <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>本サービスによって得られた情報を商業的に利用する行為</li>
                            <li>当社のサービスの運営を妨害するおそれのある行為</li>
                            <li>不正アクセスをし、またはこれを試みる行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>不正な目的を持って本サービスを利用する行為</li>
                            <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                            <li>他のユーザーに成りすます行為</li>
                            <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                            <li>その他、当社が不適切と判断する行為</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第5条（本サービスの提供の停止等）</h2>
                        <p>
                            当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく
                            本サービスの全部または一部の提供を停止または中断することができるものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第6条（免責事項）</h2>
                        <p>
                            当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。
                            当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた
                            取引、連絡または紛争等について一切責任を負いません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第7条（サービス内容の変更等）</h2>
                        <p>
                            当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは
                            本サービスの提供を中止することができるものとし、これによってユーザーに
                            生じた損害について一切の責任を負いません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第8条（利用規約の変更）</h2>
                        <p>
                            当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を
                            変更することができるものとします。なお、本規約の変更後、本サービスの利用を
                            開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">第9条（準拠法・裁判管轄）</h2>
                        <p>
                            本規約の解釈にあたっては、日本法を準拠法とします。
                            本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する
                            裁判所を専属的合意管轄とします。
                        </p>
                    </section>

                    <p className="text-gray-500 mt-8">最終更新日: 2026年4月1日</p>
                </div>
            </div>
        </Layout>
    );
}
