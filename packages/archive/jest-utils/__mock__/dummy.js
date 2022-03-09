import fs from 'fs';

export function read() {
  return fs.readFileSync(__filename, 'utf-8');
}
