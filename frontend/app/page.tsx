"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Check, Palette, Rocket, Zap, Search, Menu, Printer, Globe, Leaf } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Image from "next/image";
import { API_URL } from "@/lib/config";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API_URL}/admin/site-config`)
      .then(res => res.json())
      .then((data: any[]) => {
        const contentMap: Record<string, string> = {};
        data.forEach(item => contentMap[item.key] = item.value);
        setSiteContent(contentMap);
      })
      .catch(err => console.error("Failed to load site content", err));
  }, []);

  const t = (key: string, defaultVal: string) => siteContent[key] || defaultVal;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">

          {/* Logo */}
          <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-slate-900 shrink-0">
            <div className="h-9 w-9 bg-[#FF6B55] rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/20 transform rotate-3">
              <Printer className="h-5 w-5" />
            </div>
            <span>Print<span className="text-[#FF6B55]">Markt</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-[#FF6B55] transition-colors">Catalog</Link>
            <Link href="#" className="hover:text-[#FF6B55] transition-colors">How it works</Link>
            <Link href="#" className="hover:text-[#FF6B55] transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-[#FF6B55] transition-colors">Blog</Link>
            <Link href="#" className="hover:text-[#FF6B55] transition-colors">Help Center</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="font-semibold text-slate-700 hover:text-[#FF6B55] hover:bg-orange-50">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="font-bold bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white px-6 shadow-md shadow-orange-500/10">
                Start Selling
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-xl">PrintMarkt</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="#" className="text-lg font-medium hover:text-[#FF6B55]">Catalog</Link>
                  <Link href="#" className="text-lg font-medium hover:text-[#FF6B55]">How it works</Link>
                  <Link href="/auth/login" className="text-lg font-medium">Log In</Link>
                  <Button className="w-full bg-[#FF6B55] text-white">Start Selling</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-white">
          <div className="container relative z-10 flex flex-col items-center text-center px-4">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-50"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B55] mr-2"></span>
              The #1 Choice for Custom Wall Art
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 max-w-5xl leading-[1.05] mb-8"
            >
              Create & Sell Custom <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B55] to-orange-400">Wallpaper</span> Globally
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed"
            >
              PrintMarkt connects your store to our premium production network.
              Sell stunning wallpapers, canvas, and posters without inventory.
              Review orders, track shipping, and grow your brand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto"
            >
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button className="w-full h-14 px-10 text-lg font-bold bg-[#FF6B55] hover:bg-[#FF6B55]/90 text-white rounded-xl shadow-xl shadow-orange-500/20">
                  Start for Free
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-14 px-10 text-lg font-bold border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl">
                Order Sample
              </Button>
            </motion.div>

            {/* Abstract Wallpaper Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-6xl mx-auto"
            >
              <div className="relative aspect-[16/9] md:aspect-[2.2/1] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Mockup Elements */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  {/* Abstract Representations of Wallpaper Rolls */}
                  <div className="w-48 h-[120%] bg-gradient-to-b from-blue-100 to-blue-50 transform rotate-12 -translate-x-32 translate-y-12 rounded-lg shadow-lg border border-white/50"></div>
                  <div className="w-48 h-[120%] bg-gradient-to-b from-orange-100 to-orange-50 transform -rotate-6 translate-x-0 translate-y-4 rounded-lg shadow-2xl z-10 border border-white/50 flex flex-col items-center justify-center">
                    <Palette className="h-16 w-16 text-[#FF6B55] opacity-50 mb-4" />
                    <span className="font-bold text-[#FF6B55]/50 uppercase tracking-widest text-sm">Premium Vinyl</span>
                  </div>
                  <div className="w-48 h-[120%] bg-gradient-to-b from-green-100 to-green-50 transform -rotate-12 translate-x-32 translate-y-12 rounded-lg shadow-lg border border-white/50"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20"></div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Product Catalog Preview */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to sell wall art</h2>
              <p className="text-lg text-slate-600">From peel-and-stick wallpaper to museum-grade canvas, we have the premium substrates your customers love.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Wallpaper Card */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div className="h-64 bg-slate-100 relative overflow-hidden">
                  {/* Placeholder Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Box className="h-16 w-16 text-slate-300" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Wallpaper</h3>
                  <p className="text-slate-500 mb-6">Peel & stick, pre-pasted, and traditional vinyl options. Perfect for residential and commercial spaces.</p>
                  <Button variant="link" className="p-0 h-auto font-bold text-[#FF6B55] hover:text-[#e0503a]">
                    View Materials <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Canvas Card */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div className="h-64 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-slate-300" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Canvas Prints</h3>
                  <p className="text-slate-500 mb-6">Hand-stretched over solid wood frames. matte, satin, or metallic finishes available.</p>
                  <Button variant="link" className="p-0 h-auto font-bold text-[#FF6B55] hover:text-[#e0503a]">
                    View Sizes <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Posters Card */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div className="h-64 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-16 w-16 text-slate-300" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Fine Art Posters</h3>
                  <p className="text-slate-500 mb-6">Museum-quality paper with archival inks. Available framed or unframed in 40+ sizes.</p>
                  <Button variant="link" className="p-0 h-auto font-bold text-[#FF6B55] hover:text-[#e0503a]">
                    View Papers <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <div className="inline-flex items-center rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-bold text-[#FF6B55] mb-6">
                  Why PrintMarkt?
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  Premium Quality, <br />
                  Global Reach.
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  We built PrintMarkt for designers who demand the best. Our proprietary printing technology ensures vibrant colors and sharp details on every roll.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-1">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Eco-Friendly Production</h4>
                      <p className="text-slate-500">Water-based inks and FSC-certified paper sources.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Global Shipping</h4>
                      <p className="text-slate-500">Low shipping rates to US, EU, and UK with tracking.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-1">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Automatic Sync</h4>
                      <p className="text-slate-500">Orders from your store are sent to production automatically.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="relative h-[500px] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-30">
                  <Printer className="h-32 w-32 mx-auto mb-4 text-slate-900" />
                  <div className="text-2xl font-black uppercase text-slate-900">Print Facility <br />Mockup</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-6">
                <div className="h-8 w-8 bg-[#FF6B55] rounded flex items-center justify-center text-white">
                  <Printer className="h-4 w-4" />
                </div>
                <span>PrintMarkt</span>
              </div>
              <p className="text-sm leading-relaxed">
                The premium print-on-demand platform for custom wallpaper and wall art.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Products</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Wallpaper</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Canvas Prints</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Posters</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Sample Packs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Copyright</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; 2024 PrintMarkt Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white">Twitter</Link>
              <Link href="#" className="hover:text-white">Instagram</Link>
              <Link href="#" className="hover:text-white">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
