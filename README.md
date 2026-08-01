<div align="center">
  <img src="src/assets/icons/icon-512x512.png" alt="GitRepos Logo" width="120" />
  <h1>GitRepos</h1>
  <p>A High-utility developer curation engine for GitHub trending repositories.</p>
</div>

<p align="center">
  <a href="https://github.com/Hyraze/gitrepos/actions/workflows/e2e.yml">
    <img src="https://github.com/Hyraze/gitrepos/actions/workflows/e2e.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://gitrepos.vercel.app/">
    <img src="https://img.shields.io/badge/Demo-Live-f472b6?style=flat-square&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/Hyraze/gitrepos/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--2.0-blue.svg?style=flat-square" alt="License" />
  </a>
</p>

## Overview

**GitRepos** surfaces the most popular repositories trending on GitHub across JavaScript, TypeScript, Python, Go, and Shell. Tracked dynamically across daily, weekly, and monthly periods.

Rebuilt from the ground up with **Angular 19** and **Signals**, featuring responsive mobile layouts and lightning-fast client-side filtering.

### Key Features

- **Trending Languages Engine**: Daily, weekly, and monthly tracking of top developer repositories.
- **In-App README Explorer**: Parse and render raw GitHub Markdown READMEs directly within an immersive modal, powered by `marked` and `dompurify`.
- **Historical Tracking**: Client-side storage diffing automatically tracks what you've seen and badges **"NEW"** arrivals.
- **Fast Filtering**: Real-time client-side keyword filtering powered entirely by Angular computed Signals.

## Tech Stack

- **Framework**: Angular 19 (Standalone Components, Signals, Application Builder)
- **UI & Styling**: Custom SCSS, Angular Material 19
- **Data Source**: Powered by the [Hyraze/trending-collection](https://github.com/Hyraze/trending-collection) JSON API
- **Deployment**: Vercel (Node.js 24.x)

## Local Development

Ensure you have **Node.js 24.x** installed to match the deployment environment.

```bash
# Clone the repository
git clone https://github.com/Hyraze/gitrepos.git
cd gitrepos

# Install dependencies
npm ci

# Start the development server
npm run start
```
The app will be available at `http://localhost:4200/`.

## Other Projects

- [**Collective AI Tools**](https://collectiveai.tools/) - Directory of AI utilities
- [**Context Kit**](https://ck.collectiveai.tools/) - Developer context and state tools
- [**Trending Collection API**](https://github.com/Hyraze/trending-collection) - The data backend for GitRepos

## Contributing

Contributions, issues, and feature requests are highly welcome!  
Feel free to check the [issues page](https://github.com/Hyraze/gitrepos/issues).

## License

Distributed under the **GNU General Public License v2.0**.  
Copyright (c) Hanishraj B Rao.
