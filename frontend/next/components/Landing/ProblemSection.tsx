const problems = [
    "「今日だけ使いたいのに、月額契約が必要...」",
    "「近くのカフェはWiFiが遅くて仕事にならない...」",
    "「行ってみたら電源がなかった...」",
];

const ProblemCard = ({ text }: { text: string }) => {
    return (
        <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
            <p className="text-gray-300 text-sm md:text-base">{text}</p>
        </div>
    );
};

const ProblemSection = () => {
    return (
        <section className="py-12 md:py-16 px-4 bg-gray-950">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-6">
                    こんなお悩みありませんか？
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
                    {problems.map((problem, index) => (
                        <ProblemCard key={index} text={problem} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
