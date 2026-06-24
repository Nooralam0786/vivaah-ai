'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAuthFromStorage } from '@/lib/auth';

const TABS = ['Account', 'Privacy', 'Notifications', 'Security', 'Preferences'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary-700' : 'bg-neutral-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-vivaah-border last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        {desc && <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');

  const [account, setAccount] = useState({ name: '', email: '', phone: '', language: 'English' });
  const [privacy, setPrivacy] = useState({ showPhone: false, showPhoto: true, profileVisibility: 'all', showOnline: true, hideCaste: false });
  const [notifications, setNotifications] = useState({ newMatch: true, message: true, visitor: true, interest: true, emailDigest: false, smsAlerts: true, pushNotif: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const u = user as unknown as { fullName?: string; email?: string; phone?: string };
    setAccount((prev) => ({ ...prev, name: u.fullName ?? '', email: u.email ?? '', phone: u.phone ?? '' }));
  }, [user]);

  const handleSave = async () => {
    const auth = getAuthFromStorage();
    if (!auth) return;
    setSaved(true);
    try {
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ fullName: account.name }),
      });
    } finally {
      setTimeout(() => setSaved(false), 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar Tabs */}
        <div className="hidden sm:flex w-48 flex-col gap-1 flex-shrink-0">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${activeTab === tab ? 'bg-primary-gradient text-white' : 'text-neutral-600 hover:bg-vivaah-muted hover:text-primary-700'}`}>
              {tab}
            </button>
          ))}
          <div className="mt-4 border-t border-vivaah-border pt-4">
            <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">
              Delete Account
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 scrollbar-hide w-full">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${activeTab === tab ? 'bg-primary-gradient text-white' : 'bg-white border border-vivaah-border text-neutral-600'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-vivaah-border shadow-card p-6">
          {activeTab === 'Account' && (
            <div className="space-y-1">
              <h3 className="font-bold text-neutral-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Full Name', key: 'name', value: account.name },
                  { label: 'Email Address', key: 'email', value: account.email, type: 'email' },
                  { label: 'Mobile Number', key: 'phone', value: account.phone },
                  { label: 'Language', key: 'language', value: account.language },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input type={f.type || 'text'} value={f.value}
                      onChange={(e) => setAccount({ ...account, [f.key]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h4>
                <p className="text-xs text-red-600 mb-3">Once you delete your account, there is no going back. All your data will be permanently deleted.</p>
                <button className="px-4 py-2 border border-red-400 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                  Delete My Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Privacy' && (
            <div>
              <h3 className="font-bold text-neutral-900 mb-4">Privacy Settings</h3>
              <div>
                <SettingRow label="Show Phone Number" desc="Allow matches to see your phone number">
                  <Toggle checked={privacy.showPhone} onChange={(v) => setPrivacy({ ...privacy, showPhone: v })} />
                </SettingRow>
                <SettingRow label="Show Profile Photo" desc="Display your photo to other users">
                  <Toggle checked={privacy.showPhoto} onChange={(v) => setPrivacy({ ...privacy, showPhoto: v })} />
                </SettingRow>
                <SettingRow label="Online Status" desc="Let others see when you're online">
                  <Toggle checked={privacy.showOnline} onChange={(v) => setPrivacy({ ...privacy, showOnline: v })} />
                </SettingRow>
                <SettingRow label="Hide Caste Information" desc="Don't show your caste to other users">
                  <Toggle checked={privacy.hideCaste} onChange={(v) => setPrivacy({ ...privacy, hideCaste: v })} />
                </SettingRow>
                <SettingRow label="Profile Visibility">
                  <select value={privacy.profileVisibility} onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="px-3 py-1.5 border border-vivaah-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-700/20">
                    <option value="all">Everyone</option>
                    <option value="premium">Premium Members Only</option>
                    <option value="matches">Matches Only</option>
                  </select>
                </SettingRow>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div>
              <h3 className="font-bold text-neutral-900 mb-4">Notification Preferences</h3>
              <div>
                <SettingRow label="New Matches" desc="Get notified when you have new matches">
                  <Toggle checked={notifications.newMatch} onChange={(v) => setNotifications({ ...notifications, newMatch: v })} />
                </SettingRow>
                <SettingRow label="New Messages" desc="Notify when you receive a message">
                  <Toggle checked={notifications.message} onChange={(v) => setNotifications({ ...notifications, message: v })} />
                </SettingRow>
                <SettingRow label="Profile Visitors" desc="Know when someone views your profile">
                  <Toggle checked={notifications.visitor} onChange={(v) => setNotifications({ ...notifications, visitor: v })} />
                </SettingRow>
                <SettingRow label="Interest Requests" desc="Notify when someone sends interest">
                  <Toggle checked={notifications.interest} onChange={(v) => setNotifications({ ...notifications, interest: v })} />
                </SettingRow>
                <SettingRow label="Email Digest" desc="Weekly email summary of your activity">
                  <Toggle checked={notifications.emailDigest} onChange={(v) => setNotifications({ ...notifications, emailDigest: v })} />
                </SettingRow>
                <SettingRow label="SMS Alerts" desc="Receive important alerts via SMS">
                  <Toggle checked={notifications.smsAlerts} onChange={(v) => setNotifications({ ...notifications, smsAlerts: v })} />
                </SettingRow>
                <SettingRow label="Push Notifications" desc="Browser and app notifications">
                  <Toggle checked={notifications.pushNotif} onChange={(v) => setNotifications({ ...notifications, pushNotif: v })} />
                </SettingRow>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-5">
              <h3 className="font-bold text-neutral-900">Security Settings</h3>
              <div className="space-y-3">
                {[
                  { title: 'Change Password', desc: 'Update your account password', icon: '🔑', action: 'Change Password' },
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', icon: '🛡️', action: 'Enable 2FA' },
                  { title: 'Active Sessions', desc: 'Manage devices where you are logged in', icon: '📱', action: 'View Sessions' },
                  { title: 'Download My Data', desc: 'Get a copy of all your personal data', icon: '⬇️', action: 'Request Download' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-4 border border-vivaah-border rounded-xl hover:bg-vivaah-bg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl">{item.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                        <p className="text-xs text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-vivaah-border text-neutral-600 rounded-lg text-xs font-medium hover:border-primary-700/40 hover:text-primary-700 transition-colors">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div className="space-y-5">
              <h3 className="font-bold text-neutral-900">App Preferences</h3>
              <div>
                {[
                  { label: 'Language', options: ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'] },
                  { label: 'Currency', options: ['INR (₹)', 'USD ($)', 'GBP (£)'] },
                  { label: 'Distance Unit', options: ['Kilometers', 'Miles'] },
                ].map((pref) => (
                  <SettingRow key={pref.label} label={pref.label}>
                    <select className="px-3 py-1.5 border border-vivaah-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-700/20">
                      {pref.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </SettingRow>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-vivaah-border flex justify-end">
            <button onClick={handleSave}
              className="px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              {saved ? '✅ Saved!' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
