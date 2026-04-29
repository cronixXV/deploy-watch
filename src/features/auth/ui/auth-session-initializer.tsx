import { Center, Spinner } from '@chakra-ui/react';
import { useEffect, type ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  loginSucceeded,
  logout,
  sessionRestoreFinished,
} from '@/app/store/slices/auth-slice';
import { getCurrentUser } from '@/entities/user';
import { STORAGE_KEYS } from '@/shared/consts/storage';

type AuthSessionInitializerProps = {
  children: ReactNode;
};

export function AuthSessionInitializer({
  children,
}: AuthSessionInitializerProps) {
  const dispatch = useAppDispatch();

  const isSessionRestored = useAppSelector(
    (state) => state.auth.isSessionRestored,
  );

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem(STORAGE_KEYS.authToken);

      if (!token) {
        if (isMounted) {
          dispatch(sessionRestoreFinished());
        }

        return;
      }

      try {
        const user = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        dispatch(
          loginSucceeded({
            user,
            token,
          }),
        );
      } catch {
        localStorage.removeItem(STORAGE_KEYS.authToken);

        if (isMounted) {
          dispatch(logout());
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (!isSessionRestored) {
    return (
      <Center minH="100vh">
        <Spinner color="teal.500" size="lg" />
      </Center>
    );
  }

  return children;
}
