# Kartenbox

Klick-Prototyp für die Fußball-Sammelkarten-App: Sammlung tracken, andere Sammlungen durchsuchen, Karten hinzufügen.

Gebaut mit Next.js 14 (App Router) + Tailwind CSS.

## Lokal starten (optional)

```bash
npm install
npm run dev
```

Dann [http://localhost:3000](http://localhost:3000) öffnen.

## Kostenlos über GitHub + Vercel hosten

### 1. Auf GitHub hochladen

Falls du noch kein Repo hast:

```bash
cd kartenbox
git init
git add .
git commit -m "Initial commit: Kartenbox Prototyp"
```

Dann auf [github.com/new](https://github.com/new) ein neues (leeres) Repository anlegen, z. B. `kartenbox`. Danach:

```bash
git remote add origin https://github.com/DEIN-USERNAME/kartenbox.git
git branch -M main
git push -u origin main
```

### 2. Bei Vercel importieren

1. Auf [vercel.com](https://vercel.com) mit deinem GitHub-Account anmelden (kostenlos, "Hobby"-Plan reicht völlig aus).
2. **"Add New..." → "Project"** klicken.
3. Das `kartenbox`-Repository auswählen und importieren.
4. Vercel erkennt Next.js automatisch — keine Einstellungen nötig. Einfach **"Deploy"** klicken.
5. Nach ca. 1 Minute bekommst du eine Live-URL wie `kartenbox-deinname.vercel.app`.

Jeder weitere `git push` auf `main` deployt automatisch eine neue Version.

### Eigene Domain (optional)

Unter Vercel-Projekt → **Settings → Domains** kannst du kostenlos eine eigene Domain verbinden (die Domain selbst kostet, das Hosting/Deployment bei Vercel bleibt im Hobby-Plan gratis).

## Projektstruktur

```
app/
  layout.jsx      # Grundgerüst der Seite
  page.jsx         # Die komplette Kartenbox-App (Sammlung, Entdecken, Hinzufügen)
  globals.css      # Tailwind-Basisstile
```

Der gesamte Funktionsumfang (Katalog, Sets, Sammlung, Filter, Modal) liegt aktuell in `app/page.jsx` mit In-Memory-State — es ist noch keine echte Datenbank angebunden. Das ist der nächste sinnvolle Schritt, sobald der Prototyp final abgestimmt ist.
