import * as fs from 'mz/fs';
import * as cp from 'mz/child_process';
import lodash from 'lodash';
import bluebird from 'bluebird';

const THUMBNAIL_DIR = `${__dirname}/../dist/thumbnails`;
const SPRITE_SIZE = 200;
const FILE_REGEX = /\.(jpg|jpeg|png)$/;
const SPRITE_DIR = 'dist/sprites';
const MANIFEST_FILE = `${SPRITE_DIR}/manifest.json`;

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

  await fs.mkdir(SPRITE_DIR);
  await Promise.all([writeSprites(chunkedImages), writeManifest(chunkedImages)]);
}

main().catch(err => {
  console.warn(err);
  process.exit(1);
});
