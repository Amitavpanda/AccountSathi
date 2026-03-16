/*
  Node.js v25 removed the built-in SlowBuffer export, but some deps (like jwa/jsonwebtoken)
  still attempt to access it (e.g. buffer-equal-constant-time). To avoid crashing in Node 25,
  we patch the built-in `buffer` module early at startup.

  This file is imported first in `src/app.ts` so that the patch runs before any dependent
  modules (jsonwebtoken, jwa, etc.) are loaded.
*/

import { Buffer } from 'buffer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const bufferModule = require('buffer');

if (!('SlowBuffer' in bufferModule) || bufferModule.SlowBuffer == null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bufferModule as any).SlowBuffer = Buffer;
  // also ensure global access if some libs read from global scope
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).SlowBuffer = Buffer;
}
