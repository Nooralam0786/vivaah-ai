'use client';

import { useState } from 'react';

const RELIGIONS = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];
const AGE_RANGES = ['18-25', '25-30', '30-35', '35-40', '40+'];
const INCOMES = ['Any', 'Below 3L', '3–5L', '5–10L', '10–20L', '20L+'];

const PROFILES = [
  { id: 1, name: 'Kavya Reddy', age: 26, profession: 'Software Engineer', location: 'Hyderabad', religion: 'Hindu', caste: 'Reddy', height: "5'5\"", matchPercent: 94, isOnline: true, isVerified: true, income: '10–20L', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
  { id: 2, name: 'Meera Joshi', age: 28, profession: 'Doctor (MBBS)', location: 'Pune', religion: 'Hindu', caste: 'Brahmin', height: "5'4\"", matchPercent: 88, isOnline: false, isVerified: true, income: '20L+', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80' },
  { id: 3, name: 'Divya Menon', age: 25, profession: 'Marketing Manager', location: 'Chennai', religion: 'Hindu', caste: 'Nair', height: "5'3\"", matchPercent: 82, isOnline: true, isVerified: false, income: '5–10L', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
  { id: 4, name: 'Shruti Kapoor', age: 27, profession: 'Lawyer', location: 'Delhi', religion: 'Hindu', caste: 'Khatri', height: "5'6\"", matchPercent: 90, isOnline: true, isVerified: true, income: '10–20L', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80' },
  { id: 5, name: 'Anjali Patel', age: 24, profession: 'CA Student', location: 'Ahmedabad', religion: 'Hindu', caste: 'Patel', height: "5'2\"", matchPercent: 78, isOnline: false, isVerified: true, income: '3–5L', photo: 'https://images.unsplash.com/photo-1535090333275-02e76c6777b0?w=300&q=80' },
  { id: 6, name: 'Nisha Rao', age: 29, profession: 'Data Scientist', location: 'Bangalore', religion: 'Hindu', caste: 'Rao', height: "5'5\"", matchPercent: 85, isOnline: true, isVerified: true, income: '20L+', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80' },
];

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? 'bg-primary-gradient text-white shadow-sm' : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 hover:text-primary-700 bg-white'}`}>
      {label}
    </button>
  );
}

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [religion, setReligion] = useState('Any');
  const [ageRange, setAgeRange] = useState('');
  const [income, setIncome] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = PROFILES.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchReligion = religion === 'Any' || p.religion === religion;
    const matchIncome = income === 'Any' || p.income === income;
    return matchSearch && matchReligion && matchIncome;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Discover Matches</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{filtered.length} profiles found matching your preferences</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-vivaah-border bg-white rounded-xl text-sm font-medium text-neutral-700 hover:border-primary-700/50 transition-colors">
          <span>🔧</span> {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, location, profession..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-vivaah-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 shadow-card" />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 space-y-4 animate-slide-up">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Religion</p>
            <div className="flex flex-wrap gap-2">
              {RELIGIONS.map((r) => <FilterChip key={r} label={r} active={religion === r} onClick={() => setReligion(r)} />)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Age Range</p>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((r) => <FilterChip key={r} label={r} active={ageRange === r} onClick={() => setAgeRange(ageRange === r ? '' : r)} />)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Annual Income</p>
            <div className="flex flex-wrap gap-2">
              {INCOMES.map((r) => <FilterChip key={r} label={r} active={income === r} onClick={() => setIncome(r)} />)}
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-vivaah-border">
            <button onClick={() => { setReligion('Any'); setAgeRange(''); setIncome('Any'); setSearch(''); }}
              className="px-4 py-2 border border-vivaah-border rounded-xl text-sm text-neutral-600 hover:bg-vivaah-bg transition-colors">
              Reset All
            </button>
            <button className="px-6 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Profile Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
        {filtered.map((profile) => (
          <div key={profile.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
              <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0 bg-card-gradient" />
              <div className={`absolute top-2.5 left-2.5 ${profile.matchPercent >= 90 ? 'bg-green-500' : profile.matchPercent >= 80 ? 'bg-blue-500' : 'bg-amber-500'} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                {profile.matchPercent}%
              </div>
              {profile.isOnline && (
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1">
                  <h3 className="text-white font-bold text-sm">{profile.name}, {profile.age}</h3>
                  {profile.isVerified && <span className="text-blue-300 text-xs">✅</span>}
                </div>
                <p className="text-white/80 text-xs">{profile.profession}</p>
                <p className="text-white/60 text-[10px]">📍 {profile.location}</p>
              </div>
            </div>
            <div className="p-3 flex gap-2">
              <button onClick={() => toggleLike(profile.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${liked.has(profile.id) ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'}`}>
                {liked.has(profile.id) ? '❤️ Liked' : '🤍 Like'}
              </button>
              <button className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium">No profiles found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
