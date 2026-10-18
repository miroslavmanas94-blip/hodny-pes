# Deploy Hodný pes to Cloudflare Workers

This repository uses Next.js 15 and the OpenNext Cloudflare adapter.

## Cloudflare dashboard

1. Open Workers & Pages in the Cloudflare dashboard.
2. Choose **Create application** and import the GitHub repository `miroslavmanas94-blip/hodny-pes`.
3. If Cloudflare asks to auto-configure the Next.js project with vinext, do not apply that migration on this branch; this project is configured for OpenNext.
4. Configure the build to use the repository's `npm run deploy` script, or use the local CLI steps below.
5. Add any required application environment variables under Worker settings. Never commit secrets to GitHub.

## Local deployment (Windows)

Install Node.js LTS, then open PowerShell in the project directory and run:

```powershell
npm install
npx wrangler login
npm run preview
```

If the preview works, deploy with:

```powershell
npm run deploy
```

The first deploy may ask you to authorize Cloudflare. The deployed address will be shown in the terminal.

## Notes

- The Cloudflare account must authorize deployment.
- Supabase environment variables, if needed by the app, must be configured separately in Cloudflare.
- A successful GitHub commit is not proof of a successful Cloudflare build or deployment; verify the preview and deployment logs.
