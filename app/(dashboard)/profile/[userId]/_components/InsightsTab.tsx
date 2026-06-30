import { scoreBg } from '../constants';
import ScoreBar from './ScoreBar';
import type { ProfileFull } from '../types';

interface InsightsTabProps {
  profile: ProfileFull;
}

export default function InsightsTab({ profile }: InsightsTabProps) {
  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-neutral-900">Compatibility Score</h2>
          <div className={`${scoreBg(profile.matchPercent)} text-white font-bold text-lg px-4 py-1 rounded-xl`}>
            {profile.matchPercent}%
          </div>
        </div>
        <div className="space-y-3">
          <ScoreBar label="Religion & Background" value={profile.breakdown.religion ?? 0}    max={20} />
          <ScoreBar label="Shared Interests"      value={profile.breakdown.interests ?? 0}   max={20} />
          <ScoreBar label="Location"              value={profile.breakdown.location ?? 0}    max={15} />
          <ScoreBar label="Lifestyle"             value={profile.breakdown.lifestyle ?? 0}   max={10} />
          <ScoreBar label="Age Compatibility"     value={profile.breakdown.age ?? 0}         max={10} />
          <ScoreBar label="Education"             value={profile.breakdown.education ?? 0}   max={10} />
          <ScoreBar label="Recent Activity"       value={profile.breakdown.activity ?? 0}    max={10} />
          <ScoreBar label="Profile Completion"    value={profile.breakdown.profileCompletion ?? 0} max={5} />
        </div>
      </div>

      {/* Mutual interests */}
      {profile.mutualInterests.length > 0 && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-3">Things You Have in Common</h2>
          <div className="flex flex-wrap gap-2">
            {profile.mutualInterests.map((i) => (
              <span key={i} className="px-3 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-xs font-semibold">
                💡 {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mutual match */}
      {profile.isMutual && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">💕</div>
          <p className="font-bold text-green-700">Mutual Interest!</p>
          <p className="text-sm text-green-600 mt-1">You both liked each other. Start a conversation!</p>
          <a href={`/messages?userId=${profile.userId}`} className="inline-block mt-3 px-5 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
            💬 Start Chatting
          </a>
        </div>
      )}
    </div>
  );
}
