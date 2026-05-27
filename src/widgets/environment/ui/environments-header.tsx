import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type EnvironmentsHeaderProps = {
  projectName?: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const EnvironmentsHeader = ({
  projectName,
  isFetching,
  onRefresh,
}: EnvironmentsHeaderProps) => {
  return (
    <PageHeader
      title="Environments"
      subtitle={
        projectName
          ? `${projectName} · runtime status across deployment targets.`
          : 'Runtime status across deployment targets.'
      }
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
};
