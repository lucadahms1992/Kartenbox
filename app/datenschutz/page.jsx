export const metadata = {
  title: 'Datenschutzerklärung — Kartenbox',
};

const C = {
  bg: '#F1E7C6',
  ink: '#1C1A15',
  muted: '#8C7F5E',
  blue: '#0056A4',
};

export default function DatenschutzPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <a href="/" style={{ color: C.blue, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          ← Zurück zu Kartenbox
        </a>

        <h1 style={{ fontFamily: 'Bungee, sans-serif', fontSize: '26px', color: C.ink, marginTop: '20px', marginBottom: '8px' }}>
          Datenschutzerklärung
        </h1>
        <p style={{ ...p, color: C.muted, marginBottom: '28px' }}>Stand: Juli 2026</p>

        <section style={sec}>
          <h2 style={h2}>1. Verantwortlicher</h2>
          <p style={p}>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
            Luca Dahms, Hadergasse 31b, 97421 Schweinfurt, Deutschland<br />
            E-Mail: luca.dahms1992@gmail.com
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>2. Allgemeines zur Datenverarbeitung</h2>
          <p style={p}>
            Kartenbox ist eine Anwendung zum Verwalten von Sammelkarten-Sammlungen. Um die
            Kernfunktionen (Sammlung anlegen, Karten hinzufügen, Profil führen) nutzen zu können,
            ist ein Nutzerkonto erforderlich. Die dabei verarbeiteten personenbezogenen Daten sind
            im Folgenden aufgeführt.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>3. Registrierung und Nutzerkonto</h2>
          <p style={p}>
            Bei der Registrierung erheben wir deine E-Mail-Adresse und ein von dir gewähltes
            Passwort. Das Passwort wird nicht im Klartext gespeichert, sondern ausschließlich in
            gehashter Form. Die Verwaltung von Konten (Registrierung, Login, Passwort-Zurücksetzen,
            Sitzungsverwaltung) erfolgt über den Dienst <strong>Supabase</strong> (Supabase Inc.,
            970 Toa Payoh North #07-04, Singapur, mit Infrastruktur-Partnern in der EU sowie den
            USA). Für die Übermittlung von Bestätigungs-E-Mails nutzt Supabase einen
            E-Mail-Versanddienst.
          </p>
          <p style={p}>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrags bzw.
            vorvertragliche Maßnahmen, da die Kontoerstellung Voraussetzung für die Nutzung der
            App ist).
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>4. Profildaten</h2>
          <p style={p}>
            Freiwillig kannst du in deinem Profil weitere Angaben hinterlegen: Vorname, Nachname,
            Hobbyname (Anzeigename), Stadt, Lieblingsverein und eine kurze Biografie. Du
            entscheidest selbst über die Sichtbarkeit dieser Angaben (öffentlich oder privat) über
            die entsprechenden Schalter im Profilbereich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            und, soweit du freiwillig zusätzliche Angaben machst, lit. a DSGVO (Einwilligung).
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>5. Sammlungsdaten</h2>
          <p style={p}>
            Zu jeder Karte, die du deiner Sammlung hinzufügst, speichern wir die Karteninformation
            selbst sowie die von dir eingetragenen Angaben wie Zustand, Ankaufspreis, gewünschter
            Verkaufspreis, Seriennummer und Sichtbarkeit. Diese Daten sind für die Kernfunktion der
            App erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>6. Hochgeladene Fotos</h2>
          <p style={p}>
            Wenn du Fotos deiner physischen Karten (Vorder-/Rückseite) hochlädst, werden diese im
            Storage-Dienst von Supabase gespeichert und über eine öffentlich abrufbare URL
            eingebunden, sofern die zugehörige Karte auf "öffentlich sichtbar" gestellt ist. Lade
            bitte nur Fotos hoch, die ausschließlich die Karte selbst zeigen. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>7. Hosting</h2>
          <p style={p}>
            Diese Website wird bei <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut,
            CA 91789, USA) gehostet. Vercel verarbeitet in diesem Zusammenhang automatisch
            technische Informationen wie IP-Adresse, Datum und Uhrzeit des Zugriffs sowie
            Browser-/Geräteinformationen (Server-Logfiles), um die Website zuverlässig
            auszuliefern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            einer sicheren und funktionsfähigen Bereitstellung der Website). Bei der Übermittlung
            von Daten in die USA stützt sich Vercel auf Standardvertragsklauseln der EU-Kommission.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>8. Cookies und lokale Speicherung</h2>
          <p style={p}>
            Zur Aufrechterhaltung deiner Anmeldung setzt Supabase Auth ein technisch notwendiges
            Sitzungs-Token, das im lokalen Speicher (Local Storage) deines Browsers abgelegt wird.
            Dieses Token ist erforderlich, damit du eingeloggt bleibst, und dient keinem
            Tracking- oder Analysezweck. Kartenbox selbst setzt aktuell keine Analyse-, Marketing-
            oder Tracking-Cookies und bindet keine Werbedienste ein.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>9. Empfänger und Auftragsverarbeiter</h2>
          <p style={p}>
            Zur Bereitstellung der App setzen wir folgende Auftragsverarbeiter ein, mit denen
            jeweils ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO besteht bzw. deren
            Standardverträge dies vorsehen:
          </p>
          <ul style={ul}>
            <li>Supabase Inc. — Datenbank, Authentifizierung, Datei-Speicher</li>
            <li>Vercel Inc. — Hosting und Auslieferung der Website</li>
          </ul>
          <p style={p}>Eine darüberhinausgehende Weitergabe an Dritte findet nicht statt.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>10. Speicherdauer</h2>
          <p style={p}>
            Wir speichern deine Daten, solange dein Nutzerkonto besteht. Nach Löschung deines
            Kontos werden deine personenbezogenen Daten gelöscht, soweit keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen. Möchtest du dein Konto und deine Daten löschen
            lassen, wende dich bitte an die oben genannte E-Mail-Adresse.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>11. Deine Rechte</h2>
          <p style={p}>Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
          <ul style={ul}>
            <li>Auskunft über deine gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>
          <p style={p}>
            Die für Schweinfurt zuständige Aufsichtsbehörde ist das Bayerische Landesamt für
            Datenschutzaufsicht (BayLDA).
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>12. Datensicherheit</h2>
          <p style={p}>
            Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten gegen
            zufällige oder vorsätzliche Manipulation, Verlust, Zerstörung oder unberechtigten
            Zugriff zu schützen, unter anderem durch verschlüsselte Übertragung (SSL/TLS) und
            zeilenbasierte Zugriffsbeschränkungen (Row Level Security) in der Datenbank, sodass
            grundsätzlich nur du auf deine nicht-öffentlichen Daten zugreifen kannst.
          </p>
        </section>

        <section style={sec}>
          <h2 style={h2}>13. Änderungen dieser Datenschutzerklärung</h2>
          <p style={p}>
            Wir passen diese Datenschutzerklärung an, sobald sich der Funktionsumfang von
            Kartenbox oder die zugrunde liegende Rechtslage ändert. Es gilt jeweils die zuletzt
            veröffentlichte Fassung.
          </p>
        </section>

        <a href="/impressum" style={{ color: C.blue, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          ← Zum Impressum
        </a>
      </div>
    </div>
  );
}

const sec = { marginBottom: '26px' };
const h2 = { fontFamily: 'Bungee, sans-serif', fontSize: '14px', color: '#1C1A15', marginBottom: '8px', letterSpacing: '0.3px' };
const p = { fontSize: '14px', lineHeight: '1.7', color: '#1C1A15', marginBottom: '8px' };
const ul = { fontSize: '14px', lineHeight: '1.8', color: '#1C1A15', paddingLeft: '20px', marginBottom: '8px' };
