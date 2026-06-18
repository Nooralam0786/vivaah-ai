'use client';

import { useState } from 'react';

const TABS = ['Basic Info', 'Personal Details', 'Career', 'Location', 'Photos', 'Preferences'];

const initialProfile = {
  fullName: 'Rohan Sharma', email: 'rohan@example.com', phone: '+91 9876543210',
  gender: 'Male', dob: '1995-06-15', height: "5'10\"", religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi', maritalStatus: 'Never Married',
  qualification: 'B.Tech/B.E.', occupation: 'Software Engineer', company: 'Tech Corp', annualIncome: '20–40 LPA',
  country: 'India', state: 'Delhi', city: 'New Delhi',
  aboutMe: 'I am a passionate software engineer who loves to travel and explore new cultures. Family-oriented and looking for a like-minded partner to share life\'s beautiful journey.',
  interests: ['Travel', 'Coding', 'Yoga', 'Music'],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setEditing(false);
    await new Promise((r) => setTimeout(r, 2000));
    setSaved(false);
  };

  const Field = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange?: (v: string) => void; type?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
      {editing && onChange ? (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
      ) : (
        <p className="text-sm text-neutral-800 font-medium">{value || <span className="text-neutral-300">Not specified</span>}</p>
      )}
    </div>
  );

  const profileStrength = 85;

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-premium-gradient relative">
          <button className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-neutral-700 hover:bg-white transition-colors">
            📷 Change Cover
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-primary-gradient border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                R
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-vivaah-border rounded-full flex items-center justify-center text-sm shadow-sm hover:bg-vivaah-bg transition-colors">
                ✏️
              </button>
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-neutral-900">{profile.fullName}</h1>
                    <span className="text-blue-500">✅</span>
                    <span className="px-2 py-0.5 bg-gold-gradient text-neutral-900 rounded-full text-xs font-bold">👑 Premium</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">{profile.occupation} · {profile.city}, {profile.country}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {profile.interests.map((i) => (
                      <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{i}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button onClick={() => setEditing(false)} className="px-4 py-2 border border-vivaah-border rounded-xl text-sm text-neutral-600">Cancel</button>
                      <button onClick={handleSave} className="px-4 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">
                        {saved ? '✅ Saved!' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(true)} className="px-4 py-2 border border-primary-700 text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-50">
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mt-4 p-3 bg-vivaah-bg rounded-xl flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-neutral-700">Profile Strength</span>
                <span className="font-bold text-green-600">{profileStrength}% Excellent</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-gold-gradient rounded-full transition-all" style={{ width: `${profileStrength}%` }} />
              </div>
            </div>
            <a href="#" className="text-xs font-semibold text-primary-700 whitespace-nowrap hover:underline">Improve →</a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${activeTab === tab ? 'bg-primary-gradient text-white shadow-sm' : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6">
        {activeTab === 'Basic Info' && (
          <div className="space-y-5">
            <h3 className="font-bold text-neutral-900 mb-4">Basic Information</h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">About Me</label>
              {editing ? (
                <textarea value={profile.aboutMe} onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })} rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
              ) : (
                <p className="text-sm text-neutral-700 leading-relaxed">{profile.aboutMe}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={profile.fullName} onChange={(v) => setProfile({ ...profile, fullName: v })} />
              <Field label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
              <Field label="Mobile" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
              <Field label="Gender" value={profile.gender} />
            </div>
          </div>
        )}

        {activeTab === 'Personal Details' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Date of Birth" value={profile.dob} onChange={(v) => setProfile({ ...profile, dob: v })} type="date" />
            <Field label="Height" value={profile.height} />
            <Field label="Religion" value={profile.religion} onChange={(v) => setProfile({ ...profile, religion: v })} />
            <Field label="Caste" value={profile.caste} onChange={(v) => setProfile({ ...profile, caste: v })} />
            <Field label="Mother Tongue" value={profile.motherTongue} onChange={(v) => setProfile({ ...profile, motherTongue: v })} />
            <Field label="Marital Status" value={profile.maritalStatus} />
          </div>
        )}

        {activeTab === 'Career' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Qualification" value={profile.qualification} onChange={(v) => setProfile({ ...profile, qualification: v })} />
            <Field label="Occupation" value={profile.occupation} onChange={(v) => setProfile({ ...profile, occupation: v })} />
            <Field label="Company / Organization" value={profile.company} onChange={(v) => setProfile({ ...profile, company: v })} />
            <Field label="Annual Income" value={profile.annualIncome} onChange={(v) => setProfile({ ...profile, annualIncome: v })} />
          </div>
        )}

        {activeTab === 'Location' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Country" value={profile.country} onChange={(v) => setProfile({ ...profile, country: v })} />
            <Field label="State" value={profile.state} onChange={(v) => setProfile({ ...profile, state: v })} />
            <Field label="City" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })} />
          </div>
        )}

        {activeTab === 'Photos' && (
          <div>
            <h3 className="font-bold text-neutral-900 mb-4">Profile Photos</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <div className="aspect-square bg-primary-gradient rounded-xl flex items-center justify-center text-white font-bold text-3xl">R</div>
              {[...Array(4)].map((_, i) => (
                <button key={i} className="aspect-square bg-vivaah-bg border-2 border-dashed border-primary-700/30 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary-700/60 hover:bg-primary-50 transition-all group">
                  <span className="text-2xl text-neutral-300 group-hover:text-primary-700">+</span>
                  <span className="text-xs text-neutral-400 group-hover:text-primary-700">Add Photo</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-3">Add up to 5 photos. Your first photo is your profile picture.</p>
          </div>
        )}

        {activeTab === 'Preferences' && (
          <div className="space-y-5">
            <h3 className="font-bold text-neutral-900">Match Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Age Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={22} min={18} max={50}
                    className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20" />
                  <span className="text-neutral-400 text-sm">to</span>
                  <input type="number" defaultValue={30} min={18} max={50}
                    className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Religion Preference</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none">
                  <option>Any Religion</option>
                  <option>Hindu</option><option>Muslim</option><option>Christian</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Preferred Location</label>
                <input type="text" defaultValue="India"
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Education Preference</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none">
                  <option>Any</option>
                  <option>Graduate & Above</option><option>Post Graduate & Above</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
