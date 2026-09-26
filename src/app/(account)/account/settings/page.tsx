import type { Metadata } from "next";
import { getCurrentUser, updateProfile, changePassword, exportMyData, deleteMyAccount } from "@/lib/account/actions";
import { User, Lock, Download, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-charcoal/60">Please sign in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-deep">Account Settings</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-navy-deep">
            <User className="h-4 w-4" /> Profile Information
          </h3>
          <form action={async (fd: FormData) => { "use server"; await updateProfile(fd); }} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/60">Email</label>
              <input value={user.email} disabled className="w-full rounded-lg border border-cream-dark bg-cream/30 px-3 py-2 text-sm text-charcoal/50" />
              <p className="mt-1 text-xs text-charcoal/60">Email cannot be changed</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/60">Name</label>
              <input name="name" defaultValue={user.name ?? ""} className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/60">Phone</label>
              <input name="phone" defaultValue={user.phone ?? ""} className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
            </div>
            <button type="submit" className="rounded-lg bg-navy-deep px-4 py-2 text-sm font-medium text-cream hover:bg-navy">
              Save Changes
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-navy-deep">
            <Lock className="h-4 w-4" /> Change Password
          </h3>
          <form action={async (fd: FormData) => { "use server"; await changePassword(fd); }} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/60">Current Password</label>
              <input name="currentPassword" type="password" required className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-charcoal/60">New Password</label>
              <input name="newPassword" type="password" required minLength={8} className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
              <p className="mt-1 text-xs text-charcoal/60">Minimum 8 characters</p>
            </div>
            <button type="submit" className="rounded-lg bg-navy-deep px-4 py-2 text-sm font-medium text-cream hover:bg-navy">
              Update Password
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h3 className="mb-3 font-medium text-navy-deep">Account Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/50">Role</span>
              <span className="capitalize text-charcoal/70">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/50">Member since</span>
              <span className="text-charcoal/70">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Data Rights */}
        <div className="rounded-xl border border-cream-dark bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-navy-deep">
            <Download className="h-4 w-4" /> Your Data Rights
          </h3>
          <p className="mb-4 text-xs text-charcoal/50">
            Under data protection regulations, you have the right to access and delete your personal data.
          </p>
          <div className="flex flex-wrap gap-3">
            <form action={async () => {
              "use server";
              const data = await exportMyData();
              // In production, this would generate a downloadable file
              // For now, the action is wired and returns the data
              console.log("Data export:", JSON.stringify(data, null, 2));
            }}>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-navy-deep/20 px-4 py-2 text-sm font-medium text-navy-deep hover:bg-navy-deep/5">
                <Download className="h-3.5 w-3.5" /> Export My Data
              </button>
            </form>
            <form action={async () => {
              "use server";
              await deleteMyAccount();
            }}>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-kente-red/30 px-4 py-2 text-sm font-medium text-kente-red hover:bg-kente-red/5" onClick={(e) => { if (!confirm("Are you sure? This will permanently delete your account and personal data. This cannot be undone.")) e.preventDefault(); }}>
                <Trash2 className="h-3.5 w-3.5" /> Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
