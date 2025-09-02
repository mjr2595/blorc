# Blorc

[![Netlify Status](https://api.netlify.com/api/v1/badges/f9ddbc93-f8f4-407c-b411-644254ca103a/deploy-status)](https://app.netlify.com/projects/blorc/deploys)

A list of the latest blog posts from members of the [Torc Community](https://torc.community/).

## Want your blog added?

If you're a member of the Torc Community and want your blog to be included in this list, please submit a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) with the following:

1. Add your profile pic to `public/images/profile-pics/`. If not included, a default pic will be used.

2. In `src/data/bloggers.json`, add your blog information in the following format:

```json
{
  "name": "Chip",
  "profilePic": "/images/profile-pics/placeholder.png",
  "site": "https://your-blog.com/",
  "rss": "https://your-blog.com/rss.xml",
  "social": {
    "linkedin": "https://www.linkedin.com",
    "github": "https://github.com",
    "bluesky": "https://bsky.app",
    "x": "https://x.com",
    "youtube": "https://youtube.com"
  }
}
```

> [!NOTE]  
> Social links are optional. Leave out any you don't use. Supported links are:
>
> - LinkedIn
> - GitHub
> - Bluesky
> - X (aka Twitter)
> - YouTube

> [!TIP]  
> For more detailed info on submitting a pull request, see [this blog post](https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/).

## Want to help with the site?

First of all, thanks! Bug reports, feature requests, and pull requests are all welcome.

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (Astro requires at least Node 18).
- [pnpm](https://pnpm.io/) **v10.15.0** (as defined in `package.json`).
- A GitHub account and a fork of this repository.

### Getting Started

1. Fork the repository

   - Go to the blorc repository and click Fork in the top right corner. This creates a copy under your GitHub account that you can push changes to.

2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/blorc.git
   cd blorc
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

   > Note: The `dev` script disables TLS certificate validation (`NODE_TLS_REJECT_UNAUTHORIZED=0`).
   > If you know how I can remove this while not breaking anything, please let me know lol

5. Build the project:

   ```bash
   pnpm build
   ```

6. Preview the production build:

   ```bash
   pnpm preview
   ```

### Contribution Workflow

- Create a feature branch:

  ```bash
  git checkout -b feature/my-cool-thing
  ```

- Make your changes and commit them with clear messages.
- Push to your fork and open a Pull Request against `main`.

### Code Style

- This project uses **ESM** (`"type": "module"`).
- Follow existing formatting conventions (run a linter/formatter if available). Prettier is recommended and easiest.
- Keep PRs focused: one logical change per PR.

### Reporting Issues

If you find a bug or have a feature request:

1. Search existing issues to avoid duplicates.
2. Open a new issue with:

   - A clear title
   - Steps to reproduce (if it’s a bug)
   - Expected vs actual behavior
   - Relevant environment info
