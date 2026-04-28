import { AuthService } from "@/services/AuthService";
import { cookies } from "next/headers";
import ErrorView from "../error";
import { notFound, redirect } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import NotificationBody from "@/components/Body/NotificationBody";
import { Notification } from "@/types/types";

type GetNotificationResult =
    | { success: true; notification: Notification }
    | { success: false; status: number };

const getNotification = async (id: string, token: string): Promise<GetNotificationResult> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/notifications/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                cache: 'no-store',
            });

        if (!res.ok) {
            return { success: false, status: res.status };
        }

        const data = await res.json();
        return { success: true, notification: data.notification as Notification };
    } catch {
        return { success: false, status: 500 };
    }
}

async function NotificationContentView({ id, token }: { id: string, token: string }) {
    const result = await getNotification(id, token);

    if (!result.success) {
        if (result.status === 404) {
            notFound();
        }
        return <ErrorView isAuthError={result.status === 401} />;
    }

    return (
        <NotificationBody notification={result.notification} />
    );
}

const NotificationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;
    if (!token) {
        redirect("/");
    }
    return (
        <Layout>
            <NavBar title={"お知らせ詳細"} onBack />
            <Suspense fallback={<Loading />}>
                <NotificationContentView id={id} token={token} />
            </Suspense>
        </Layout>
    );
}

export default NotificationPage;
