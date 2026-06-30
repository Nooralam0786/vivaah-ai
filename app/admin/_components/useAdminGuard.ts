'use client';

import { useEffect, useState } from 'react';

export type GuardState = 'loading' | 'ok' | 'unauthorized' | 'forbidden';

export function useAdminGuard() {
  const [state,     setState]  = useState<GuardState>('loading');
  const [adminName, setName]   = useState('Admin');

  useEffect(() => {
    const raw = localStorage.getItem('vivaah_auth');
    if (!raw) { setState('unauthorized'); return; }
    const token = (() => { try { return JSON.parse(raw)?.accessToken; } catch { return null; } })();
    if (!token) { setState('unauthorized'); return; }

    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (r.status === 401) setState('unauthorized');
        else if (r.status === 403) setState('forbidden');
        else {
          setState('ok');
          // Try to get display name from profile
          try {
            const pr = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
            const pj = await pr.json();
            if (pj.success && pj.data?.fullName) setName(pj.data.fullName);
          } catch { /* use default */ }
        }
      })
      .catch(() => setState('unauthorized'));
  }, []);

  return { state, adminName };
}
