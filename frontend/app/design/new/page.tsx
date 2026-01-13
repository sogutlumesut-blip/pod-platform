"use client";

import { DesignEditorLayout } from "@/components/design/DesignEditorLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Type, Square, Upload, Layers, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// We will implement the actual Fabric canvas logic in a separate hook/component
// import { useFabricCanvas } from "@/hooks/useFabricCanvas"; 
import { useCanvas } from "@/components/design/useCanvas";
import { cn } from "@/lib/utils";

export default function DesignEditorPage() {
    const { canvasRef, addText, addImage, deleteSelected } = useCanvas();
    const [activeTool, setActiveTool] = useState("upload");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                if (f.target?.result) {
                    addImage(f.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DesignEditorLayout
            sidebar={
                <div className="h-full flex flex-row sm:flex-row">
                    {/* Icon Toolbar */}
                    <div className="w-[80px] border-r h-full flex flex-col items-center py-4 gap-4 bg-slate-50/50">
                        <ToolButton
                            icon={Upload}
                            label="Upload"
                            isActive={activeTool === "upload"}
                            onClick={() => setActiveTool("upload")}
                        />
                        <ToolButton
                            icon={Type}
                            label="Text"
                            isActive={activeTool === "text"}
                            onClick={() => setActiveTool("text")}
                        />
                        <ToolButton
                            icon={Square}
                            label="Shapes"
                            isActive={activeTool === "shapes"}
                            onClick={() => setActiveTool("shapes")}
                        />

                        <div className="mt-auto flex flex-col gap-4">
                            <ToolButton
                                icon={Trash2}
                                label="Delete"
                                isActive={false}
                                onClick={deleteSelected}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            />
                        </div>
                    </div>

                    {/* Tool Options Panel */}
                    <div className="flex-1 p-4 hidden sm:block overflow-y-auto">
                        <h2 className="font-bold text-lg mb-4 capitalize">{activeTool}</h2>
                        {activeTool === "upload" && (
                            <div className="space-y-4">
                                <Button
                                    className="w-full h-12 border-dashed border-2"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Click to Upload Image
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <p className="text-xs text-muted-foreground text-center">
                                    Supported formats: JPG, PNG, SVG
                                </p>
                            </div>
                        )}
                        {activeTool === "text" && (
                            <div className="space-y-2">
                                <Button variant="outline" onClick={() => addText("Heading")} className="w-full justify-start text-lg font-bold">Add Heading</Button>
                                <Button variant="outline" onClick={() => addText("Subheading")} className="w-full justify-start text-base font-semibold">Add Subheading</Button>
                                <Button variant="outline" onClick={() => addText("Your Text")} className="w-full justify-start text-sm">Add Body Text</Button>
                            </div>
                        )}
                        {/* Other tools placeholders */}
                    </div>
                </div>
            }
            propertiesPanel={
                <div className="p-4">
                    <h3 className="font-bold text-sm mb-4">Properties</h3>
                    <div className="text-sm text-slate-500 text-center border p-8 rounded-lg border-dashed">
                        Select an object to edit properties
                    </div>
                </div>
            }
            onSave={() => console.log("Save clicked")}
            onExport={() => console.log("Export clicked")}
        >
            {/* The Canvas Itself */}
            <div className="relative shadow-2xl border border-slate-200 bg-white">
                <canvas ref={canvasRef} />
            </div>
        </DesignEditorLayout>
    );
}

function ToolButton({ icon: Icon, label, isActive, onClick, className }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all",
                isActive
                    ? "bg-[#FF6B55] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-200",
                className
            )}
        >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
