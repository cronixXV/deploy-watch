# DeployWatch

DeployWatch — это dashboard для мониторинга CI/CD-процессов: проектов, pipeline runs, builds, build logs, deployments, environments и approvals.

## Project idea

Идея проекта — создать единый интерфейс для команды разработки и release managers, где можно быстро понять состояние CI/CD:

- какие проекты сейчас стабильны;
- какие pipeline runs выполняются или упали;
- какие builds требуют внимания;
- что задеплоено в каждое окружение;
- какие deployments ожидают approval;
- какие действия доступны пользователю в зависимости от роли.

DeployWatch имитирует production-like CI/CD dashboard с авторизацией, mock API, live polling, таблицами, графиками, логами и role-based UI.

## Problem

В реальных командах информация о CI/CD часто разбросана между разными инструментами:

- GitHub / GitLab pipelines;
- логами build-систем;
- deployment tools;
- environment dashboards;
- approval-процессами;
- внутренними release-чатами.

Из-за этого сложно быстро ответить на вопросы:

- проект сейчас здоровый или есть проблемы?
- какой pipeline упал?
- какой build/job сломался?
- что сейчас задеплоено на production?
- кто запросил deployment?
- ожидает ли deployment approval?
- можно ли сделать rollback?

DeployWatch решает эту проблему через единый dashboard.

## Key features

- Авторизация через mock login.
- Восстановление сессии после reload.
- Logout с очисткой auth state и query cache.
- Projects page со списком проектов и health-состоянием.
- Project overview dashboard:
  - latest pipeline;
  - build success rate;
  - average build duration;
  - recent deployments;
  - environment health;
  - open approvals;
  - charts and widgets.
- Pipelines page:
  - таблица pipeline runs;
  - фильтры через URL query params;
  - сортировка и пагинация через TanStack Table.
- Pipeline details page:
  - status;
  - branch;
  - commit;
  - author;
  - duration;
  - jobs;
  - related deployment;
  - live polling.
- Build details page:
  - metadata;
  - pipeline link;
  - commit;
  - branch;
  - author;
  - duration;
  - status.
- Build logs viewer:
  - virtualization через TanStack Virtual;
  - поиск по логам;
  - фильтр по level;
  - auto-scroll;
  - copy log line.
- Environments dashboard:
  - development;
  - testing;
  - staging;
  - production;
  - current version;
  - current commit;
  - last deployment;
  - deployed by;
  - active incidents;
  - locked/unlocked state.
- Deployments page:
  - история деплоев;
  - deployment timeline;
  - rollback action через confirm dialog.
- Approvals flow:
  - approve deployment;
  - reject deployment с reason;
  - optimistic update;
  - rollback on API error.
- Toast notifications через Sonner.
- Error normalization через единый `ApiError`.
- Settings page:
  - polling interval;
  - notifications enabled;
  - default project.
- Role-based UI:
  - viewer;
  - developer;
  - release manager.

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack Query
- TanStack Table
- TanStack Virtual
- Chakra UI
- Recharts
- React Hook Form
- Yup
- Axios
- MSW
- Sonner
- Lucide React

## Architecture

Проект построен с упором на модульность, масштабируемость и разделение ответственности.

Основные принципы:

- серверное состояние хранится в TanStack Query;
- клиентское UI-состояние хранится в Redux Toolkit;
- API слой отделён от UI;
- mock backend реализован через MSW;
- бизнес-логика вынесена в `entities` и `features`;
- страницы собираются из widgets и features;
- общие UI-компоненты и helpers лежат в `shared`.

## FSD structure

Проект использует Feature-Sliced Design.

## Mock API

Mock API реализован через MSW.

MSW используется для имитации realistic backend без реального сервера:

- mock users;
- mock projects;
- mock pipeline runs;
- mock builds;
- mock build logs;
- mock environments;
- mock deployments;
- mock approvals;
- artificial delays;
- API errors;
- dynamic status changes;
- approve/reject/rollback mutations.

Основные endpoints:

```txt
GET /auth/me
POST /auth/login
POST /auth/logout

GET /users

GET /projects
GET /projects/:projectId

GET /projects/:projectId/pipeline-runs
GET /pipeline-runs/:pipelineId
GET /pipeline-runs/:pipelineId/builds
GET /projects/:projectId/pipeline-runs/meta

GET /projects/:projectId/builds
GET /builds/:buildId
GET /builds/:buildId/logs

GET /projects/:projectId/environments

GET /deployments
GET /projects/:projectId/deployments
POST /deployments/:deploymentId/approve
POST /deployments/:deploymentId/reject
POST /deployments/:deploymentId/rollback

GET /approvals
```

## Technical decisions

### TanStack Query

В проекте TanStack Query отвечает за:

- загрузку серверных данных;
- cache;
- invalidation после mutations;
- polling для live pipeline/build states;
- optimistic update для approvals.

### Redux Toolkit

Redux используется для:

- auth state;
- settings state;
- local UI preferences.

Серверные данные не хранятся в Redux.

### MSW

MSW позволяет разрабатывать frontend без настоящего backend, но с production-like API поведением:

- задержки;
- ошибки;
- динамические статусы;
- мутации;
- mock auth.

### TanStack Virtual

Build logs могут быть длинными, поэтому список логов виртуализирован. Это позволяет эффективно рендерить большое количество строк без просадок производительности.

### Feature-Sliced Design

FSD помогает разделить проект на слои:

- `app` — инициализация приложения;
- `pages` — route-level страницы;
- `widgets` — крупные UI-блоки;
- `features` — пользовательские сценарии;
- `entities` — бизнес-сущности;
- `shared` — переиспользуемые утилиты, UI и API.

## How to run

Установить зависимости:

```bash
npm install
```

Запустить проект в dev mode:

```bash
npm run dev
```

Открыть приложение:

```txt
http://localhost:5173
```

Mock API включается автоматически в development mode.

## Demo credentials

```txt
alex@deploywatch.dev / password
mia@deploywatch.dev / password
ivan@deploywatch.dev / password
sarah@deploywatch.dev / password
```

Роли:

```txt
Alex Morgan  — release_manager
Mia Chen     — developer
Ivan Petrov  — developer
Sarah Kim    — viewer
```

## Available scripts

```bash
npm run dev
```

Запуск development server.

```bash
npm run build
```

Production build.

```bash
npm run preview
```

Preview production build.

```bash
npm run lint
```

Запуск lint-проверок.

```bash
npm run format
```

Форматирование кода, если script настроен в проекте.
