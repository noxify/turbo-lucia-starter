# Turbo Lucia Starter

## Requirements

- Node >= 22.11 - https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
- Postgres >= 16 - https://postgresapp.com/
- pnpm >= 9.15.0 - https://pnpm.io/installation

## Getting started

1. Clone the repo
2. Open the repo in VSC
3. Install the recommended extensions ( use `@recommended` inside the VSC Extensions search bar )
4. Run `cp .env.example .env` to create a `.env` file
5. Update the `.env` file with your values
6. Run `pnpm install` to install dependencies
7. Run `pnpm db:migrate:dev` to create the tables in the database
8. Run `pnpm dev` to start the app in development mode
9. Start coding

## About this template

This template was original a copy from [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

We just replaced AuthJS with LuciaAuth.

We're using this template internally and found out that some parts are not needed for a "web" monorepo ( = without expo ).

So we updated it to be more like a "web" monorepo and removed all unnecessary stuff.
This was mainly the `trpc` package with `tanstack/query`.

Why? With all the nextjs updates, we think, most usecases don't need the extra layer to get the data.

The template will use nextjs directly to fetch the data. ( https://nextjs.org/docs/app/building-your-application/data-fetching/fetching )

## Project structure

This project is a monorepo based on turborepo.

```
├── apps
│   └── frontend - Contains the logic for the site
├── packages
│   ├── auth - Based on lucia-auth.com / same as we have at itaps monorepo
│   ├── db - Contains all the database related stuff ( prisma schema, migrations, seeds etc. )
│   ├── helpers - Helper functions 🤷‍♂️
│   ├── locales - contains the translations for the `frontend` app
│   ├── logging - Contains the logging wrapper ( via LogLayer )
│   ├── search-params - Contains the search params for the `frontend` app ( e.g. pagination, sorting etc. for the datatable )
│   └── ui - Contains all ui components ( based on shadcn/ui)
└── tooling
    ├── eslint - Contains the config files for eslint
    ├── github - Contains the configuration for github actions
    ├── playwright - Contains the config file for playwright
    ├── prettier - Contains the config file for prettier
    ├── tailwind - Contains the config files for tailwind w/ db ui colors
    └── typescript - Contains the config files for typescript
```

## What's currently included?

- The frontend app is configured to use the latest nextjs version (15.1)
- Auth page is working
- Redirect for unauthorized users to login page
- Empty dashboard ( authorized users only )
- Initial playwright tests exists ( login tests )
- Auth is already configured for Github, Discord
- Supports also mock users
- 18n is configured with `next-intl`

## Helpful commands

- `pnpm dev` - Runs all apps & packages in dev mode. ( if they have a `dev` script )
- `pnpm build` - Builds all apps & packages. ( if they have a `build` script )
- `pnpm test` - Runs all tests ( if they have a `test` script )
- `pnpm lint` - Lints all files in all apps & packages ( if they have a `lint` script )
- `pnpm format:fix` - Formats all files. ( if they have a `format` script )
- `pnpm typecheck` - Runs the typescript type check on all apps & packages. ( if they have a `typecheck` script )
- `pnpm db:generate` - Runs the drizzle generate command: https://orm.drizzle.team/docs/drizzle-kit-generate
- `pnpm db:migrate` - Runs the drizzle migrate command: https://orm.drizzle.team/docs/drizzle-kit-migrate
- `pnpm db:push` - Runs the drizzle push command: https://orm.drizzle.team/docs/drizzle-kit-push
- `pnpm db:seed` - Seeds some data - Uses the drizzle seed command: https://orm.drizzle.team/docs/seed-overview
- `pnpm db:studio` - Opens the drizzle studio: https://orm.drizzle.team/docs/drizzle-kit-studio

## Todos

- [ ] Add unit tests
- [ ] Add more docs ( like how to activate/use mock users )
- [ ] Integrate https://github.com/sadmann7/shadcn-table to have an example
- [ ] Maybe: Adding a RBAC solution ( maybe via casl? )
- [ ] Add a contribution guide

## Credits

Without the amazing work of the [T3 OSS Community](https://github.com/t3-oss), this project wouldn't exists.

Also a big thanks to [dBianchii](https://github.com/dBianchii) for his awesome work and help to migrate the auth package ( previously we used V3, now we run "our own" auth package ) and the locales package ( migrating from `next-international` to `next-intl` ).
