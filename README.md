# Network Transformation Studio

A premium, dark-themed, interactive network engineering and customer workshop platform designed to replace the traditional telco sales architecture workshop.

## Tech Stack

- **React 18** + **TypeScript** — Typed component architecture
- **Vite** — Fast dev server and optimized builds
- **Tailwind CSS** — Utility-first styling (with custom design token system)
- **Recharts** — Radar charts, bar charts for maturity & tradeoff analysis
- **Zustand** — Lightweight state management

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Railway auto-detects the Vite config and deploys

The included `railway.json` configures:
- Build: `npm install && npm run build`
- Start: `npm run start` (serves built files via Vite preview)

## Project Structure

```
src/
├── App.tsx                          # Main app shell + routing
├── main.tsx                         # React entry point
├── index.css                        # Global styles, animations, scrollbar
├── theme/
│   └── tokens.ts                    # Design token system
├── types/
│   └── index.ts                     # TypeScript interfaces
├── data/
│   └── seed.ts                      # All seed data + templates
├── store/
│   └── useWorkshopStore.ts          # Zustand global state
└── components/
    ├── shared/
    │   └── Primitives.tsx           # GlassCard, Chip, MetricBlock, etc.
    ├── layout/                      # (extensible)
    ├── copilot/
    │   └── CopilotPanel.tsx         # AI Copilot side panel
    └── modules/
        ├── CommandCenter.tsx         # Workshop home / mission control
        ├── WorkshopModules.tsx       # Tabs 1-5, 7-9 (8 modules)
        └── ArchitectureStudio.tsx    # Tab 6 — premium canvas studio
```

## Workshop Modules

| # | Module | Purpose |
|---|--------|---------|
| 0 | Command Center | Mission control dashboard |
| 1 | Executive Context | Business driver alignment |
| 2 | Current-State Estate | Infrastructure footprint mapping |
| 3 | Pain & Constraints | Structured pain diagnosis |
| 4 | Maturity Assessment | 10-domain maturity radar |
| 5 | Future-State Vision | Target architecture posture |
| 6 | Architecture Studio | Drag-and-drop canvas (centerpiece) |
| 7 | Value & Tradeoffs | 3-path comparison lab |
| 8 | Transformation Roadmap | 10-track phased plan |
| 9 | Workshop Deliverables | Output generation |

## Architecture Studio Features

- Custom canvas engine with smooth zoom/pan
- 30+ categorized components (Sites, Network, Security, Cloud, Edge, Ops)
- Rich node metadata (name, role, status, criticality, owner, phase, notes)
- Node inspector panel + Notes/Assumptions panel
- Current-State vs Future-State view toggle
- 3 starter templates (Blank, Current-State, Target-State)
- Animated gradient edge connections
- Architecture layer filtering
- Minimap with viewport indicator
