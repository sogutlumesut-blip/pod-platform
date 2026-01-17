"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        stripe_public_key: "",
        stripe_secret_key: "",
        stripe_enabled: false,
        paypal_client_id: "",
        paypal_secret_key: "",
        paypal_enabled: false
    });

    useEffect(() => {
        // Fetch current config (we need a new endpoint for admin to get secrets, 
        // OR we just assume blank for security and only allow overwrite)
        // For prototype simplicity, we'll start blank or could add a 'GET /admin/config/payment'
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/admin/config/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                alert("Payment settings saved!");
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Payment Integration</h2>
                <p className="text-muted-foreground">Configure payment gateways like Stripe and PayPal.</p>
            </div>

            {/* Stripe Config */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Stripe</CardTitle>
                            <CardDescription>Accept credit card payments directly on your site.</CardDescription>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Label htmlFor="stripe-mode">Enable</Label>
                            <Switch
                                id="stripe-mode"
                                checked={config.stripe_enabled}
                                onCheckedChange={(c) => setConfig({ ...config, stripe_enabled: c })}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Publishable Key</Label>
                        <Input
                            value={config.stripe_public_key}
                            onChange={(e) => setConfig({ ...config, stripe_public_key: e.target.value })}
                            placeholder="pk_test_..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input
                            type="password"
                            value={config.stripe_secret_key}
                            onChange={(e) => setConfig({ ...config, stripe_secret_key: e.target.value })}
                            placeholder="sk_test_..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* PayPal Config */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#003087] text-white rounded-full flex items-center justify-center font-bold italic">
                            P
                        </div>
                        <div>
                            <CardTitle>PayPal</CardTitle>
                            <CardDescription>Allow customers to pay via PayPal wallet.</CardDescription>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Label htmlFor="paypal-mode">Enable</Label>
                            <Switch
                                id="paypal-mode"
                                checked={config.paypal_enabled}
                                onCheckedChange={(c) => setConfig({ ...config, paypal_enabled: c })}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input
                            value={config.paypal_client_id}
                            onChange={(e) => setConfig({ ...config, paypal_client_id: e.target.value })}
                            placeholder="client_id_..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input
                            type="password"
                            value={config.paypal_secret_key}
                            onChange={(e) => setConfig({ ...config, paypal_secret_key: e.target.value })}
                            placeholder="secret_..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </div>
    );
}
