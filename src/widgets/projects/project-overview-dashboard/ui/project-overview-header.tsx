import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { Project } from '@/shared/api/mocks/model/types/types';

import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type ProjectOverviewHeaderProps = {
  project?: Project;
  projectId: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const ProjectOverviewHeader = ({
  project,
  projectId,
  isFetching,
  onRefresh,
}: ProjectOverviewHeaderProps) => {
  return (
    <PageHeader
      title={project?.name ?? 'Project overview'}
      subtitle={
        project
          ? `${project.repository} · default branch: ${project.defaultBranch}`
          : undefined
      }
      isFetching={isFetching}
      onRefresh={onRefresh}
      actions={
        <Button colorPalette="teal" size="sm" variant="outline" asChild>
          <RouterLink to={`/projects/${projectId}/pipelines`}>
            View pipelines
          </RouterLink>
        </Button>
      }
    />
  );
};
