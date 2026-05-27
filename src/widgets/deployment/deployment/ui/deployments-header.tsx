import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type DeploymentsHeaderProps = {
  projectName?: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const DeploymentsHeader = ({
  projectName,
  isFetching,
  onRefresh,
}: DeploymentsHeaderProps) => {
  return (
    <PageHeader
      title="Deployments"
      subtitle={
        projectName
          ? `${projectName} · deployment history across environments.`
          : 'Deployment history across environments.'
      }
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
};
