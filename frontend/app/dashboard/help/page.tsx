"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, MessageCircle, User, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HelpCenterPage() {
    return (
        <div className="container mx-auto py-10 max-w-5xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
                <p className="text-muted-foreground">Get in touch with our support team or your personal manager.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Support Team Card */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Support Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Support</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href="mailto:support@printmarkt.com" className="hover:text-primary transition-colors">support@printmarkt.com</a>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span className="font-mono">37126261210</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white h-12 text-lg font-medium">
                            Send a message
                        </Button>
                    </CardContent>
                </Card>

                {/* Personal Manager Card */}
                <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Your Personal Manager</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden relative border">
                                <Image
                                    src="/placeholder-avatar.jpg"
                                    alt="Daniel"
                                    fill
                                    className="object-cover"
                                />
                                {/* Fallback if image fails (since we don't have the real asset easily) */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                                    <User className="h-6 w-6 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Daniel</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href="mailto:daniel@printmarkt.com" className="hover:text-primary transition-colors">daniel@printmarkt.com</a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button className="w-full bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white h-12 text-lg font-medium">
                                Send a message
                            </Button>
                            <Button variant="outline" className="w-full h-12 text-lg font-medium border-slate-300">
                                <Calendar className="mr-2 h-4 w-4" /> Book a Call
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Resources (Optional) */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">Knowledge Base</h3>
                            <p className="text-sm text-muted-foreground">Read our guides and FAQs</p>
                        </div>
                    </CardContent>
                </Card>
                {/* Add more as needed */}
            </div>
        </div>
    );
}
