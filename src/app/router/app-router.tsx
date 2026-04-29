import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './protected-route';

import { ApprovalsPage } from '@/pages/approvals/ui/approvals-page';
import { BuildDetailsPage } from '@/pages/build-details/ui/build-details-page';
import { DeploymentsPage } from '@/pages/deployments/ui/deployments-page';
import { EnvironmentsPage } from '@/pages/environments/ui/environments-page';
import { LoginPage } from '@/pages/login/ui/login-page';
import { PipelineDetailsPage } from '@/pages/pipeline-details/ui/pipeline-details-page';
import { PipelinesPage } from '@/pages/pipelines/ui/pipelines-page';
import { ProjectOverviewPage } from '@/pages/project-overview/ui/project-overview-page';
import { ProjectsPage } from '@/pages/projects/ui/projects-page';
import { SettingsPage } from '@/pages/settings/ui/settings-page';
import { AppShell } from '@/widgets/app-shell';

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <Navigate to="/projects" replace />,
          },
          {
            path: '/projects',
            element: <ProjectsPage />,
          },
          {
            path: '/projects/:projectId',
            element: <ProjectOverviewPage />,
          },
          {
            path: '/projects/:projectId/pipelines',
            element: <PipelinesPage />,
          },
          {
            path: '/projects/:projectId/pipelines/:pipelineId',
            element: <PipelineDetailsPage />,
          },
          {
            path: '/projects/:projectId/builds/:buildId',
            element: <BuildDetailsPage />,
          },
          {
            path: '/projects/:projectId/environments',
            element: <EnvironmentsPage />,
          },
          {
            path: '/projects/:projectId/deployments',
            element: <DeploymentsPage />,
          },
          {
            path: '/approvals',
            element: <ApprovalsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
