import * as fs from 'mz/fs';
import * as cp from 'mz/child_process';
import * as lodash from 'lodash';
import * as bluebird from 'bluebird';

const THUMBNAIL_DIR = `${__dirname}/../dist/thumbnails`;
const SPRITE_SIZE = 200;
const FILE_REGEX = /\.(jpg|jpeg|png)$/;
const MANIFEST_FILE = 'dist/sprites/manifest.json';

async function createSprites(images: string[], index: number): Promise<string> {
  const file = `dist/sprites/${index}.jpg`;
  const args = lodash(images)
    .map(f => `${THUMBNAIL_DIR}/${f}`)
    .concat('-append', file)
    .value();

  await cp.execFile('convert', args);
  return file;
}

async function writeSprites(chunkedImages: string[][]): Promise<void> {
  await bluebird.map(chunkedImages, createSprites, { concurrency: 10 });
}

async function writeManifest(chunkedImages: string[][]): Promise<void> {
  await fs.writeFile(MANIFEST_FILE, JSON.stringify({ chunkedImages }));
}

async function main(): Promise<void> {
  const files = await fs.readdir(THUMBNAIL_DIR);
  const chunkedImages = lodash(files)
    .filter(f => FILE_REGEX.test(f))
    .chunk(SPRITE_SIZE)
    .value();

  await Promise.all([writeSprites(chunkedImages), writeManifest(chunkedImages)]);
}

main().catch(err => {
  console.warn(err);
  process.exit(1);
});
