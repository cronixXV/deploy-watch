import { Button, Dialog, HStack, Portal, Text } from '@chakra-ui/react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  colorPalette?: 'red' | 'teal' | 'gray';
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  colorPalette = 'red',
  loading,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root
      open={open}
      placement="center"
      onOpenChange={(details) => onOpenChange(details.open)}
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="gray.600">{description}</Text>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack gap="2" justify="flex-end">
                <Dialog.CloseTrigger asChild>
                  <Button disabled={loading} variant="ghost">
                    {cancelText}
                  </Button>
                </Dialog.CloseTrigger>

                <Button
                  colorPalette={colorPalette}
                  loading={loading}
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
