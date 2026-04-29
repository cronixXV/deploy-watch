import { approvals } from './data/approvals';
import { buildLogs } from './data/build-logs';
import { builds } from './data/builds';
import { deployments } from './data/deployments';
import { environments } from './data/environments';
import { pipelineRuns } from './data/pipeline-runs';
import { projects } from './data/projects';
import { users } from './data/users';

export const mockState = {
  users,
  projects,
  pipelineRuns,
  builds,
  buildLogs,
  environments,
  deployments,
  approvals,
};
export { deployments, approvals, users };
