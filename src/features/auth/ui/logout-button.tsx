import { Button } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/app/store/hooks';
import { logout as logoutAction } from '@/app/store/slices/auth-slice';
import { useLogoutMutation } from '@/entities/auth';
import { useAppToast } from '@/shared/hooks/use-app-toast';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation();
  const appToast = useAppToast();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      dispatch(logoutAction());

      appToast.success('Signed out successfully');

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      appToast.errorFromUnknown(error);
    }
  };

  return (
    <Button
      colorPalette="gray"
      loading={logoutMutation.isPending}
      size="sm"
      variant="ghost"
      onClick={handleLogout}
    >
      <LogOut size={16} />
      Logout
    </Button>
  );
};
