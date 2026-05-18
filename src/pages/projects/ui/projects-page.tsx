import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

import { useProjectsQuery } from '@/entities/project';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { ProjectSummaryCard } from '@/widgets/projects';

export const ProjectsPage = () => {
  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProjectsQuery();

  if (isLoading) {
    return (
      <Stack gap="6">
        <Box>
          <Heading size="lg">Projects</Heading>
          <Text color="gray.500" mt="2">
            Monitor CI/CD activity across your engineering projects.
          </Text>
        </Box>

        <Grid
          gap="4"
          templateColumns={{
            base: '1fr',
            xl: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton h="260px" key={index} rounded="xl" />
          ))}
        </Grid>
      </Stack>
    );
  }

  if (isError) {
    return (
      <PageErrorState
        title="Projects"
        message="Failed to load projects"
        error={error}
        isFetching={isFetching}
        onRetry={refetch}
      />
    );
  }

  return (
    <Stack gap="6">
      <HStack align="start" justify="space-between">
        <Box>
          <Heading size="lg">Projects</Heading>

          <Text color="gray.500" mt="2">
            Monitor CI/CD activity across your engineering projects.
          </Text>
        </Box>

        <Button
          colorPalette="teal"
          loading={isFetching}
          size="sm"
          variant="outline"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </HStack>

      {projects?.length ? (
        <Grid
          gap="4"
          templateColumns={{
            base: '1fr',
            xl: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          {projects.map((project) => (
            <ProjectSummaryCard key={project.id} project={project} />
          ))}
        </Grid>
      ) : (
        <Box
          rounded="xl"
          borderWidth="1px"
          borderColor="gray.200"
          bg="white"
          p="8"
          textAlign="center"
        >
          <Heading size="sm">No projects found</Heading>

          <Text color="gray.500" mt="2" fontSize="sm">
            Once projects are connected, they will appear here.
          </Text>
        </Box>
      )}
    </Stack>
  );
};
