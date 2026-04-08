## Dum-E Robotics Pitch Website

Premium single-page startup website built for pitch/application credibility.

### Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Custom premium visual system and motion

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

### Content Editing Guide
- Main content sections: `src/app/page.tsx`
- Visual styling and effects: `src/app/globals.css`
- Metadata and fonts: `src/app/layout.tsx`
- Logo asset: `public/dum-e-logo.svg`

### Optional 3D Robot Phase
If you share an STL file, add it as a hero visual by converting it to a web-friendly `.glb` model and integrating a lightweight viewer with mobile fallback.

### Vercel Deployment

1. Push this project to a Git provider (GitHub/GitLab/Bitbucket).
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset is auto-detected as Next.js.
4. Click deploy.

No additional environment variables are required for the current version.

### Quality Checks

```bash
npm run lint
npm run build
```

### Founder Contact CTA
The primary CTA is wired to:
- `mailto:pratye.aggarwal@gmail.com`
