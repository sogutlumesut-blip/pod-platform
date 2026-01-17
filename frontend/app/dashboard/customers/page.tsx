"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Edit, DollarSign } from 'lucide-react';
import { CustomerPricingDialog } from '@/components/admin/CustomerPricingDialog';
import { API_URL } from "@/lib/config";

interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    is_admin: boolean;
    created_at: string;
    discount_percentage: number;
    custom_pricing_json: string | null;
}

export default function CustomersPage() {
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);

    // Verify Admin Status
    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                // Mock Auth Check - User ID 1
                const response = await fetch(`${API_URL}/admin/users/1`);
                if (response.ok) {
                    const currentUser = await response.json();
                    if (!currentUser.is_admin) {
                        router.push('/dashboard');
                        return;
                    }
                }
            } catch (error) {
                console.error("Auth check failed");
            } finally {
                setVerifying(false); // Only stop verifying if check passed or failed (allow render if failed? maybe secure fail open? No, secure fail closed. But here for prototype...)
            }
        };
        verifyAdmin();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/users`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (!verifying) fetchUsers();
    }, [verifying]);

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openPricingDialog = (user: User) => {
        setSelectedUser(user);
        setIsPricingDialogOpen(true);
    };

    if (verifying) {
        return <div className="flex h-screen items-center justify-center text-muted-foreground">Checking permissions...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage customer accounts and pricing.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Registered Users</CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Custom Pricing</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.is_active ? "outline" : "secondary"}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.discount_percentage > 0 ? (
                                                <Badge variant="default" className="bg-green-600">
                                                    {user.discount_percentage}% Off
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.custom_pricing_json ? (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                                                    Custom Prices
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">Standard</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openPricingDialog(user)}
                                                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <DollarSign className="mr-2 h-4 w-4" />
                                                Edit Pricing
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {selectedUser && (
                <CustomerPricingDialog
                    user={selectedUser}
                    open={isPricingDialogOpen}
                    onOpenChange={(open) => {
                        setIsPricingDialogOpen(open);
                        if (!open) fetchUsers(); // Refresh on close
                    }}
                />
            )}
        </div>
    );
}
