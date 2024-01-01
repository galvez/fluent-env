# Conventions used by different runtimes and frameworks

## Runtimes

### Node.js

- Starting in v20, the `--env-file` CLI parameter was added with support for `.env` files.
- Can be used multiple times, where subsequent files override pre-existing variables defined in previous files.
- This behavior differs from the `dotenv` package for Node.js, where variables redefined in subsequent files are ignored.

### Bun

- Loads `.env`, then `.env.[environment]`, then `env.local`.
- Can be used multiple times.
- Documentation doesn't mention whether or not subsequent files cause overriding.

## Frameworks

### Vite

- Has `dotenv-expand ` enabled by default.
- Existing environment takes priority.
- Loads `.env`, then `.env.local`.
- Then `.env.[mode]` and finally `.env.[mode].local`.
- Once a variable is set, subsequent assignments are ignored.

**Astro** and **SvelteKit** share the same conventions.

### Qwik

Although **Qwik** also uses **Vite**, it has its own conventions:

- Uses `.env` for build time variables.
- Uses `.env.local` for server variables that don't go it into the bundle.

### Nuxt

Although **Nuxt** also uses **Vite**, it has its own convention:

- Uses `.env` for build time and runtime variables.
- Using different files is possible via the CLI.
- Doesn't load `.env` files in production mode.

### Remix

- Loaded `.env` for development mode only.
- Doesn't support `.env.[mode]` nor the `.local` suffix.
- Behavior in production depends on the adapter used.

### Next.js

- Allowed values for `NODE_ENV` are `production`, `development` and `test`.
- Existing environment takes priority.
- Loads `.env.[mode].local`, then `env.local`, then `.env.[mode]` and finally `.env`.
- Once a variable is set, subsequent assignments are ignored.

## References

- [https://bun.sh/docs/runtime/env](https://bun.sh/docs/runtime/env)
- [https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [https://vitejs.dev/guide/env-and-mode](https://vitejs.dev/guide/env-and-mode)
- [https://docs.astro.build/en/guides/environment-variables/](https://docs.astro.build/en/guides/environment-variables/)
- [https://kit.svelte.dev/docs/modules#$env-dynamic-private](https://kit.svelte.dev/docs/modules#$env-dynamic-private)
- [https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [https://qwik.builder.io/docs/env-variables/#environment-variables](https://qwik.builder.io/docs/env-variables/#environment-variables)
