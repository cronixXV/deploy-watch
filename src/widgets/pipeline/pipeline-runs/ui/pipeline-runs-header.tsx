import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type PipelineRunsHeaderProps = {
  projectName?: string;
  repository?: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const PipelineRunsHeader = ({
  projectName,
  repository,
  isFetching,
  onRefresh,
}: PipelineRunsHeaderProps) => {
  const subtitle =
    projectName && repository
      ? `${projectName} · ${repository}`
      : 'Pipeline runs history.';

  return (
    <PageHeader
      title="Pipeline runs"
      subtitle={subtitle}
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
};
