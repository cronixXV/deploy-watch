export type UserRole = 'viewer' | 'developer' | 'release_manager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type Project = {
  id: string;
  name: string;
  repository: string;
  defaultBranch: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type PipelineStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failed'
  | 'canceled';

export type PipelineRun = {
  id: string;
  projectId: string;
  status: PipelineStatus;
  branch: string;
  commitHash: string;
  commitMessage: string;
  authorId: string;
  triggeredById: string;
  startedAt: string;
  finishedAt?: string;
  durationSec?: number;
  environment?: EnvironmentName;
};

export type BuildStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failed'
  | 'canceled';

export type Build = {
  id: string;
  projectId: string;
  pipelineId: string;
  status: BuildStatus;
  jobName: string;
  startedAt: string;
  finishedAt?: string;
  durationSec?: number;
};

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export type BuildLogLine = {
  id: string;
  buildId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  jobName: string;
};

export type EnvironmentName =
  | 'development'
  | 'testing'
  | 'staging'
  | 'production';

export type EnvironmentStatus =
  | 'healthy'
  | 'degraded'
  | 'down'
  | 'deploying'
  | 'locked';

export type Environment = {
  id: string;
  projectId: string;
  name: EnvironmentName;
  status: EnvironmentStatus;
  currentVersion: string;
  currentCommitHash: string;
  lastDeploymentAt?: string;
  locked: boolean;
};

export type DeploymentStatus =
  | 'pending'
  | 'waiting_approval'
  | 'deploying'
  | 'deployed'
  | 'failed'
  | 'rolled_back'
  | 'rejected';

export type Deployment = {
  id: string;
  projectId: string;
  environment: EnvironmentName;
  status: DeploymentStatus;
  version: string;
  commitHash: string;
  branch: string;
  requestedById: string;
  approvedById?: string;
  startedAt: string;
  finishedAt?: string;
};

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalRiskLevel = 'low' | 'medium' | 'high';

export type Approval = {
  id: string;
  deploymentId: string;
  projectId: string;
  environment: EnvironmentName;
  status: ApprovalStatus;
  riskLevel: ApprovalRiskLevel;
  requestedById: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedById?: string;
  rejectReason?: string;
};
