import './globals.css';

export const metadata = {
  title: 'Kartenbox — Fußball-Sammelkarten tracken',
  description: 'Sammlung tracken, entdecken und Karten verwalten.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
