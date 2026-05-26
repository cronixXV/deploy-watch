import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

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
    <HStack align="start" justify="space-between">
      <Box>
        <Heading size="lg">Deployments</Heading>

        <Text color="gray.500" mt="2">
          {projectName
            ? `${projectName} · deployment history across environments.`
            : 'Deployment history across environments.'}
        </Text>
      </Box>

      <Button
        colorPalette="teal"
        loading={isFetching}
        size="sm"
        variant="outline"
        onClick={onRefresh}
      >
        <RefreshCw size={16} />
        Refresh
      </Button>
    </HStack>
  );
};
