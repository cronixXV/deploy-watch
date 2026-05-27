import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type ApprovalsHeaderProps = {
  isFetching: boolean;
  onRefresh: () => void;
};

export const ApprovalsHeader = ({
  isFetching,
  onRefresh,
}: ApprovalsHeaderProps) => {
  return (
    <PageHeader
      title="Approvals"
      subtitle="Deployments waiting for release approval."
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
};
