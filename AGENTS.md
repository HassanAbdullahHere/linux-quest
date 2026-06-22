# LinuxQuest — Codex Instructions

## What this project is
A free, open source, static website for Linux/DevOps learners to 
practice real hands-on scenarios. No backend, no login, no cost. 
Hosted on GitHub Pages.

## Tech rules
- No npm, no React, no bundlers — plain HTML + CSS + vanilla JS only
- Must work by just opening index.html in a browser
- No external dependencies or CDN libraries
- Hosted on GitHub Pages (static files only)

## File structure
linuxquest/
├── AGENTS.md
├── Codex.local.md
├── .gitignore
├── index.html         → landing page
├── scenario.html      → scenario detail page (reads ?id= and ?track= from URL)
├── README.md
├── CONTRIBUTING.md
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── app.js         → landing page logic
│       └── scenario.js    → scenario detail page logic
└── scenarios/
    ├── index.json
    ├── standalone/
    └── tracks/


## How scenarios load
app.js fetches scenarios/index.json first, which is the master list 
of all standalone scenarios and tracks. It then fetches each scenario 
JSON file and renders cards dynamically on the landing page.

Clicking a card navigates to scenario.html?id={scenario-id} (and 
optionally ?track={track-id} for series scenarios). scenario.js reads 
URLSearchParams, fetches the correct JSON file, and renders the full 
scenario detail view. No rebuild needed to add a new scenario.

## index.json structure
{
  "standalone": [],
  "tracks": [
    {
      "id": "deploy-like-a-real-engineer",
      "title": "Deploy like a real engineer",
      "description": "Go from a blank VPS to a deployed Node app with nginx, firewall and environment config.",
      "environment": "vps",
      "scenarios": [
        "nginx-static-site",
        "nginx-reverse-proxy",
        "node-app-deploy",
        "firewall-ufw",
        "env-variables",
        "port-management"
      ]
    }
  ]
}

## Standalone scenario JSON schema
{
  "id": "",
  "title": "",
  "type": "standalone",
  "difficulty": "",
  "tags": [],
  "problem": "",
  "setup": {
    "description": "",
    "commands": [],
    "verify": ""
  },
  "hints": ["", "", ""],
  "commands": [],
  "solution": ""
}

## Series scenario JSON schema
{
  "id": "",
  "title": "",
  "type": "series",
  "difficulty": "",
  "tags": [],
  "series": {
    "track_id": "",
    "track_title": "",
    "order": 0,
    "requires": [],
    "requires_description": "",
    "environment": ""
  },
  "problem": "",
  "setup": {
    "description": "",
    "commands": [],
    "verify": "",
    "note": ""
  },
  "hints": ["", "", ""],
  "commands": [],
  "solution": ""
}

## Scenario rules
- Problems must feel real-world, not academic
- Hints array is always exactly 3, going from vague to specific
- Solution must be fully numbered and copy-pasteable
- Commands list is just the tool names, not the full answer

## UI sections

### index.html — Landing page
1. Hero — headline, short description, no CTA wall
2. Standalone section — grid of scenario cards, no setup required.
   Each card click → scenario.html?id={id}
3. Tracks section — preceded by a collapsible EC2 setup accordion
   (collapsed by default). Accordion contains:
   - Brief explanation: tracks run on a real cloud VPS (AWS EC2)
   - Embedded YouTube video: "How to create a free AWS account"
   - Embedded YouTube video: "How to launch an EC2 and SSH into it"
   Below the accordion: visual path cards for each track.
   Each track card click → scenario.html?id={first-scenario}&track={track-id}

### scenario.html — Scenario detail page
Reads ?id= and ?track= from URL params. Renders:
  setup → problem → hints (reveal one at a time) →
  commands → solution (hidden, toggle to reveal) →
  Mark Complete button (writes to localStorage)
Back button returns to index.html.

### Track progress (in scenario.html)
When ?track= is present, show a mini progress bar at the top:
01 → 02 → [current] → 04 → 05
with next/previous navigation between track scenarios.

## Progress tracking
Uses localStorage only. No backend, no accounts.
Key format: "completed:{scenario-id}" = true
Tracks unlock when previous scenario is marked complete.
A "Reset Track" button clears all keys for that track.
Always provide a "Skip prerequisites" option so users are never blocked.

## Product roadmap
Goal: make LinuxQuest feel like a guided Linux practice system, not just
a list of scenarios. Prioritize upgrades that help users know where to
start, what to do next, and why each scenario is worth practicing.

### Core work we will handle first
These are product, architecture, and experience decisions. Keep them
owned by the core project before opening broad contributor work.

1. Trust and promise cleanup
   - Decide and align the final stance on tracking, external embeds,
     hosting, and the "open index.html directly" promise.
   - If the site says "no tracking", remove analytics/tracking scripts.
   - If the site must work from file://, avoid fetch-only JSON loading or
     provide an embedded static data path.

2. Scenario schema upgrade
   Add optional fields that improve learning quality:
   - estimated_time
   - skills
   - environment
   - verification
   - common_mistakes
   - cleanup

3. Homepage training dashboard
   Rework the landing page flow toward:
   - Hero with clear value proposition
   - Continue where you left off
   - Start Here path
   - Recommended scenarios
   - Tracks
   - Skill paths
   - All standalone scenarios

4. Start Here journey
   Add a curated beginner path so new users know the best first scenarios
   and do not feel dropped into an unordered library.

5. Scenario card upgrades
   Show useful metadata on cards:
   - estimated time
   - skills practiced
   - environment
   - difficulty
   - completion status
   - recommended next badge when relevant

6. Scenario page mission flow
   Reorder and polish the scenario page around a practical workflow:
   - context / mission brief
   - setup
   - task
   - hints
   - useful commands
   - solution
   - mark complete
   - next recommended scenario

7. Progress dashboard
   Make local progress more visible:
   - completed scenario count
   - current track progress
   - recommended next scenario
   - recently completed scenarios

8. Skill paths and search
   Add a way to browse and search scenarios by command, skill, difficulty,
   environment, and track.

9. Track campaign experience
   Make each track feel like a complete learning campaign with:
   - final outcome
   - prerequisites
   - total estimated time
   - scenario map
   - progress
   - reset and skip-prerequisite controls

10. Completion and retention loop
    After a scenario is completed, always show a useful next step instead
    of leaving the user at a dead end.

### Contributor issues to open now
These are independent enough to open before the schema/UI upgrade.

1. Add new standalone scenarios using the current schema.
2. Propose new track ideas with scenario outlines.
3. Improve README screenshots or GIFs.
4. Open scenario-request issues for future content ideas.
5. Report specific mobile UI polish problems with screenshots.

### Contributor issues to open after schema/UI upgrade
Open these after the new fields are defined and displayed by the UI.

1. Add estimated_time to existing scenarios.
2. Add skills arrays to existing scenarios.
3. Add verification goals to existing scenarios.
4. Add common_mistakes to existing scenarios.
5. Add cleanup/reset commands to existing scenarios.
6. Expand existing tracks with stronger metadata and verification.

### Suggested future tracks
- Linux First Week
- Server Debugging Bootcamp
- Nginx From Zero
- Docker For Real Deployments
- Bash Automation
- Security Incident Response

## Style
- Refer to STYLE.md

## Contributing a new scenario
1. Fork the repo
2. Add JSON file to scenarios/standalone/ or the correct track folder
3. Add the scenario id to scenarios/index.json
4. Open a PR — no app code changes needed
