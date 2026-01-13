```javascript
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Calculator, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock Data for Textures
const TEXTURES = [
    { id: "t1", name: "Non-Woven Wallpaper", pricePerSqm: 25, image: "/placeholder-texture-1.jpg" },
    { id: "t2", name: "Textured Vinyl", pricePerSqm: 35, image: "/placeholder-texture-2.jpg" },
    { id: "t3", name: "Peel & Stick", pricePerSqm: 40, image: "/placeholder-texture-3.jpg" },
    { id: "t4", name: "Canvas Fabric", pricePerSqm: 45, image: "/placeholder-texture-4.jpg" },
];

export function ProductCalculator() {
  const [stockCode, setStockCode] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [unit, setUnit] = useState("CM");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate Price functionality
  useEffect(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const q = parseInt(quantity);
    const texture = TEXTURES.find(t => t.id === selectedTexture);

    if (w && h && q && texture) {
        // Area in Square Meters (assuming input is CM)
        let area = 0;
        if (unit === "CM") {
            area = (w / 100) * (h / 100);
        } else {
             // Basic Inch to Meter conversion: 1 Inch = 0.0254 Meters
             area = (w * 0.0254) * (h * 0.0254); 
        }
        
        const price = area * texture.pricePerSqm * q;
        setTotalPrice(parseFloat(price.toFixed(2)));
    } else {
        setTotalPrice(null);
    }
  }, [width, height, quantity, selectedTexture, unit]);

  let dimensionsLabel = 'Enter dimensions to see price';
  if (width && height) {
      dimensionsLabel = width + "x" + height + " " + unit + " - " + quantity + " Unit(s)";
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const clearImage = () => {
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
        {/* Header */}
        <div className="bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6 border-b flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <Calculator className="h-5 w-5" />
            </div>
            <div>
                 <h3 className="font-bold text-xl">Custom Size Calculator</h3>
                 <p className="text-sm text-muted-foreground">Configure your custom wallpaper order</p>
            </div>
        </div>

        <div className="p-8 grid gap-8">
            
            {/* Image Upload Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
                <Label className="text-base font-semibold pt-2 text-muted-foreground">Image Select:</Label>
                
                <div onClick={() => !selectedImage && fileInputRef.current?.click()} className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-200 group",
                    selectedImage ? "border-primary/20 bg-primary/5" : "hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer"
                )}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    
                    {selectedImage ? (
                        <div className="relative w-full aspect-video max-w-sm rounded-lg overflow-hidden shadow-sm">
                            <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="font-medium text-foreground">Click to upload image</p>
                                <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

             {/* Stock Code Row */}
             <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-center">
                <Label className="text-base font-semibold text-muted-foreground">Stock Code:</Label>
                <Input 
                    value={stockCode} 
                    onChange={(e) => setStockCode(e.target.value)} 
                    placeholder="Enter stock code (e.g., WL-204)" 
                    className="h-12 max-w-sm font-medium bg-slate-50/50 focus:bg-background transition-colors" 
                />
            </div>

             {/* Unit Selection */}
             <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-center">
                <Label className="text-base font-semibold text-muted-foreground">Unit:</Label>
                <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="h-12 max-w-[180px] bg-slate-50/50 focus:bg-background">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CM">Centimeters (CM)</SelectItem>
                        <SelectItem value="IN">Inches (IN)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Dimensions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-center">
                <Label className="text-base font-semibold text-muted-foreground">Dimensions:</Label>
                <div className="flex items-center gap-4 max-w-lg">
                    <div className="relative flex-1 group">
                        <Input 
                            value={width} 
                            onChange={(e) => setWidth(e.target.value)} 
                            type="number" 
                            placeholder="Width" 
                            className="h-12 pr-16 bg-slate-50/50 focus:bg-background transition-colors font-medium" 
                        />
                        <div className="absolute right-0 top-0 h-full px-4 border-l flex items-center justify-center bg-slate-100/50 text-sm font-semibold text-muted-foreground rounded-r-md pointer-events-none">
                            {unit}
                        </div>
                    </div>
                    <span className="text-muted-foreground font-semibold px-2">X</span>
                    <div className="relative flex-1 group">
                        <Input 
                            value={height} 
                            onChange={(e) => setHeight(e.target.value)} 
                            type="number" 
                            placeholder="Height" 
                            className="h-12 pr-16 bg-slate-50/50 focus:bg-background transition-colors font-medium" 
                        />
                        <div className="absolute right-0 top-0 h-full px-4 border-l flex items-center justify-center bg-slate-100/50 text-sm font-semibold text-muted-foreground rounded-r-md pointer-events-none">
                            {unit}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quantity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-center">
                <Label className="text-base font-semibold text-muted-foreground">Quantity:</Label>
                <Input 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    type="number" 
                    min="1" 
                    className="h-12 max-w-[120px] bg-slate-50/50 focus:bg-background font-medium text-center" 
                />
            </div>

            {/* Material/Texture Selection Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
                <Label className="text-base font-semibold pt-3 text-muted-foreground">Material:</Label>
                <Select value={selectedTexture} onValueChange={setSelectedTexture}>
                    <SelectTrigger className="h-14 max-w-md bg-slate-50/50 focus:bg-background">
                        <SelectValue placeholder="Select Material / Texture" />
                    </SelectTrigger>
                    <SelectContent>
                        {TEXTURES.map((texture) => (
                            <SelectItem key={texture.id} value={texture.id} className="py-3">
                                <div className="flex items-center justify-between w-full min-w-[300px]">
                                    <span className="font-semibold text-base">{texture.name}</span>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">${texture.pricePerSqm}/m²</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

             {/* Sample Request Row */}
             <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-center">
                <Label className="text-base font-semibold text-muted-foreground">Request Sample:</Label>
                 <Select defaultValue="no">
                    <SelectTrigger className="h-12 max-w-[240px] bg-slate-50/50 focus:bg-background">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no">No Sample</SelectItem>
                        <SelectItem value="yes">Yes, include sample (+ $5.00)</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            {/* Price Display */}
            <div className="mt-8 p-8 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-1 relative z-10">
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">Total Estimated Price</div>
                    <div className="text-sm text-slate-400">
                        {dimensionsLabel}
                    </div>
                </div>
                <div className="text-4xl font-bold tracking-tight relative z-10">
                    {totalPrice !== null ? "$" + totalPrice.toFixed(2) : "$0.00"}
                </div>
            </div>

        </div>
    </div>
  );
}
```
