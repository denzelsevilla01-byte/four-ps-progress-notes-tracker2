# Secure Cloudflare roster setup

The repository intentionally does **not** contain beneficiary roster records.

## Required Cloudflare resources

1. Create a D1 database named `san-fabian-roster`.
2. Import the private `san-fabian-roster-d1-import.sql` file into that database.
3. Bind the database to this Worker using the binding name `DB`.
4. Protect the Worker with Cloudflare Access.
5. Add these Worker environment variables:
   - `TEAM_DOMAIN` — `https://<your-team-name>.cloudflareaccess.com`
   - `POLICY_AUD` — the Access application's Audience (AUD) tag
   - `AUTHORIZED_EMAILS` — comma-separated email addresses permitted to read the roster
6. Redeploy the Worker.

## Import command

From the folder containing the private SQL file, after authenticating Wrangler:

```bash
npx wrangler d1 execute san-fabian-roster --remote --file=./san-fabian-roster-d1-import.sql
```

## Security model

- Static website code remains deployable from the public repository.
- Roster records remain in private Cloudflare D1 storage.
- `/api/roster.js` validates the Cloudflare Access JWT signature, issuer, audience, and email allowlist before returning roster data.
- Roster responses use `Cache-Control: private, no-store` and are marked `noindex`/`noarchive`.
- If Access variables, authorization, the D1 binding, or roster data are missing, the endpoint fails closed and returns an empty roster state instead of confidential records.

Do not commit the private SQL import file or the original beneficiary spreadsheet to a public repository.
