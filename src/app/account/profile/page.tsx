export default function AccountProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy">My Profile</h1>

      <div className="border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Personal Information</h2>
        <form className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-body">First Name</label>
              <input type="text" defaultValue="John" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-body">Last Name</label>
              <input type="text" defaultValue="Doe" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-body">Email</label>
            <input type="email" defaultValue="john@example.com" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-body">Phone</label>
            <input type="tel" defaultValue="+233 24 123 4567" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
          </div>
          <button type="submit" className="border border-navy bg-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold">
            Save Changes
          </button>
        </form>
      </div>

      <div className="border border-line bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Change Password</h2>
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-body">Current Password</label>
            <input type="password" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-body">New Password</label>
            <input type="password" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-body">Confirm New Password</label>
            <input type="password" className="mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none" />
          </div>
          <button type="submit" className="border border-navy bg-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
