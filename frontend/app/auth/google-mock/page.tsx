"use client";

import { User } from "lucide-react";

export default function GoogleMockPage() {
    // Mock accounts based on user's screenshot
    const accounts = [
        { name: "Duvar Kağıdı Marketi", email: "sogutlumesut@gmail.com", avatar: "D", color: "bg-red-600" },
        { name: "Muravie Wallposter", email: "muraviewallposter@gmail.com", avatar: "M", color: "bg-orange-500" },
        { name: "Dudu Tenger", email: "dudutengersogutlu@gmail.com", avatar: "D", color: "bg-purple-500" }, // Using avatar from screenshot
        { name: "Mesut Sogutlu", email: "mesutsogutlu@gmail.com", avatar: "M", color: "bg-blue-500" },
    ];

    const handleSelectAccount = (account: any) => {
        // Send message to parent window
        if (window.opener) {
            window.opener.postMessage(
                {
                    type: "GOOGLE_AUTH_SUCCESS",
                    provider: "google",
                    data: account
                },
                window.location.origin
            );
            window.close();
        } else {
            console.error("No parent window found!");
        }
    };

    return (
        <div className="min-h-screen bg-[#202124] text-white flex flex-col font-sans">
            {/* Header */}
            <div className="border-b border-[#3c4043] p-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="text-[#dadce0] font-medium text-lg">Google ile oturum açın</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start pt-16 px-4">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-normal text-[#e8eaed]">Bir hesap seçin</h1>
                        <p className="text-[#9aa0a6]">printmarkt.com uygulamasına devam edin</p>
                    </div>

                    <div className="space-y-1">
                        {accounts.map((acc, idx) => (
                            <div
                                key={acc.email}
                                onClick={() => handleSelectAccount(acc)}
                                className="flex items-center gap-4 p-4 hover:bg-[#303134] rounded transition-colors cursor-pointer border-b border-[#3c4043] last:border-0"
                            >
                                <div className={`h-8 w-8 rounded-full ${acc.color} flex items-center justify-center text-white text-sm font-medium shrink-0`}>
                                    {acc.avatar}
                                </div>
                                <div className="flex flex-col text-left overflow-hidden">
                                    <span className="text-[#e8eaed] text-sm font-medium truncate">{acc.name}</span>
                                    <span className="text-[#9aa0a6] text-xs truncate">{acc.email}</span>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center gap-4 p-4 hover:bg-[#303134] rounded transition-colors cursor-pointer border-t border-[#3c4043] mt-2">
                            <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center text-[#9aa0a6]">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[#e8eaed] text-sm font-medium">Başka bir hesap kullan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
