import { useParams } from 'react-router-dom';

import { PipelineDetails } from '@/widgets/pipeline';

export const PipelineDetailsPage = () => {
  const { projectId, pipelineId } = useParams();

  return <PipelineDetails projectId={projectId} pipelineId={pipelineId} />;
};
