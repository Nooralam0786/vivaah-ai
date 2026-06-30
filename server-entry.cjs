/**
 * cPanel "Setup Node.js App" (Passenger) startup file.
 * Passenger requires a plain .js entry it can `node <file>` directly —
 * it can't run server.ts. This registers tsx's require hook, then loads
 * the real TypeScript server.
 */
require('tsx/cjs');
require('./server.ts');
