import { approvalHandlers } from './approval-handlers';
import { authHandlers } from './auth-handlers';
import { buildHandlers } from './build-handlers';
import { deploymentHandlers } from './deployment-handlers';
import { environmentHandlers } from './environment-handlers';
import { pipelineRunHandlers } from './pipeline-run-handlers';
import { projectHandlers } from './project-handlers';
import { userHandlers } from './user-handlers';

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...pipelineRunHandlers,
  ...buildHandlers,
  ...environmentHandlers,
  ...deploymentHandlers,
  ...approvalHandlers,
  ...userHandlers,
];
