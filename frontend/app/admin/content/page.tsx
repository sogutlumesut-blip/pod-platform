"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

interface SiteConfig {
    key: string;
    value: string;
    group: string;
    type: string;
    label: string;
}

export default function AdminContentPage() {
    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/site-config`);
            const data = await res.json();
            console.log("Fetched Site Configs:", data); // DEBUG
            setConfigs(data);
        } catch (error) {
            console.error("Failed to fetch configs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (key: string, value: string) => {
        setConfigs((prev) =>
            prev.map((config) => (config.key === key ? { ...config, value } : config))
        );
    };

    const saveConfigs = async () => {
        setSaving(true);
        try {
            await fetch(`${API_URL}/admin/site-config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(configs),
            });
            // Show success toast here if we had one
        } catch (error) {
            console.error("Failed to save configs", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Group by group name
    const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.group]) acc[config.group] = [];
        acc[config.group].push(config);
        return acc;
    }, {} as Record<string, SiteConfig[]>);

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground">Manage public site content and text.</p>
                </div>
                <Button onClick={saveConfigs} disabled={saving} className="bg-primary hover:bg-primary/90">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            {Object.entries(groupedConfigs).map(([group, filteredConfigs]) => (
                <Card key={group}>
                    <CardHeader>
                        <CardTitle className="capitalize">{group.replace('.', ' ')}</CardTitle>
                        <CardDescription>Content settings for the {group.split('.').pop()} section</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredConfigs.map((config) => (
                            <div key={config.key} className="grid gap-2">
                                <Label htmlFor={config.key}>{config.label}</Label>
                                {config.type === 'image' ? (
                                    <Input
                                        id={config.key}
                                        value={config.value}
                                        onChange={(e) => handleUpdate(config.key, e.target.value)}
                                        placeholder="Image URL..."
                                    />
                                ) : (
                                    <Input
                                        id={config.key}
                                        value={config.value}
                                        onChange={(e) => handleUpdate(config.key, e.target.value)}
                                    />
                                )}
                                <p className="text-xs text-muted-foreground">Key: {config.key}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}

            {configs.length === 0 && !loading && (
                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No content configurations found.
                </div>
            )}
        </div>
    );
}
