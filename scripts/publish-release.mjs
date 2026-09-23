#!/usr/bin/env node
/* Publish a ChalkTalk release: uploads the exe-ZIP to Supabase storage
 * and inserts the `releases` row the website + app updater read.
 *
 *   $env:SUPABASE_URL="https://xyzcompany.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="<service_role key — local only, never commit>"
 *   node scripts/publish-release.mjs --version 1.2.0 --notes "..." --zip .\ChalkTalk-1.2.0-win64.zip
 *
 * The zip must contain ONLY ChalkTalk.exe.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : '']);
    return acc;
  }, [])
);

if (args.help || !args.version || !args.zip) {
  console.log('Usage: node scripts/publish-release.mjs --version 1.2.0 --zip <path-to-zip> [--notes "..."]');
  process.exit(args.help ? 0 : 1);
}

const URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_KEY || '';
if (!URL || !KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars first (service key is secret).');
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const fail = async (label, res) => {
  console.error(`${label} failed: HTTP ${res.status} ${await res.text().catch(() => '')}`);
  process.exit(1);
};

const zipPath = args.zip;
const buf = fs.readFileSync(zipPath);
const sha = crypto.createHash('sha256').update(buf).digest('hex');
const name = `ChalkTalk-${args.version}-win64.zip`;

console.log(`Uploading ${name} (${(buf.length / 1048576).toFixed(1)} MB)…`);
let res = await fetch(`${URL}/storage/v1/object/releases/${name}`, {
  method: 'PUT', headers: { ...H, 'Content-Type': 'application/zip' }, body: buf
});
if (!res.ok && res.status !== 200) await fail('Upload', res);

const zipUrl = `${URL}/storage/v1/object/public/chalktalk/releases/${name}`;
console.log('Registering release…');
res = await fetch(`${URL}/rest/v1/releases`, {
  method: 'POST',
  headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  body: JSON.stringify({
    version: args.version, notes: args.notes || '',
    zip_url: zipUrl, sha256: sha, size_bytes: buf.length
  })
});
if (!res.ok) await fail('Insert', res);
console.log('Published:', await res.text());
console.log('SHA256:', sha);
