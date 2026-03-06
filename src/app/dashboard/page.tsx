import TrekAppBanner from "@/components/TrekappBanner";

export default function DashboardPage() {
    return (
        <div className="mx-auto px-4 py-16 sm:py-20">
            <h1 className="text-3xl font-bold mb-6">Beautiful Nepal Dashboard</h1>
            <p>
                Welcome to your dashboard! Here you can manage your account, view
                analytics, and access exclusive content.
            </p>

            <p className="py-4">Frequent Actions:</p>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <a
                        href="/dashboard/users/change-password"
                        className="text-blue-600 hover:underline"
                    >
                        Change Password
                    </a>
                </li>
                <li>
                    <a
                        href="/dashboard/users/update"
                        className="text-blue-600 hover:underline"
                    >
                        Update Profile
                    </a>
                </li>
                <li>
                    <a
                        href="/dashboard/users/preferences/notification"
                        className="text-blue-600 hover:underline"
                    >
                        Notification Preferences
                    </a>
                </li>
            </ul>
 <TrekAppBanner />
            <p className="mt-5 text-sm text-yellow-600 dark:text-yellow-300">
                If there is any issue, reach out to{" "}
                <a
                    href="mailto:upsth88@gmail.com"
                    className="underline hover:text-yellow-900 dark:hover:text-yellow-100"
                >
                    upsth88@gmail.com
                </a>
                .
            </p>
        </div>
    );
}
