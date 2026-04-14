import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import SettingsBody from '@/components/Body/SettingsBody';
import Loading from '@/components/Loading';
import { AuthService } from '@/services/AuthService';
import { UserSetting } from '@/services/SettingService';

type SettingResult =
    | { success: true; setting: UserSetting }
    | { success: false };

const getSetting = async (token: string): Promise<SettingResult> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/setting`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            return { success: false };
        }

        const data = await res.json();
        return { success: true, setting: data.setting };
    } catch {
        return { success: false };
    }
};

const SettingsContent = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    // ログインしていない場合
    if (!token) {
        return <SettingsBody initialSetting={null} isLoggedIn={false} />;
    }

    // ログインしている場合
    const result = await getSetting(token);

    if (!result.success) {
        const defaultSetting: UserSetting = {
            isEmail: true,
            isNotification: true,
        };
        return <SettingsBody initialSetting={defaultSetting} isLoggedIn={true} />;
    }

    return <SettingsBody initialSetting={result.setting} isLoggedIn={true} />;
};

export default function SettingPage() {
    return (
        <Layout>
            <NavBar />
            <Suspense fallback={<Loading />}>
                <SettingsContent />
            </Suspense>
        </Layout>
    );
}
