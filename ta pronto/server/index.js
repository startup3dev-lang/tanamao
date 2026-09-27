import { createDatabase } from './db.js';
import { createApp } from './app.js';

const db = createDatabase();
const app = createApp(db);
const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => console.log(`API TA PRONTO na porta ${port}`));

for (const signal of ['SIGINT','SIGTERM']) {
  process.on(signal, () => server.close(() => db.close().finally(() => process.exit(0))));
}
