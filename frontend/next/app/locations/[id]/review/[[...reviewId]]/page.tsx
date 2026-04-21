import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import NavBar from "@/components/Navbar";
import ReviewForm from "@/components/Review/ReviewForm";
import { AuthService } from "@/services/AuthService";
import { Review } from "@/types/types";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";

interface LocationBasic {
    id: number;
    name: string;
}

const getLocation = async (id: string): Promise<LocationBasic | null> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/location/${id}`, {
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (res.ok) {
            const json = await res.json();
            return {
                id: json.data.id,
                name: json.data.name,
            };
        }
        return null;
    } catch {
        return null;
    }
};

const getReview = async (id: string, token: string): Promise<Review | null> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/reviews/${id}`, {
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (res.ok) {
            const json = await res.json();
            return json.data;
        }
        return null;
    } catch {
        throw new Error('サーバ側で問題が発生しました。')
    }
};

export default async function ReviewEditPage({ params }: { params: Promise<{ id: string; reviewId?: string[] }> }) {
    const { id, reviewId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    if (!token) {
        redirect("/login");
    }

    const location = await getLocation(id);
    if (!location) {
        notFound();
    }

    const reviewIdValue = reviewId?.[0];
    let review: Review | undefined;

    if (reviewIdValue) {
        const fetchedReview = await getReview(reviewIdValue, token);
        if (!fetchedReview) {
            notFound();
        }
        review = fetchedReview;
    }

    const isEditMode = !!review;

    return (
        <Suspense fallback={<Loading message="読み込み中" />}>
            <Layout>
                <NavBar onBack title={isEditMode ? "編集" : "投稿"} />
                <ReviewForm
                    locationId={location.id}
                    locationName={location.name}
                    review={review}
                />
            </Layout>
        </Suspense>
    );
}
