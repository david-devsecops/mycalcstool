import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function readJsonlRecords(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function appendJsonlRecord(filePath, record) {
  await mkdir(dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
}

export async function upsertJsonlRecord(filePath, record, key = 'id') {
  const records = await readJsonlRecords(filePath);
  const index = records.findIndex((item) => item[key] === record[key]);

  if (index === -1) {
    records.push(record);
  } else {
    records[index] = record;
  }

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, records.map((item) => JSON.stringify(item)).join('\n') + '\n', 'utf8');
}

