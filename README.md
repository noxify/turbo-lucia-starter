# Acme

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
    ├── playwright - Contains the config file for playwright
    ├── prettier - Contains the config file for prettier
    ├── tailwind - Contains the config files for tailwind w/ db ui colors
    └── typescript - Contains the config files for typescript
```

## What's currently included?

- The frontend app is configured to use the latest nextjs version (15)
- Auth page is working
- Redirect for unauthorized users to login page
- Empty dashboard ( authorized users only )
- Initial playwright tests exists ( login tests )
- Auth is already configured for WebSSO & Mock Users
- 18n is configured with `next-intl`

## Helpful commands

- `pnpm dev` - Runs all apps & packages in dev mode. ( if they have a `dev` script )
- `pnpm build` - Builds all apps & packages. ( if they have a `build` script )
- `pnpm test` - Runs all tests ( if they have a `test` script )
- `pnpm lint` - Lints all files in all apps & packages ( if they have a `lint` script )
- `pnpm format:fix` - Formats all files. ( if they have a `format` script )
- `pnpm typecheck` - Runs the typescript type check on all apps & packages. ( if they have a `typecheck` script )
- `pnpm db:migrate:dev` - Runs the prisma migrations in dev mode w/o seeding
- `pnpm db:migrate:reset` - Resets the database and runs all existing migrations w/o seeding
- `pnpm db:seed` - Seeds the database with some data
- `pnpm db:studio` - Opens the prisma studio
- `pnpm db:generate` - Generates the prisma client from the schema ( helpful after running `pnpm i`)
