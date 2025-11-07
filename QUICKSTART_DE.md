# Schnellstart-Anleitung - Chalet Familial

## 🎯 Schnellstart

### Für sofortige Nutzung (Lokaler Modus)

Die Anwendung funktioniert sofort im localStorage-Modus. Keine Konfiguration erforderlich!

```bash
npm install
npm run dev
```

Besuchen Sie `http://localhost:5173` und erstellen Sie Ihr erstes Administratorkonto.

**Hinweis:** Im lokalen Modus werden die Daten nur in Ihrem Browser gespeichert.

---

### Für Deployment mit Datenbank (Produktionsmodus)

Um die Anwendung mit Ihrer Familie zu teilen und Daten zu synchronisieren:

#### 1. Auf Vercel deployen

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mttwln/chalet-familial)

Oder manuell:
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf "New Project" und importieren Sie dieses Repository
3. **WICHTIG:** Fügen Sie die Datenbank hinzu, bevor Sie deployen

#### 2. Vercel Postgres hinzufügen

In den Projekteinstellungen auf Vercel:
1. Gehen Sie zu "Storage" → "Create Database"
2. Wählen Sie "Postgres"
3. Wählen Sie einen Namen (z.B. `chalet-db`)
4. Wählen Sie eine Region in Ihrer Nähe
5. Klicken Sie auf "Create"

#### 3. JWT_SECRET hinzufügen

1. Gehen Sie zu "Settings" → "Environment Variables"
2. Fügen Sie hinzu:
   - **Name**: `JWT_SECRET`
   - **Value**: Eine zufällige Zeichenkette mit 32+ Zeichen
   - Generieren Sie mit: `openssl rand -base64 32`

#### 4. Deployen

Klicken Sie auf "Deploy" - das war's! 🎉

Die Datenbank wird beim ersten Start automatisch initialisiert.

---

## 📱 Nutzung

### Erstes Konto

Der erste Benutzer, der sich registriert, wird automatisch **Administrator**.

**Standard-Anmeldedaten im lokalen Modus:**
- E-Mail: `matthieu.weinlein@gmx.net`
- Passwort: `Admin2024!`

### Mitglieder einladen

Sobald Sie als Admin angemeldet sind:
1. Ein Einladungslink erscheint auf der Login-Seite
2. Kopieren Sie den Link und teilen Sie ihn mit Ihrer Familie
3. Sie können sich direkt als Benutzer registrieren

### Rollen

- **Admin**: Vollständige Verwaltung (Mitglieder, Reservierungen, Finanzen, Verbrauch)
- **User**: Reservierungen erstellen, Daten einsehen

---

## 🔧 Lokale Entwicklung mit Datenbank

Um lokal mit der echten Vercel-Datenbank zu testen:

```bash
# Vercel CLI installieren
npm install -g vercel

# Projekt verknüpfen
vercel link

# Umgebungsvariablen herunterladen
vercel env pull

# Im Entwicklungsmodus mit API starten
vercel dev
```

Ihre Anwendung läuft auf `http://localhost:3000` mit allen funktionalen API-Routen.

---

## ❓ Häufig gestellte Fragen

### Muss ich die Datenbank verwenden?

**Nein**, das ist optional:
- **Ohne Datenbank**: Funktioniert sofort, Daten lokal im Browser
- **Mit Datenbank**: Synchronisierte Daten, Multi-Device-Login, produktionsreif

### Werden meine localStorage-Daten migriert?

Nicht automatisch. Sie müssen Konten und Reservierungen bei der ersten Nutzung mit der Datenbank neu erstellen.

### Kann ich den Modus wechseln?

Ja! Die Anwendung erkennt automatisch den verfügbaren Modus:
- Wenn API-Routen funktionieren → Datenbankmodus
- Andernfalls → localStorage-Modus

### Ist es sicher?

**Datenbankmodus**:
- ✅ Passwörter mit bcrypt gehasht
- ✅ JWT-Authentifizierung
- ✅ Server-seitige Validierung
- ✅ CSRF-Schutz

**localStorage-Modus**:
- ⚠️  Daten im Klartext im Browser
- ⚠️  Keine Server-Validierung
- ⚠️  Nur für Tests/Entwicklung

---

## 📚 Vollständige Dokumentation

- [Detaillierte Deployment-Anleitung](./DEPLOYMENT_DATABASE.md)
- [Datenbankschema](./lib/db/schema.sql)
- [API-Dokumentation](./DEPLOYMENT_DATABASE.md#-urls-des-api)

## 🆘 Support

Brauchen Sie Hilfe? Konsultieren Sie:
1. [DEPLOYMENT_DATABASE.md](./DEPLOYMENT_DATABASE.md) für das Deployment
2. Die Vercel-Logs bei Fehlern
3. Öffnen Sie ein Issue auf GitHub

---

## 🇩🇪 Deutsche Version | 🇫🇷 [Version française](./QUICKSTART.md)
