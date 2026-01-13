"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/config";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for initial view (until fetch logic is verified)
const mockUsers = [
    { id: 1, full_name: "Mesut Sogutlu", email: "mesut@example.com", is_active: false, created_at: "2024-01-09T10:00:00" },
    { id: 2, full_name: "Demo User", email: "demo@example.com", is_active: true, created_at: "2024-01-08T15:30:00" },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState("");

    const handleActivate = async (id: number) => {
        // Optimistic update
        setUsers(users.map(u => u.id === id ? { ...u, is_active: true } : u));
        try {
            await fetch(`${API_URL}/admin/users/${id}/activate`, { method: 'POST' });
            // Refresh logic would go here
            console.log("Activated user", id);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeactivate = async (id: number) => {
        // Optimistic update
        setUsers(users.map(u => u.id === id ? { ...u, is_active: false } : u));
        try {
            await fetch(`${API_URL}/admin/users/${id}/deactivate`, { method: 'POST' });
            // Refresh logic would go here
            console.log("Deactivated user", id);
        } catch (e) {
            console.error(e);
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage user access and account status.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.full_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? "bg-green-500 hover:bg-green-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    {user.is_active ? (
                                        <Button variant="ghost" size="sm" onClick={() => handleDeactivate(user.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <XCircle className="h-4 w-4 mr-1" /> Deactivate
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" onClick={() => handleActivate(user.id)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Activate
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
