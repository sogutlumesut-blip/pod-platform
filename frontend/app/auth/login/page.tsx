"use client";

import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    // Login State
    const [emailState, setEmailState] = useState("");

    // Social Auth Dialog State
    const [showSocialDialog, setShowSocialDialog] = useState(false);
    const [socialProvider, setSocialProvider] = useState("");
    const [socialData, setSocialData] = useState({ name: "", email: "" });


    const handleSocialClick = (provider: string) => {
        setIsLoading(provider);
        // Simulate "fetching" from provider
        setTimeout(() => {
            setIsLoading(null);
            setSocialProvider(provider);
            // Pre-fill with "fetched" data or leave empty for user to fill
            setSocialData({
                name: "Your Name",
                email: `user@${provider.toLowerCase()}.com`
            });
            setShowSocialDialog(true);
        }, 1000);
    };

    const confirmSocialLogin = () => {
        setIsLoading('confirm');
        setTimeout(() => {
            // Mock successful login with CONFIRMED data
            toast({
                title: "Welcome to PrintMarkt!",
                description: `Account created with ${socialProvider}.`,
            });

            localStorage.setItem("user_session", JSON.stringify({
                isLoggedIn: true,
                provider: socialProvider,
                email: socialData.email,
                name: socialData.name
            }));

            router.push("/dashboard");
        }, 800);
    };

    const handleEmailLogin = async () => {
        if (!emailState) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading('email');

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(null);

            toast({
                title: "Login Successful",
                description: `Welcome back!`,
            });

            // Extract name from email for better UX
            const derivedName = emailState.split('@')[0];
            const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

            localStorage.setItem("user_session", JSON.stringify({
                isLoggedIn: true,
                provider: 'email',
                email: emailState,
                name: formattedName
            }));

            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 animate-in fade-in duration-500">
            {/* Social Login Completion Dialog */}
            <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete your account</DialogTitle>
                        <DialogDescription>
                            We successfully connected to {socialProvider}. Please confirm your details to finish setup.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={socialData.name}
                                onChange={(e) => setSocialData({ ...socialData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                value={socialData.email}
                                onChange={(e) => setSocialData({ ...socialData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={confirmSocialLogin} disabled={isLoading === 'confirm'}>
                            {isLoading === 'confirm' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Zap className="mr-2 h-6 w-6" />
                    PrintMarkt
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform has completely transformed how we manage our print-on-demand business. The quality and speed are unmatched.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <label className="sr-only" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading !== null}
                                        value={emailState}
                                        onChange={(e) => setEmailState(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button disabled={isLoading !== null}>
                                    {isLoading === 'email' && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Sign In with Email
                                </Button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Button variant="outline" type="button" disabled={isLoading !== null} onClick={() => handleSocialClick('Google')}>
                                {isLoading === 'Google' ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                                )}
                                Google
                            </Button>
                            <Button variant="outline" type="button" disabled={isLoading !== null} onClick={() => handleSocialClick('Facebook')}>
                                {isLoading === 'Facebook' ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.048 0-2.733.984-2.733 2.582v1.39h4.525l-.665 3.667h-3.86v7.98h-5.08z" />
                                    </svg>
                                )}
                                Facebook
                            </Button>
                        </div>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
