import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Book, FileText, Settings, Terminal } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container py-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">Documentation</h1>
                        <p className="text-xl text-muted-foreground">
                            Everything you need to integrate and build with our POD platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="#" className="group block space-y-3 rounded-lg border p-6 hover:border-primary transition-colors hover:shadow-md">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Book className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">Getting Started</h3>
                            <p className="text-sm text-muted-foreground">Learn the basics of setting up your account and creating your first product.</p>
                        </Link>

                        <Link href="#" className="group block space-y-3 rounded-lg border p-6 hover:border-primary transition-colors hover:shadow-md">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Terminal className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">API Reference</h3>
                            <p className="text-sm text-muted-foreground">Detailed API endpoints for orders, products, and webhooks.</p>
                        </Link>

                        <Link href="#" className="group block space-y-3 rounded-lg border p-6 hover:border-primary transition-colors hover:shadow-md">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">Integrations</h3>
                            <p className="text-sm text-muted-foreground">Connect with Shopify, Etsy, and WooCommerce.</p>
                        </Link>

                        <Link href="#" className="group block space-y-3 rounded-lg border p-6 hover:border-primary transition-colors hover:shadow-md">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">Mockup Guidelines</h3>
                            <p className="text-sm text-muted-foreground">Best practices for preparing your print files.</p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
