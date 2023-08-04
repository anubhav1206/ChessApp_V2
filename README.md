# Create Svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you haven't done this step yet, follow these instructions to create a new Svelte project:

```bash
# create a new project in the current directory
npm create svelte@latest

# or create a new project in a specific directory (e.g., my-app)
npm create svelte@latest my-app
```

## Developing

Once you have created the project and installed the required dependencies with `npm install` (or `pnpm install` or `yarn`), you can start a development server:

```bash
npm run dev

# or start the server and automatically open the app in a new browser tab
npm run dev -- --open
```

This will launch a local development server, allowing you to work on your Svelte project and see changes in real-time.

## Building

To create a production-ready version of your app, use the following command:

```bash
npm run build
```

This will generate optimized and minified files that can be deployed to a web server or a hosting platform.

## Previewing the Production Build

You can preview the production build locally before deployment using the following command:

```bash
npm run preview
```

This will serve the production version of your app so you can check if everything looks and works as expected.

> To deploy your Svelte app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) tailored to your target environment. Adapters provide integration with various platforms, making it easier to deploy your Svelte app to places like static hosting services, serverless environments, or traditional servers.
