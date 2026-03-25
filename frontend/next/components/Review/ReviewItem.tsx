import { Review } from "@/types/types"
import StarsRatings from "../StarsRating";
import ProfileImage from "../Profile/ProfileImage";

interface ReviewItemProps {
    review: Review;
}

const ReviewComment = ({ comment }: { comment: string }) => {
    return (
        <div className="text-white break-all">
            {comment}
        </div>
    );
}

const ReviewUser = ({ name, postedAtHuman }: { name: string, postedAtHuman: string }) => {
    return (
        <div className="flex flex-row justify-between">
            <div className="text-white break-all">
                {name}
            </div>
            <div className="text-white break-all">
                {postedAtHuman}
            </div>
        </div>
    );
}

const ReviewItem = (props: ReviewItemProps) => {
    return (
        <div className="p-2 w-full flex flex-row justify-start items-start gap-3">
            <ProfileImage sizes={36} imageUrl={props.review.user.image_path} />
            <div className="flex flex-col justify-start items-start">
                <ReviewUser name={props.review.user.name} postedAtHuman={props.review.posted_at_human} />
                <StarsRatings className="py-1" size={20} rating={props.review.rating} />
                <ReviewComment comment={props.review.comment} />
            </div>
        </div>
    );
}

export default ReviewItem;






