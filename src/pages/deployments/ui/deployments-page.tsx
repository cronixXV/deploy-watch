import { useParams } from 'react-router-dom';

import { Deployments } from '@/widgets/deployment';

export const DeploymentsPage = () => {
  const { projectId } = useParams();

  return <Deployments projectId={projectId} />;
};
