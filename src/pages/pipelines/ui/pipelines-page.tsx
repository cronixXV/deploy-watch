import { useParams } from 'react-router-dom';

import { PipelineRuns } from '@/widgets/pipeline';

export const PipelinesPage = () => {
  const { projectId } = useParams();

  return <PipelineRuns projectId={projectId} />;
};
