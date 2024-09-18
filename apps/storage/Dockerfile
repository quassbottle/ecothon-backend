FROM node:20 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as prod

WORKDIR /usr/src/app

COPY . .
RUN pnpm install

RUN ls

RUN pnpm run schema:generate
RUN pnpm run build storage

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD ["pnpm", "run", "start:storage:prod"]