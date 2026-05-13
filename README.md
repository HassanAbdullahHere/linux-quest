<p align="center">
  <img src="assets/banner.svg" alt="LinuxQuest" width="100%">
</p>

<p align="center">
  <a href="https://github.com/HassanAbdullahHere/linux-quest/actions/workflows/deploy.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/HassanAbdullahHere/linux-quest/deploy.yml?style=for-the-badge&label=DEPLOY&logo=amazonaws&logoColor=white&color=76b900&labelColor=000000" alt="Deploy">
  </a>
  <a href="https://linuxquest.online">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Flinuxquest.online&style=for-the-badge&label=LINUXQUEST.ONLINE&color=76b900&labelColor=000000" alt="Website">
  </a>
  <a href="https://github.com/HassanAbdullahHere/linux-quest/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/LICENSE-MIT-76b900?style=for-the-badge&labelColor=000000" alt="License">
  </a>
  <img src="https://img.shields.io/badge/DEPENDENCIES-NONE-76b900?style=for-the-badge&labelColor=000000" alt="No dependencies">
</p>

---

**Free, open source, hands-on Linux and DevOps practice scenarios.**  
No login. No cost. No setup beyond opening a browser.

[Live Site](https://linuxquest.online) · [Report a Bug](https://github.com/HassanAbdullahHere/linux-quest/issues) · [Request a Scenario](https://github.com/HassanAbdullahHere/linux-quest/issues)

---

## What is LinuxQuest?

LinuxQuest drops you into realistic sysadmin and DevOps situations — a crashed server, a full disk, a misconfigured reverse proxy — and asks you to fix them. Each scenario gives you:

- A real-world **problem statement** to diagnose
- A **setup block** so you can reproduce the environment locally or on a VPS
- Three progressive **hints** (vague → specific) that you reveal one at a time
- A list of **relevant commands** (tool names, not spoilers)
- A fully numbered, copy-pasteable **solution** hidden behind a toggle
- A **Mark Complete** button backed by `localStorage` so your progress persists

---

No accounts. No tracking. Just practice.

## Infrastructure

- Hosted on **AWS S3** with versioning and server-side encryption (SSE-S3)
- Served globally via **CloudFront CDN** with HTTPS and TLS 1.3
- Custom domain: **[linuxquest.online](https://linuxquest.online)**
- CI/CD via **GitHub Actions** — HTML validation quality gate runs before every deployment
- Zero stored credentials — GitHub Actions authenticates via **IAM OIDC** with least privilege role
- Automatic CloudFront cache invalidation on every deployment
- DNS managed via Namecheap with ACM certificate auto-renewal
---

## Content

### Standalone Scenarios
Quick, self-contained challenges that run on any Linux machine.

| Scenario | Difficulty |
|---|---|
| You just got a new server | Beginner |
| Onboard a new developer | Beginner |
| Something is eating your server | Intermediate |
| Disk is at 95%, fix it before it kills the server | Intermediate |
| Someone was in your server | Advanced |

### Tracks
Guided multi-step series that run on a real cloud VPS (AWS EC2).

| Track | Scenarios |
|---|---|
| Deploy like a Real Engineer | nginx static site → Node app deploy → nginx reverse proxy → UFW firewall → environment variables → port management |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | Plain HTML5 |
| Styles | Vanilla CSS (`assets/css/style.css`) |
| Logic | Vanilla JS — no frameworks, no bundler |
| Data | Static JSON files under `scenarios/` |
| Hosting | AWS S3 + CloudFront |
| Dependencies | None |

Opens directly as a file — no `npm install`, no build step, no server needed.

---

## File Structure

```
linux-quest/
├── index.html              Landing page
├── scenario.html           Scenario detail page (?id= and ?track= URL params)
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js          Landing page logic
│   │   └── scenario.js     Scenario detail page logic
│   └── linuxquest_logo.svg
└── scenarios/
    ├── index.json          Master list of all scenarios and tracks
    ├── standalone/         One JSON file per standalone scenario
    └── tracks/
        └── deploy-like-a-real-engineer/
            └── *.json      One JSON file per track scenario
```

---

## Running Locally

```bash
git clone https://github.com/HassanAbdullahHere/linux-quest.git
cd linux-quest
```

Then open `index.html` in your browser. That's it.

> **Note:** Some browsers block `fetch()` for local `file://` URLs. If scenarios don't load, serve the folder with any static file server:
> ```bash
> python3 -m http.server 8080
> # then open http://localhost:8080
> ```

---

## Adding a Scenario

No app code changes are needed — just a JSON file and one line in `index.json`.

### Standalone scenario

1. Create `scenarios/standalone/{your-scenario-id}.json`
2. Add the id to the `"standalone"` array in `scenarios/index.json`

**Template:**
```json
{
  "id": "your-scenario-id",
  "title": "Short, action-oriented title",
  "type": "standalone",
  "difficulty": "beginner",
  "tags": ["tag1", "tag2"],
  "problem": "Describe the real-world situation the user is dropped into.",
  "setup": {
    "description": "What this setup step does.",
    "commands": ["mkdir -p ~/linuxquest/example"],
    "verify": "Command the user can run to confirm setup worked."
  },
  "hints": [
    "Vague nudge in the right direction.",
    "More specific hint about the approach.",
    "Almost the answer — name the exact command or flag."
  ],
  "commands": ["ls", "grep", "awk"],
  "solution": "1. Run this.\n2. Then run that.\n3. Verify with the verify command."
}
```

### Track (series) scenario

1. Create `scenarios/tracks/{track-id}/{your-scenario-id}.json`
2. Add the id to the correct track's `"scenarios"` array in `scenarios/index.json`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full series template and scenario rules.

---

## Scenario Rules

- Problem must feel **real-world**, not academic.
- `hints` must be **exactly 3** — ordered vague → specific.
- `solution` must be **fully numbered and copy-pasteable**.
- `commands` lists **tool names only**, never the full answer.

---

## Contributing

Contributions are welcome. The three ways to help:

1. **Submit a scenario** — fork, add a JSON file, open a PR.
2. **Suggest a scenario** — open an issue with the Scenario Request template.
3. **Report a bug or idea** — open an issue describing what's wrong or what you'd improve.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

## License

MIT — free to use, share, and build on.
