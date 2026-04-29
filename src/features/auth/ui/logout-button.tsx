import { Button } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch } from '@/app/store/hooks';
import { logout as logoutAction } from '@/app/store/slices/auth-slice';
import { useLogoutMutation } from '@/entities/auth';
import { getApiErrorMessage } from '@/shared/api/client/client';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      dispatch(logoutAction());

      toast.success('Signed out successfully');

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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
