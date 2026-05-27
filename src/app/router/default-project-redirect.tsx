import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@/app/store/hooks';

export function DefaultProjectRedirect() {
  const defaultProjectId = useAppSelector(
    (state) => state.settings.defaultProjectId,
  );

  if (defaultProjectId) {
    return <Navigate to={`/projects/${defaultProjectId}`} replace />;
  }

  return <Navigate to="/projects" replace />;
}
