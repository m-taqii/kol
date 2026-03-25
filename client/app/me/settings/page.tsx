import { CURRENT_USER } from "../data/mock";

export default function SettingsPage() {
    return (
        <div className="p-6 lg:p-8 max-w-[600px] mx-auto">
            <h1 className="text-[28px] font-bold text-[#ededed] mb-8">Settings</h1>

            {/* Profile Section */}
            <section className="mb-10">
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                    Profile
                </p>
                <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xl font-bold text-[#ededed]">
                            {CURRENT_USER.initials}
                        </div>
                        <div>
                            <p className="text-[#ededed] font-semibold">{CURRENT_USER.name}</p>
                            <p className="text-[#5a5a5a] text-sm">@{CURRENT_USER.username}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-[#5a5a5a] text-xs mb-1.5">Full Name</label>
                            <input
                                type="text"
                                defaultValue={CURRENT_USER.name}
                                className="w-full bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#ededed] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[#5a5a5a] text-xs mb-1.5">Username</label>
                            <input
                                type="text"
                                defaultValue={CURRENT_USER.username}
                                className="w-full bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#ededed] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[#5a5a5a] text-xs mb-1.5">Email</label>
                            <input
                                type="email"
                                defaultValue="alex@example.com"
                                className="w-full bg-[#0c0c0c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#ededed] outline-none"
                            />
                        </div>
                    </div>

                    <button className="mt-5 bg-[#ededed] text-[#0c0c0c] font-semibold text-sm px-5 py-2 rounded-lg">
                        Save Changes
                    </button>
                </div>
            </section>



            {/* Appearance Section */}
            <section className="mb-10">
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                    Appearance
                </p>
                <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#ededed] text-sm font-medium">Theme</p>
                            <p className="text-[#5a5a5a] text-xs">Choose your preferred look</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-[#0c0c0c] border border-[#c4a882] text-[#ededed] text-xs font-medium">
                                Dark
                            </button>
                            <button className="px-3 py-1.5 rounded-lg bg-[#0c0c0c] border border-[#2a2a2a] text-[#5a5a5a] text-xs">
                                Light
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section>
                <p className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-widest mb-4">
                    Danger Zone
                </p>
                <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#ededed] text-sm font-medium">Delete Account</p>
                            <p className="text-[#5a5a5a] text-xs">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <button className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10">
                            Delete
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
