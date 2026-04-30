import { Button, Card, Stack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

type OpenApprovalsCardProps = {
  count: number;
};

export const OpenApprovalsCard = ({ count }: OpenApprovalsCardProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Body>
        <Stack gap="3">
          <Text color="gray.500" fontSize="sm" fontWeight="medium">
            Open approvals
          </Text>

          <Text fontSize="3xl" fontWeight="bold">
            {count}
          </Text>

          <Text color="gray.500" fontSize="sm">
            Deployments waiting for approval
          </Text>

          <Button
            colorPalette={count > 0 ? 'yellow' : 'gray'}
            size="sm"
            variant="outline"
            asChild
          >
            <RouterLink to="/approvals">
              Review approvals
              <ArrowRight size={16} />
            </RouterLink>
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
