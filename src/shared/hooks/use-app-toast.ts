import { toast } from 'sonner';

import { getApiErrorMessage } from '../api/client/client';

import { useAppSelector } from '@/app/store/hooks';

export function useAppToast() {
  const notificationsEnabled = useAppSelector(
    (state) => state.settings.notificationsEnabled,
  );

  return {
    success: (
      message: string,
      options?: Parameters<typeof toast.success>[1],
    ) => {
      if (notificationsEnabled) {
        toast.success(message, options);
      }
    },

    error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
      if (notificationsEnabled) {
        toast.error(message, options);
      }
    },

    info: (message: string, options?: Parameters<typeof toast.info>[1]) => {
      if (notificationsEnabled) {
        toast.info(message, options);
      }
    },

    errorFromUnknown: (error: unknown) => {
      if (notificationsEnabled) {
        toast.error(getApiErrorMessage(error));
      }
    },
  };
}
