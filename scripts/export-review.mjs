import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const options = { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 };
const baseline = '57e361daebfecc5c78d553f393e19bf03f1c038d';
let patch = execFileSync('git', ['diff', '--binary', baseline, '--'], options);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], options).split('\0').filter(Boolean);
for (const file of untracked) {
  try { patch += execFileSync('git', ['diff', '--no-index', '--binary', '--', '/dev/null', file], options); }
  catch (error) { if (error.status !== 1) throw error; patch += error.stdout; }
}
await fs.mkdir('review-artifacts', { recursive: true });
await fs.writeFile('review-artifacts/complete.diff', patch);
await fs.writeFile('review-artifacts/changed-files.txt', execFileSync('git', ['status', '--short'], options));
console.log(`Saved complete tracked and new-file patch (${Buffer.byteLength(patch)} bytes). No staging, commit or push performed.`);