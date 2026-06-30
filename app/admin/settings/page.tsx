'use client';

import { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';

interface FieldDef {
  id: string;
  label: string;
  value: string;
  type?: string;
  hint?: string;
}

const GENERAL_FIELDS: FieldDef[] = [
  { id: 'appName',      label: 'App Name',           value: 'VivaahAI',                    hint: 'Displayed throughout the platform'                },
  { id: 'supportEmail', label: 'Support Email',       value: 'arun@techotd.com',            hint: 'Receives all support requests'                    },
  { id: 'maxMatches',   label: 'Max Free Matches',    value: '5',          type: 'number',  hint: 'Daily match limit for free-tier users'            },
  { id: 'otpExpiry',    label: 'OTP Expiry (secs)',   value: '300',        type: 'number',  hint: 'Seconds before OTP code expires (default: 300s)'  },
  { id: 'jwtExpiry',    label: 'JWT Expiry',          value: '7d',                          hint: 'Token lifetime (e.g., 7d, 24h)'                   },
  { id: 'appUrl',       label: 'App Base URL',        value: 'https://vivaah.ai',           hint: 'Used in emails and redirects'                     },
];

interface Flag { id: string; label: string; desc: string; enabled: boolean }

const INITIAL_FLAGS: Flag[] = [
  { id: 'aiMatching',     label: 'AI Matching Engine',   desc: 'Use ML to suggest compatible profiles',     enabled: true  },
  { id: 'videoCalls',     label: 'Video Calls',          desc: 'Allow video calls between matched users',   enabled: false },
  { id: 'familyAccounts', label: 'Family Accounts',      desc: 'Let families manage profiles together',     enabled: true  },
  { id: 'bgCheck',        label: 'Background Check',     desc: 'Enable third-party identity verification',  enabled: false },
  { id: 'aiChat',         label: 'AI Conversation Tips', desc: 'Suggest icebreakers via AI in chat',        enabled: true  },
  { id: 'emailDigest',    label: 'Weekly Email Digest',  desc: 'Send weekly match digest to users',         enabled: true  },
];

export default function SettingsPage() {
  const [editing, setEditing]   = useState(false);
  const [fields,  setFields]    = useState(GENERAL_FIELDS);
  const [flags,   setFlags]     = useState(INITIAL_FLAGS);
  const [saved,   setSaved]     = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide configuration and feature flags</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center flex-shrink-0">
          <Settings size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-gray-800">General Configuration</h3>
            <p className="text-xs text-gray-400 mt-0.5">Core platform settings</p>
          </div>
          {editing ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={() => setEditing(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors border border-gray-200 focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40">
                <X size={13} /> Cancel
              </button>
              <button onClick={handleSave}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#6B1B3D] text-white rounded-xl text-xs font-semibold hover:bg-[#8B2252] transition-colors focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40">
                <Save size={13} /> Save Changes
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              className="px-3 py-1.5 border border-[#6B1B3D] text-[#6B1B3D] rounded-xl text-xs font-semibold hover:bg-[#6B1B3D]/5 transition-colors self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40">
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              {editing ? (
                <input
                  id={f.id}
                  type={f.type ?? 'text'}
                  value={f.value}
                  onChange={(e) => setFields((prev) => prev.map((x) => x.id === f.id ? { ...x, value: e.target.value } : x))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-[#6B1B3D]/50 focus:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{f.value}</p>
                </div>
              )}
              {f.hint && <p className="text-[10px] text-gray-400 mt-1">{f.hint}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Feature Flags</h3>
        <p className="text-xs text-gray-400 mb-5">Toggle platform features without a deployment</p>
        <div className="space-y-3">
          {flags.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
              </div>
              <button
                onClick={() => setFlags((prev) => prev.map((x) => x.id === f.id ? { ...x, enabled: !x.enabled } : x))}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#6B1B3D]/40 ${f.enabled ? 'bg-[#6B1B3D]' : 'bg-gray-300'}`}
                aria-label={`Toggle ${f.label}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${f.enabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-4 sm:p-6">
        <h3 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-xs text-gray-400 mb-4">Destructive actions — proceed with caution</p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <button disabled className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold opacity-60 cursor-not-allowed">
            Clear Cache
          </button>
          <button disabled className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold opacity-60 cursor-not-allowed">
            Reset Rate Limits
          </button>
          <button disabled className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold opacity-60 cursor-not-allowed">
            Flush Sessions
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-3">These actions are disabled in the demo panel. Connect to a live backend to enable them.</p>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl border bg-white text-emerald-700 border-emerald-200">
          ✓ Settings saved
        </div>
      )}
    </div>
  );
}
