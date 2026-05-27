import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { ReactNode } from 'react';

type HeaderStatus = {
  label: string;
  colorPalette: string;
};

type HeaderBackLink = {
  to: string;
  label: string;
};

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;

  status?: HeaderStatus;
  isLive?: boolean;
  liveText?: string;

  backLink?: HeaderBackLink;

  isFetching?: boolean;
  onRefresh?: () => void;

  actions?: ReactNode;
};

export const PageHeader = ({
  title,
  subtitle,
  status,
  isLive = false,
  liveText = 'Updates every 3 seconds while active.',
  backLink,
  isFetching = false,
  onRefresh,
  actions,
}: PageHeaderProps) => {
  return (
    <HStack justify="space-between" align="start">
      <Stack gap="2">
        {backLink && (
          <Button size="sm" variant="ghost" asChild alignSelf="flex-start">
            <RouterLink to={backLink.to}>
              <ArrowLeft size={16} />
              {backLink.label}
            </RouterLink>
          </Button>
        )}

        <Box>
          <HStack gap="3" align="center">
            <Heading size="lg">{title}</Heading>

            {status && (
              <Badge colorPalette={status.colorPalette} variant="subtle">
                {status.label}
              </Badge>
            )}

            {isLive && (
              <Badge colorPalette="blue" variant="subtle">
                Live polling
              </Badge>
            )}
          </HStack>

          {subtitle && (
            <Text color="gray.500" mt="2">
              {subtitle}
            </Text>
          )}

          {isLive && (
            <Text color="blue.600" fontSize="sm" mt="1">
              {liveText}
            </Text>
          )}
        </Box>
      </Stack>

      <HStack gap="2">
        {actions}

        {onRefresh && (
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
        )}
      </HStack>
    </HStack>
  );
};
