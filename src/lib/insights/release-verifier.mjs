import { spawn } from 'node:child_process';

export const publicCopyBanPattern = /AdSense review window|애드센스|승인 전 전략|수익화|수익형|검색 신호|운영 초점|밀어야|수익 측정|Issue\s*→\s*Information\s*→\s*Calculator/i;

export const releaseChecks = [
  { name: 'insight tests', command: 'npm', args: ['run', 'insights:test'] },
  { name: 'growth homepage checks', command: 'node', args: ['scripts/check-growth-homepage.mjs'] },
  { name: 'static build', command: 'npm', args: ['run', 'build'] },
  { name: 'calculator route coverage', command: 'npm', args: ['run', 'insights:verify:calculator-routes'] },
  { name: 'sitemap coverage', command: 'npm', args: ['run', 'insights:verify:sitemap'] },
  {
    name: 'public operation-copy scan',
    command: 'rg',
    args: [
      '-n',
      publicCopyBanPattern.source,
      'dist',
      'src/pages',
      'src/components',
      'src/data',
    ],
    expectExitCode: 1,
  },
  { name: 'analytics privacy scan', command: 'npm', args: ['run', 'insights:scan:analytics-privacy'] },
  { name: 'secret leak scan', command: 'npm', args: ['run', 'insights:scan:secrets'] },
];

export function resolveCommand(command, platform = process.platform) {
  return platform === 'win32' && command === 'npm' ? 'cmd.exe' : command;
}

export function resolveArgs(command, args, platform = process.platform) {
  return platform === 'win32' && command === 'npm' ? ['/d', '/s', '/c', 'npm', ...args] : args;
}

export function shellForCommand() {
  return false;
}

function runCommand(check) {
  return new Promise((resolve) => {
    const child = spawn(resolveCommand(check.command), resolveArgs(check.command, check.args), {
      shell: shellForCommand(check.command),
    });
    let output = '';

    child.stdout.on('data', (chunk) => {
      output += chunk;
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
      process.stderr.write(chunk);
    });
    child.on('close', (code) => {
      resolve({
        ok: code === (check.expectExitCode ?? 0),
        output,
        code,
      });
    });
  });
}

export async function runReleaseChecks({ runner = runCommand, logger = console.log } = {}) {
  for (const check of releaseChecks) {
    logger(`\n== ${check.name} ==`);
    const result = await runner(check);

    if (!result.ok) {
      return {
        ok: false,
        failedCheck: check,
        result,
      };
    }
  }

  return { ok: true };
}
