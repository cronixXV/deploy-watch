import { Button, Card, Heading, Stack, Text } from '@chakra-ui/react';

import { getApiErrorMessage } from '@/shared/api/client/client';

type PageErrorStateProps = {
  title?: string;
  message: string;
  error?: unknown;
  isFetching?: boolean;
  onRetry?: () => void;
};

export const PageErrorState = ({
  title,
  message,
  error,
  isFetching = false,
  onRetry,
}: PageErrorStateProps) => (
  <Stack gap="4">
    {title && <Heading size="lg">{title}</Heading>}

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
