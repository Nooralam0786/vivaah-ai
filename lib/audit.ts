/**
 * Audit logging — fire-and-forget DB writes for key events.
 * Never throws; failures are silent so they never break the main request.
 */

import { prisma } from './db';

export type AuditAction =
  | 'signup'
  | 'login'
  | 'upgrade'
  | 'verify'
  | 'ban'
  | 'unban'
  | 'delete_user'
  | 'report'
  | 'approve_story'
  | 'reject_story'
  | 'report_actioned'
  | 'report_dismissed'
  | 'password_reset'
  | 'profile_update';

interface AuditParams {
  action:     AuditAction;
  actorId?:   string;
  actorName?: string;
  targetId?:  string;
  targetName?:string;
  meta?:      Record<string, unknown>;
  ip?:        string;
}

export function writeAuditLog(params: AuditParams): void {
  prisma.auditLog.create({
    data: {
      action:     params.action,
      actorId:    params.actorId    ?? null,
      actorName:  params.actorName  ?? null,
      targetId:   params.targetId   ?? null,
      targetName: params.targetName ?? null,
      meta:       params.meta ? JSON.stringify(params.meta) : null,
      ip:         params.ip         ?? null,
    },
  }).catch(() => {});
}
