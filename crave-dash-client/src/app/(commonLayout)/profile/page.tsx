"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    const [name, setName] = useState("Arfan Hossain");
    const [email, setEmail] = useState("arfan@example.com");
    const [phone, setPhone] = useState("017XXXXXXXX");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

    const passwordStrength = useMemo(() => {
        if (!newPassword) return "";
        if (newPassword.length < 8) return "Weak";
        if (newPassword.length < 12) return "Medium";
        return "Strong";
    }, [newPassword]);

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!name.trim()) nextErrors.name = "Name is required.";
        if (!email.trim() || !email.includes("@")) nextErrors.email = "Enter a valid email address.";
        if (!phone.trim()) nextErrors.phone = "Phone number is required.";

        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) nextErrors.currentPassword = "Current password is required.";
            if (newPassword.length < 8) nextErrors.newPassword = "New password must be at least 8 characters.";
            if (newPassword !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSave = () => {
        setSaved(false);
        if (validate()) {
            setSaved(true);
            setErrors({});
        }
    };

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Profile</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Account Settings</h1>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Edit Profile</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal information.</p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                                    <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                                    {errors.name && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.name}</p>}
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950" />
                                    </div>
                                    {errors.email && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-950" />
                                    </div>
                                    {errors.phone && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                    <LockKeyhole className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Change Password</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Leave blank if you do not want to update your password.</p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                                    <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                                    {errors.currentPassword && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.currentPassword}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                    <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                                    {errors.newPassword && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.newPassword}</p>}
                                    {passwordStrength && <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Strength: {passwordStrength}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                    <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                                    {errors.confirmPassword && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="h-fit space-y-6 rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-950">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-slate-100">Account Status</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your profile is active and ready for orders.</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Notifications</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Order updates enabled</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Promotions enabled</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Email receipts enabled</li>
                            </ul>
                        </div>

                        <Button onClick={handleSave} className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            Save Changes
                        </Button>

                        {saved && (
                            <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-300">
                                Profile saved successfully.
                            </p>
                        )}
                    </aside>
                </section>
            </div>
        </main>
    );
}
