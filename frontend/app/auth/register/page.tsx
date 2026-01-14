"use client";

import { Button } from "@/components/ui/button";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countryCode, setCountryCode] = useState("+1");

    // Form State
    const [formData, setFormData] = useState({
        email: "",
        confirmEmail: "",
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.fullName || !formData.password) {
            toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        if (formData.email !== formData.confirmEmail) {
            toast({ title: "Error", description: "Emails do not match.", variant: "destructive" });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }
        if (!formData.terms) {
            toast({ title: "Error", description: "You must agree to the Terms and Conditions.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        // Simulate API Call & Store in localStorage (Mock Backend)
        setTimeout(() => {
            setIsLoading(false);

            // 1. Save User to "Database" (localStorage for Admin Panel visibility)
            const newUser = {
                id: Date.now().toString(),
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: 'customer',
                date: new Date().toISOString(),
                status: 'active'
            };

            const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            localStorage.setItem('mock_users', JSON.stringify([...existingUsers, newUser]));

            // 2. Set Session
            localStorage.setItem("user_session", JSON.stringify({
                isLoggedIn: true,
                provider: 'email',
                email: formData.email,
                name: formData.fullName,
                phone: formData.phone
            }));

            toast({
                title: "Account Created!",
                description: "Welcome to PrintMarkt. (Demo Mode: No email sent)",
            });

            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 animate-in fade-in duration-500">
            {/* Promo Side (Left) */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Zap className="mr-2 h-6 w-6" />
                    PrintMarkt
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <h2 className="text-3xl font-bold">Welcome to PrintMarkt!</h2>
                        <p className="text-lg">
                            Join and go from Prints to Wins with Printseekers – a leader in print on demand wall art, offering personalized service with a dedicated manager for each partner.
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign up with your email address:
                        </h1>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">

                        {/* Email Fields */}
                        <div className="grid gap-4">
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="peer flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50 pt-4"
                                />
                                <label htmlFor="email" className="absolute left-3 top-1 text-xs text-uppercase font-bold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold">
                                    EMAIL *
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="confirmEmail"
                                    name="confirmEmail"
                                    type="email"
                                    required
                                    placeholder=" "
                                    value={formData.confirmEmail}
                                    onChange={handleChange}
                                    className="peer flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50 pt-4"
                                />
                                <label htmlFor="confirmEmail" className="absolute left-3 top-1 text-xs text-uppercase font-bold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold">
                                    CONFIRM EMAIL *
                                </label>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="relative">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                placeholder=" "
                                value={formData.fullName}
                                onChange={handleChange}
                                className="peer flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50 pt-4"
                            />
                            <label htmlFor="fullName" className="absolute left-3 top-1 text-xs text-uppercase font-bold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold">
                                YOUR FULL NAME *
                            </label>
                        </div>

                        {/* Phone Number */}
                        <div className="relative border border-slate-300 rounded-md flex items-center h-12 focus-within:ring-1 focus-within:ring-black">
                            <div className="border-r h-full flex items-center">
                                <Select defaultValue="+1" onValueChange={setCountryCode}>
                                    <SelectTrigger className="w-[90px] h-full border-0 rounded-none focus:ring-0 shadow-none px-2 bg-transparent">
                                        <SelectValue placeholder="+1" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                        <SelectItem value="+90">🇹🇷 +90</SelectItem>
                                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                        <SelectItem value="+31">🇳🇱 +31</SelectItem>
                                        <SelectItem value="+39">🇮🇹 +39</SelectItem>
                                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
                                        <SelectItem value="+1-CA">🇨🇦 +1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-sm outline-none placeholder:text-slate-400 px-3 h-full"
                            />
                            <label htmlFor="phone" className="absolute left-1 -top-2.5 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                                PHONE NUMBER
                            </label>
                        </div>

                        {/* Passwords */}
                        <div className="grid gap-4">
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="peer flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50 pt-4"
                                />
                                <label htmlFor="password" className="absolute left-3 top-1 text-xs text-uppercase font-bold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold">
                                    PASSWORD *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder=" "
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="peer flex h-12 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50 pt-4"
                                />
                                <label htmlFor="confirmPassword" className="absolute left-3 top-1 text-xs text-uppercase font-bold text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold">
                                    CONFIRM PASSWORD *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                            >
                                I agree to the <Link href="/terms" className="text-[#FF6B55] underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-[#FF6B55] underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button className="w-full h-12 font-bold bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white text-lg" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign Up
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
