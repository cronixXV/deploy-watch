import {
  Badge,
  Box,
  Button,
  Drawer,
  HStack,
  Icon,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CheckCircle2, Circle, Clock3, XCircle } from 'lucide-react';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import {
  getDeploymentTimelineSteps,
  type DeploymentTimelineStepStatus,
} from '@/entities/deployment';
import { formatDate, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type DeploymentTimelineDrawerProps = {
  deployment: Deployment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getStepIcon(status: DeploymentTimelineStepStatus) {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'current':
      return Clock3;
    case 'failed':
      return XCircle;
    case 'pending':
    default:
      return Circle;
  }
}

export const DeploymentTimelineDrawer = ({
  deployment,
  open,
  onOpenChange,
}: DeploymentTimelineDrawerProps) => {
  const steps = deployment ? getDeploymentTimelineSteps(deployment) : [];

  return (
    <Drawer.Root
      open={open}
      placement="end"
      size="md"
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Portal>
        <Drawer.Backdrop />

        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Deployment timeline</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Button size="sm" variant="ghost">
                  Close
                </Button>
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body>
              {deployment ? (
                <Stack gap="6">
                  <Box>
                    <HStack gap="2" mb="2">
                      <Text fontWeight="semibold">{deployment.version}</Text>

                      <Badge
                        colorPalette={getStatusColor(deployment.status)}
                        variant="subtle"
                      >
                        {formatStatus(deployment.status)}
                      </Badge>
                    </HStack>

                    <Text color="gray.500" fontSize="sm">
                      {formatStatus(deployment.environment)} ·{' '}
                      {deployment.branch} · {deployment.commitHash}
                    </Text>
                  </Box>

                  <Stack gap="0">
                    {steps.map((step, index) => {
                      const IconComponent = getStepIcon(step.status);
                      const color = getStatusColor(step.status);
                      const isLast = index === steps.length - 1;

                      return (
                        <HStack key={step.id} align="stretch" gap="3">
                          <Stack align="center" gap="0">
                            <Box
                              display="grid"
                              placeItems="center"
                              boxSize="8"
                              rounded="full"
                              bg={`${color}.50`}
                              color={`${color}.600`}
                              borderWidth="1px"
                              borderColor={`${color}.200`}
                            >
                              <Icon as={IconComponent} boxSize="4" />
                            </Box>

                            {!isLast && (
                              <Box flex="1" w="1px" minH="44px" bg="gray.200" />
                            )}
                          </Stack>

                          <Box flex="1" pb={isLast ? '0' : '5'}>
                            <HStack justify="space-between" align="start">
                              <Box>
                                <Text fontWeight="medium">{step.label}</Text>

                                <Text color="gray.500" fontSize="sm" mt="1">
                                  {step.description}
                                </Text>
                              </Box>

                              <Badge colorPalette={color} variant="subtle">
                                {formatStatus(step.status)}
                              </Badge>
                            </HStack>

                            {step.timestamp && (
                              <Text color="gray.400" fontSize="xs" mt="2">
                                {formatDate(step.timestamp)}
                              </Text>
                            )}
                          </Box>
                        </HStack>
                      );
                    })}
                  </Stack>
                </Stack>
              ) : (
                <Text color="gray.500" fontSize="sm">
                  Select deployment to view timeline.
                </Text>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
