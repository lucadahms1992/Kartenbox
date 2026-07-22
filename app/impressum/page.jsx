export const metadata = {
  title: 'Impressum — Kartenbox',
};

const C = {
  bg: '#F1E7C6',
  surface: '#FBF3DC',
  ink: '#1C1A15',
  muted: '#8C7F5E',
  red: '#E4032E',
  blue: '#0056A4',
  border: '#DFC98D',
};

export default function ImpressumPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <a href="/" style={{ color: C.blue, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          ← Zurück zu Kartenbox
        </a>

        <h1 style={{ fontFamily: 'Bungee, sans-serif', fontSize: '26px', color: C.ink, marginTop: '20px', marginBottom: '24px' }}>
          Impressum
        </h1>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Angaben gemäß § 5 TMG / § 5 DDG</h2>
          <p style={p}>
            Luca Dahms<br />
            Hadergasse 31b<br />
            97421 Schweinfurt<br />
            Deutschland
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Kontakt</h2>
          <p style={p}>
            E-Mail: luca.dahms1992@gmail.com
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p style={p}>
            Luca Dahms (Anschrift wie oben)
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Hinweis zum Status dieses Angebots</h2>
          <p style={p}>
            Kartenbox wird derzeit als privates, nicht-gewerbliches Projekt von Luca Dahms betrieben
            und befindet sich in der Testphase. Es werden keine Waren oder Dienstleistungen gegen
            Entgelt angeboten. Sobald sich der Status ändert (z. B. durch Gründung eines Gewerbes),
            wird dieses Impressum entsprechend aktualisiert.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Haftung für Inhalte</h2>
          <p style={p}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Haftung für Links</h2>
          <p style={p}>
            Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
            keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={sectionTitle}>Streitschlichtung</h2>
          <p style={p}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" style={{ color: C.blue }} target="_blank" rel="noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Da Kartenbox aktuell rein privat und nicht-gewerblich betrieben wird, besteht keine
            Verpflichtung zur Teilnahme an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle.
          </p>
        </section>

        <a href="/datenschutz" style={{ color: C.blue, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          Zur Datenschutzerklärung →
        </a>
      </div>
    </div>
  );
}

const sectionTitle = {
  fontFamily: 'Bungee, sans-serif',
  fontSize: '14px',
  color: '#1C1A15',
  marginBottom: '8px',
  letterSpacing: '0.3px',
};

const p = {
  fontSize: '14px',
  lineHeight: '1.7',
  color: '#1C1A15',
};
