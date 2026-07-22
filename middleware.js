import { NextResponse } from 'next/server';

// Sperrt die komplette Seite hinter einem einfachen, gemeinsamen Benutzername/Passwort,
// bevor überhaupt irgendein Inhalt (auch nicht die Login-Seite) geladen wird. Zum Entfernen
// dieses Schutzes (z. B. sobald Impressum & Datenschutzerklärung stehen): diese Datei löschen
// oder in `config.matcher` unten einfach ein leeres Array eintragen.
export function middleware(req) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');
    if (user === process.env.SITE_USER && pwd === process.env.SITE_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Zugriff gesperrt', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Kartenbox - not public yet"' },
  });
}

export const config = {
  // Greift auf alle Seiten zu, außer den intern von Next.js benötigten Assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
