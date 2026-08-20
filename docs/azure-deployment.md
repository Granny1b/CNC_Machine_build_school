# Deploying to Azure Static Web Apps

The canonical site is an Azure Static Web App. The GitHub Pages site still
exists, but it is now an archived copy that points here.

Everything below is a one-time setup. After it is done, pushing to `main`
deploys automatically.

---

## Why this hosting shape

Every route in the course is prerendered. There are no route handlers, no
server actions and no request-time data, so the whole site is 67 files and
about 6.7 MB of static output. Nothing needs a server, which is what makes the
free tier viable rather than a compromise.

The practical consequence: **never deploy this as `npm start` on App Service or
Container Apps.** That rents an always-on VM to serve files that need no server,
and it is the most common way to overpay for a Next.js site by an order of
magnitude.

| | Free plan | Standard plan |
|---|---|---|
| Cost | £0 | $9 per app per month |
| Bandwidth | 100 GB/month included, no overage | 100 GB/month, then $0.20/GB |
| Custom domains | 2 | 5 |
| SSL | Free and automatic | Free and automatic |
| SLA | None | Yes |

At roughly 1–2 MB per learner session, 100 GB is on the order of fifty thousand
visits a month. Start on Free. Move to Standard when you need the SLA or a
third domain, not before.

---

## Step 1 — Create the Static Web App

In the [Azure portal](https://portal.azure.com):

1. **Create a resource** → search **Static Web App** → **Create**.
2. Fill in the basics:
   - **Subscription** and **Resource group** — create a group such as
     `rg-cnc-academy` if you do not have one.
   - **Name** — for example `cnc-academy`. This becomes part of the default
     hostname.
   - **Plan type** — **Free**.
   - **Region** — pick the one nearest your learners. Static content is served
     from Azure's edge regardless, so this mainly affects management.
3. Under **Deployment details**, choose **Other**.

   Do *not* let the portal connect to GitHub here. It would generate its own
   workflow file that tries to build the project its way and would collide with
   `.github/workflows/azure.yml`, which is already written and already runs the
   project's checks.
4. **Review + create** → **Create**.

When deployment finishes, open the resource and copy the **URL** from the
overview page. It looks like
`https://cnc-academy.azurestaticapps.net`, possibly with a
random word pair in it. You need this in step 3.

## Step 2 — Give GitHub the deployment token

1. In the Static Web App, go to **Overview** → **Manage deployment token** and
   copy the token.
2. In GitHub: **Settings** → **Secrets and variables** → **Actions** →
   **Secrets** tab → **New repository secret**.
3. Name it exactly `AZURE_STATIC_WEB_APPS_API_TOKEN` and paste the token.

This token can publish to your site, so treat it like a password. If it leaks,
regenerate it from the same portal page — the old one stops working
immediately.

## Step 3 — Tell the archived site where the real one is

1. In GitHub: **Settings** → **Secrets and variables** → **Actions** →
   **Variables** tab → **New repository variable**.
2. Name it `PRIMARY_SITE_URL` and set it to the Azure URL from step 1, with no
   trailing slash:

   ```
   https://cnc-academy.azurestaticapps.net
   ```

This one variable is what switches the GitHub Pages build into archived mode.
Until it is set, the Pages build stays an ordinary site — `src/lib/site.ts`
suppresses the notice when there is nowhere to send people, so a half-finished
setup degrades to the current behaviour instead of shipping a banner that links
to nothing.

## Step 4 — Deploy

Push to `main`, or run **Actions** → **Deploy to Azure Static Web Apps** →
**Run workflow**.

The workflow typechecks, runs the content and G-code integrity checks, builds
the static export without the `/<repo>/` path prefix, copies
`staticwebapp.config.json` into the artifact, and uploads it.

Then check the live site:

```bash
BASE=https://cnc-academy.azurestaticapps.net npm run sweep
```

The sweep drives Chromium over every route and checks layout, contrast, heading
order, accessible names and focus rings. It works against any origin, so it is
as valid a check of production as of localhost.

Also confirm by hand:

- A deep link loads directly — `/learn/understanding-xyz/` typed into the address
  bar, not reached by clicking. This is what proves the routing config works.
- A nonsense URL such as `/nope/` returns the 404 page **with a 404 status**
  (`curl -I`), not a 200.
- The archived Pages site now shows the notice bar, and its page source carries
  `<link rel="canonical">` pointing at the matching Azure path.

## Step 5 — Custom domain, when you want one

In the Static Web App: **Settings** → **Custom domains** → **Add**.

- **A subdomain** (`www.example.com` or `learn.example.com`) is the easy path:
  add the CNAME record Azure shows you, plus the TXT record it asks for to
  validate ownership. SSL is issued automatically and free.
- **An apex domain** (`example.com`, no subdomain) cannot use a CNAME — DNS
  standards forbid it at the zone root. You need ALIAS/ANAME support, CNAME
  flattening, or Azure DNS hosting the zone. Cloudflare and Azure DNS both
  handle this; some registrars do not.

The Free plan allows 2 custom domains, which is enough for apex plus `www`.

If you add a custom domain, update `PRIMARY_SITE_URL` to match so the archived
site points at the domain rather than the `azurestaticapps.net` hostname.

---

## What this costs to run

Nothing, on the Free plan, unless you exceed 100 GB of bandwidth in a month —
and the Free plan has no overage billing, so it cannot surprise you with a bill.
It stops serving instead. That is the right failure mode for a course site and
the wrong one for a business, which is the actual reason to move to Standard.

Two things to avoid, both of which cost more than the hosting:

- **Azure Front Door or CDN in front of this.** It carries a standing monthly
  charge that dwarfs the bandwidth bill at this traffic level, and Static Web
  Apps already serves from a global edge.
- **Application Insights** left on default sampling. Useful, but it is metered
  by data volume and can quietly become the largest line on the invoice.

---

## A consequence worth knowing about

Learner progress is stored in `localStorage`, which is scoped to an origin.
Progress recorded on the GitHub Pages URL **does not follow anyone to the Azure
URL** — the browser treats them as unrelated sites. There is no way around this
from the server side; it is how origin isolation works.

For a course with few existing learners this is acceptable. If it is not, the
fix is an export/import pair against the existing `ProgressStore` interface in
`src/lib/progress.ts`: a "download my progress" button on `/progress` and a
matching restore, which also solves the unrelated problem of moving between
devices. That is not built yet.

---

## Retiring the GitHub Pages copy

Once the old URL has stopped receiving meaningful traffic:

1. Delete `.github/workflows/pages.yml`.
2. In GitHub **Settings** → **Pages**, set the source to **None**.

Leave the `PRIMARY_SITE_URL` variable in place — it is harmless, and removing
it is one more thing to remember if the Pages copy is ever revived.
