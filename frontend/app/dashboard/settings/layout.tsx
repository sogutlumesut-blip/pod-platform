import { Separator } from "@/components/ui/separator";
import { SettingsSidebar } from "@/components/dashboard/SettingsSidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6 px-4 md:px-8 max-w-[1600px] mx-auto py-10 pb-16">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:mx-0 lg:w-1/5 max-w-[240px]">
                    <SettingsSidebar />
                </aside>
                <div className="flex-1 lg:max-w-4xl">{children}</div>
            </div>
        </div>
    );
}
