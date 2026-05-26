import { useParams } from 'react-router-dom';

import { Environments } from '@/widgets/environment';

export const EnvironmentsPage = () => {
  const { projectId } = useParams();

  return <Environments projectId={projectId} />;
};
