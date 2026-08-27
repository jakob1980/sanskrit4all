- [x] Analizzare i requisiti e verificare la struttura del progetto
- [x] Inizializzare Prisma con SQLite come datasource provider
- [x] Verificare che i file di configurazione siano stati creati correttamente
- [x] Testare l'inizializzazione eseguendo un comando di verifica

---

## Come verificare

```bash
npm install
npx prisma generate
npx prisma migrate status          # atteso: "Database schema is up to date!"
node scripts/verify-prisma.js      # atteso: "✅ PRISMA VERIFICATION PASSED"
```

Nota: la migrazione iniziale (`prisma/migrations/20251031140213_init`) è stata marcata come
applicata ("baselined") sul database esistente `database/app.db`, che già conteneva le tabelle
create dalla precedente persistenza JSON/better-sqlite3. Non è stato perso alcun dato.
