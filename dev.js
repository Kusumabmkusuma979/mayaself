import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

console.log('\x1b[35m%s\x1b[0m', '🌌 [MAYA] Starting full-stack development environment...');

// Spawn Express Backend
const serverProcess = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env }
});

serverProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.log('\x1b[35m[SERVER]\x1b[0m', line);
  });
});

serverProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.error('\x1b[31m[SERVER ERROR]\x1b[0m', line);
  });
});

// Spawn Vite Frontend
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env }
});

clientProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.log('\x1b[36m[CLIENT]\x1b[0m', line);
  });
});

clientProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.error('\x1b[33m[CLIENT WARN]\x1b[0m', line);
  });
});

// Handle termination cleanly
function shutdown() {
  console.log('\n\x1b[35m%s\x1b[0m', '🛑 [MAYA] Gracefully stopping services...');
  if (serverProcess) serverProcess.kill('SIGINT');
  if (clientProcess) clientProcess.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
