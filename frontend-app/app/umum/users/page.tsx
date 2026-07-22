"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Lock, Power, PowerOff, Loader2 } from "lucide-react";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "pemohon",
        unit_kerja: "",
        is_active: true,
    });
    const [resetPassword, setResetPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (!res.ok) throw new Error("Gagal mengambil data user");
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (user?: any) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                password: "", // Leave blank for edit
                role: user.roles?.[0]?.name || user.role,
                unit_kerja: user.unit_kerja || "",
                is_active: user.is_active,
            });
        } else {
            setSelectedUser(null);
            setFormData({
                name: "",
                username: "",
                email: "",
                password: "",
                role: "pemohon",
                unit_kerja: "",
                is_active: true,
            });
        }
        setIsFormOpen(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const url = selectedUser
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedUser.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
            
            const method = selectedUser ? "PUT" : "POST";
            
            // Remove password from payload if editing and it's blank
            const payload = { ...formData };
            if (selectedUser && !payload.password) {
                delete (payload as any).password;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal menyimpan user");
            }

            setIsFormOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        if (!confirm(`Yakin ingin ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} user ini?`)) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/toggle-active`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal update status");
            }
            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedUser.id}/reset-password`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ password: resetPassword }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal reset password");
            }

            setIsResetOpen(false);
            setResetPassword("");
            alert("Password berhasil direset!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                        <p className="text-gray-500">Kelola data pengguna sistem</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Daftar Pengguna</h2>
                    <button
                        onClick={() => handleOpenForm()}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah User
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-10">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500">Nama</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500">Username</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500">Role</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500">Unit Kerja</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-gray-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                                        <td className="py-3 px-4 text-gray-600">@{user.username}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                                                {user.roles?.[0]?.name || user.role || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 text-sm">{user.unit_kerja || '-'}</td>
                                        <td className="py-3 px-4">
                                            {user.is_active ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Aktif</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Non-Aktif</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenForm(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition tooltip"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedUser(user); setIsResetOpen(true); }}
                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                                title="Reset Password"
                                            >
                                                <Lock className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                                className={`p-2 rounded-lg transition ${
                                                    user.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                                                }`}
                                                title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                                            >
                                                {user.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FORM MODAL (CREATE / EDIT) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{selectedUser ? 'Edit User' : 'Tambah User'}</h2>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            {!selectedUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option value="superadmin">Super Admin</option>
                                    <option value="pemohon">Pemohon</option>
                                    <option value="sekretariat">Sekretariat</option>
                                    <option value="kabag_tu">Kabag TU</option>
                                    <option value="wakil_dekan">Wakil Dekan</option>
                                    <option value="dekan">Dekan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja (Opsional)</label>
                                <input
                                    type="text"
                                    value={formData.unit_kerja}
                                    onChange={(e) => setFormData({ ...formData, unit_kerja: e.target.value })}
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center gap-2"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {isResetOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Masukkan password baru untuk <strong>{selectedUser?.name}</strong>.
                        </p>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    required
                                    placeholder="Password Baru"
                                    minLength={6}
                                    className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsResetOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || resetPassword.length < 6}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
