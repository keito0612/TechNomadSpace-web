interface StarsRatingsProps {
    rating: number;
    size?: number;
    isScore?: boolean;
}

const StarIcon = ({ fillPercent, size, index }: { fillPercent: number; size: number; index: number }) => {
    const fillColor = "#ffbc0b";
    const emptyColor = "#cccccc";
    const gradientId = `starGrad-${index}`;

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
            <defs>
                <linearGradient id={gradientId}>
                    <stop offset={`${fillPercent}%`} stopColor={fillColor} />
                    <stop offset={`${fillPercent}%`} stopColor={emptyColor} />
                </linearGradient>
            </defs>
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={fillPercent === 100 ? fillColor : fillPercent === 0 ? emptyColor : `url(#${gradientId})`}
            />
        </svg>
    );
};

const StarsRatings: React.FC<StarsRatingsProps> = ({ rating, size = 35, isScore = true }: StarsRatingsProps) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {

        const diff = rating - (i - 1);
        let fillPercent: number;

        if (diff >= 1) {
            fillPercent = 100;
        } else if (diff > 0) {
            fillPercent = Math.round(diff * 100);
        } else {
            fillPercent = 0;
        }

        stars.push(<StarIcon key={i} fillPercent={fillPercent} size={size} index={i} />);
    }

    return (
        <div className="flex justify-start items-center">
            <div className="flex">{stars}</div>
            {isScore && <span className="text-4xl pl-3 text-black">{rating} / 5</span>}
        </div>
    );
};

export default StarsRatings;
