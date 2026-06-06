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

## Style
- Refer to STYLE.md

## Contributing a new scenario
1. Fork the repo
2. Add JSON file to scenarios/standalone/ or the correct track folder
3. Add the scenario id to scenarios/index.json
4. Open a PR — no app code changes needed