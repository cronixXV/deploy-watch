import { useLocation, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname ?? '/projects';

  navigate(from, { replace: true });
  return (
    <main>
      <h1>Login</h1>
      <p>Sign in to DeployWatch</p>
    </main>
  );
};
