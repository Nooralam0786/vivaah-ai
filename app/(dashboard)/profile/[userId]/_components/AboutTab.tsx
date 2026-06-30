import InfoRow from './InfoRow';
import type { ProfileFull } from '../types';

interface AboutTabProps {
  profile: ProfileFull;
}

export default function AboutTab({ profile }: AboutTabProps) {
  return (
    <div className="space-y-4">
      {/* About Me */}
      {profile.aboutMe && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-2">About Me</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">{profile.aboutMe}</p>
        </div>
      )}

      {/* Personal Details */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
        <h2 className="text-sm font-bold text-neutral-900 mb-1">Personal Details</h2>
        <InfoRow label="Date of Birth"   value={profile.dob} />
        <InfoRow label="Height"          value={profile.height} />
        <InfoRow label="Religion"        value={profile.religion} />
        <InfoRow label="Caste"           value={profile.caste} />
        <InfoRow label="Mother Tongue"   value={profile.motherTongue} />
        <InfoRow label="Marital Status"  value={profile.maritalStatus} />
      </div>

      {/* Career */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
        <h2 className="text-sm font-bold text-neutral-900 mb-1">Education &amp; Career</h2>
        <InfoRow label="Education"   value={profile.qualification} />
        <InfoRow label="Occupation"  value={profile.occupation} />
        <InfoRow label="Company"     value={profile.company} />
        <InfoRow label="Income"      value={profile.annualIncome} />
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
        <h2 className="text-sm font-bold text-neutral-900 mb-1">Location</h2>
        <InfoRow label="City"    value={profile.city} />
        <InfoRow label="State"   value={profile.state} />
        <InfoRow label="Country" value={profile.country} />
      </div>

      {/* Lifestyle */}
      {(profile.smokingHabit || profile.drinkingHabit || profile.dietPreference) && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-1">Lifestyle</h2>
          <InfoRow label="Smoking"  value={profile.smokingHabit} />
          <InfoRow label="Drinking" value={profile.drinkingHabit} />
          <InfoRow label="Diet"     value={profile.dietPreference} />
        </div>
      )}

      {/* Interests */}
      {profile.interests.length > 0 && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-3">Interests &amp; Hobbies</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  profile.mutualInterests.includes(i)
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-neutral-50 border-vivaah-border text-neutral-600'
                }`}
              >
                {profile.mutualInterests.includes(i) && '💡 '}{i}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
