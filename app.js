/**
 * cPanel "Setup Node.js App" (Passenger) entry point.
 * Passenger requires a plain .js startup file — it can't run `tsx server.ts` directly.
 * This registers tsx's require hook, then loads the real server.ts unchanged.
 */
require('tsx/cjs');
require('./server.ts');
