import { useParams } from 'react-router-dom';

import { ProjectOverview } from '@/widgets/projects';

export function ProjectOverviewPage() {
  const { projectId } = useParams();

  return <ProjectOverview projectId={projectId} />;
}
