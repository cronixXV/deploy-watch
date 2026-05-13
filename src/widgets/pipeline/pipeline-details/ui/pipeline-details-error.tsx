import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';

import { getApiErrorMessage } from '@/shared/api/client/client';

type PipelineDetailsErrorProps = {
  message?: string;
  error?: unknown;
  isFetching?: boolean;
  onRetry?: () => void;
};

export const PipelineDetailsError = ({
  message = 'Failed to load pipeline details',
  error,
  isFetching = false,
  onRetry,
}: PipelineDetailsErrorProps) => (
  <Stack gap="4">
    <Heading size="lg">Pipeline details</Heading>

    <Card.Root bg="red.50" borderColor="red.200">
      <Card.Body>
        <Stack gap="3">
          <Text color="red.700" fontWeight="semibold">
            {message}
          </Text>

          {error && (
            <Text color="red.600" fontSize="sm">
              {getApiErrorMessage(error)}
            </Text>
          )}

          {onRetry && (
            <Button
              alignSelf="flex-start"
              colorPalette="red"
              loading={isFetching}
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  </Stack>
);
