# Test

> The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).

## Features

- Monorepo via turborepo
- NextJS 14
- TRPC ( with RSC support )
- Lucia Auth with multi provider support
- i18n support ( with support for i18n-ally )
- tailwind with shadcn-ui

## Installation

Use Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/noxify/t3-turbo-lucia
```

## About

It uses [Turborepo](https://turborepo.org) and contains:

```text
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using lucia-auth@v3
  ├─ db
  |   └─ Typesafe db calls using Drizzle & postgres
  ├─ locales
  |   └─ type-safe internationalization
  ├─ validators
  |   └─ shared zod schemas for trpc and forms
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

To get it running, follow the steps below.

The db is currently configured for `postgres`.

Feel free to change it.

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push

# Let's get the party stared
pnpm dev
```

## i18n

This packages uses [next-international](https://github.com/quiiBz/next-international) for type-safe translations.

This setup is a bit different to the original docs.
We're using `json` files and generating the `ts` files from them.

Why? Using json files allows us to use the vsc extension [`i18n ally`](https://github.com/lokalise/i18n-ally), which makes it a lot easier to manage the translations.

> Note: If you don't need / use the i18n-ally extension, you could simply import the typescript files directly ( without using the json files).
> Unfortunately the i18n-ally doesn't support writing `.ts` files.

**Example:**

Inside a component you write something like `{t('new.translation.key')}`. If you have the vsc extension installed, everything is pre-configured and you only have to hover over the `new.translation.key` and you will see a popover from `i18n ally` which helps you to generate the translations.

If you save the translation, it will update the `json` files inside `packages/locales/src/lang`.

Last step what you have to do is to run `pnpm lang:gen` from your project root to (re-)generate the `ts` files ( which are located in `packages/locales/src/generated` ).

> Note: Thanks to dBianchii, he provided a PR which automates the re-generation 🫡
> So, while running `pnpm dev` the `generated/[lang].ts` files are (re-)generated after updating the json files automagically.

The vsc extension includes also some other features.

Visit their [wiki](https://github.com/lokalise/i18n-ally/wiki) to learn more about it.

## Credits / Special thanks

- https://github.com/shadcn-ui
- https://github.com/juliusmarminge
- https://github.com/dBianchii
- https://github.com/t3-oss
- https://github.com/QuiiBz
- https://github.com/HamedBahram
- https://github.com/lucia-auth

If you like what you see, feel free to support one or all of them via their sponsoring options ( if available ).
