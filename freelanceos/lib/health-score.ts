import type { Client, Project, Invoice, EmailLog, TimelineStage, HealthScore } from '@/types';
import { daysSince } from '@/lib/utils';

export function calculateHealthScore(
  client: Client,
  project: Project | null | undefined,
  invoices: Invoice[],
  emailLogs: EmailLog[],
  stages: TimelineStage[]
): HealthScore {
  if (!project || project.status === 'draft') return 'grey';

  let unhealthyFactors = 0;

  const overdueInvoice = invoices.find((i) => i.status === 'overdue');
  if (overdueInvoice) {
    const overdueBy14 = overdueInvoice.due_date && daysSince(overdueInvoice.due_date) > 14;
    if (overdueBy14) return 'red';
    unhealthyFactors++;
  }

  const sentEmails = emailLogs
    .filter((e) => e.status === 'sent' && e.sent_at)
    .sort((a, b) => new Date(b.sent_at!).getTime() - new Date(a.sent_at!).getTime());
  const lastEmail = sentEmails[0];
  if (!lastEmail || (lastEmail.sent_at && daysSince(lastEmail.sent_at) > 14)) {
    unhealthyFactors++;
  }

  const completedStages = stages
    .filter((s) => s.status === 'completed' && s.completed_date)
    .sort((a, b) => new Date(b.completed_date!).getTime() - new Date(a.completed_date!).getTime());
  const lastStageUpdate = completedStages[0];
  if (!lastStageUpdate || (lastStageUpdate.completed_date && daysSince(lastStageUpdate.completed_date) > 10)) {
    unhealthyFactors++;
  }

  if (project.status !== 'active') unhealthyFactors++;
  if (project.revisions_used >= project.revision_limit) unhealthyFactors++;

  if (unhealthyFactors >= 3) return 'red';
  if (unhealthyFactors >= 1) return 'amber';
  return 'green';
}

export function getHealthScoreLabel(score: HealthScore): string {
  switch (score) {
    case 'green': return 'Healthy';
    case 'amber': return 'Needs Attention';
    case 'red': return 'At Risk';
    case 'grey': return 'No Active Project';
  }
}

export function getHealthScoreColor(score: HealthScore): string {
  switch (score) {
    case 'green': return 'bg-green-500';
    case 'amber': return 'bg-amber-500';
    case 'red': return 'bg-red-500';
    case 'grey': return 'bg-gray-400';
  }
}
