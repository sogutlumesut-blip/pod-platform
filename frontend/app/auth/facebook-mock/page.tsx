"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FacebookMockPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (window.opener) {
                window.opener.postMessage(
                    {
                        type: "FACEBOOK_AUTH_SUCCESS", // Consistent naming
                        provider: "facebook",
                        data: {
                            name: "Mesut Söğütlü", // Defaulting to user's name for continuity
                            email: "mesutsogutlu@facebook.com"
                        }
                    },
                    window.location.origin
                );
                window.close();
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[396px] text-center space-y-6">
                {/* Facebook Logo */}
                <div className="flex justify-center text-[#1877f2]">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </div>

                <div className="space-y-4">
                    <p className="text-lg text-gray-900">
                        PrintMarkt would like to access your name and profile picture.
                    </p>

                    {/* Mock Profile Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border text-left">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            M
                        </div>
                        <div>
                            <div className="font-semibold text-sm">Mesut Söğütlü</div>
                            <div className="text-xs text-gray-500">mesutsogutlu@facebook.com</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleLogin}
                        className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold h-12 text-base"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Continue as Mesut'}
                    </Button>
                    <Button variant="ghost" className="w-full text-[#1877f2] font-semibold" onClick={() => window.close()}>
                        Cancel
                    </Button>
                </div>

                <div className="text-xs text-gray-500 mt-6">
                    PrintMarkt's Privacy Policy and Terms of Service apply.
                </div>
            </div>
        </div>
    );
}
