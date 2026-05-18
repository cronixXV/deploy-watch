import { useParams } from 'react-router-dom';

import { BuildDetails } from '@/widgets/build';

export const BuildDetailsPage = () => {
  const { projectId, buildId } = useParams();

  return <BuildDetails projectId={projectId} buildId={buildId} />;
};
