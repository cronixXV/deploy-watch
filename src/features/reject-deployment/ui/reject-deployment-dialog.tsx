import {
  Button,
  Dialog,
  Field,
  HStack,
  Portal,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';

import type { Approval } from '@/shared/api/mocks/model/types/types';

import { formatStatus } from '@/shared/lib/format';

type RejectDeploymentDialogProps = {
  approval: Approval | null;
  open: boolean;
  loading?: boolean;
  onReject: (params: { approval: Approval; reason: string }) => void;
  onOpenChange: (open: boolean) => void;
};

export const RejectDeploymentDialog = ({
  approval,
  open,
  loading,
  onReject,
  onOpenChange,
}: RejectDeploymentDialogProps) => {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  const trimmedReason = reason.trim();
  const isInvalid = touched && !trimmedReason;

  const handleOpenChange = (details: { open: boolean }) => {
    if (details.open) {
      setReason('');
      setTouched(false);
    }

    onOpenChange(details.open);
  };

  const handleSubmit = () => {
    setTouched(true);

    if (!approval || !trimmedReason) {
      return;
    }

    onReject({
      approval,
      reason: trimmedReason,
    });
  };

  return (
    <Dialog.Root open={open} placement="center" onOpenChange={handleOpenChange}>
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Reject deployment</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="4">
                <Text color="gray.600" fontSize="sm">
                  {approval
                    ? `Please provide a reason for rejecting deployment to ${formatStatus(
                        approval.environment,
                      )}.`
                    : 'Please provide a reason for rejecting this deployment.'}
                </Text>

                <Field.Root invalid={isInvalid}>
                  <Field.Label>Reason</Field.Label>

                  <Textarea
                    minH="120px"
                    placeholder="Example: Smoke tests are failing on staging."
                    value={reason}
                    onBlur={() => setTouched(true)}
                    onChange={(event) => setReason(event.target.value)}
                  />

                  {isInvalid && (
                    <Field.ErrorText>
                      Reject reason is required.
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack justify="flex-end" gap="2">
                <Dialog.CloseTrigger asChild>
                  <Button disabled={loading} variant="ghost">
                    Cancel
                  </Button>
                </Dialog.CloseTrigger>

                <Button
                  colorPalette="red"
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Reject
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
