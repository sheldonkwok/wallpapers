import manifest from '../dist/sprites/manifest.json';

const { chunkedImages } = manifest;
const NUM_SPRITES = chunkedImages.length;
const parent = document.getElementById('gallery');

let loading = false;
let page = 1;
function appendNodes() {
  if (loading || page === NUM_SPRITES) return;
  loading = true;

  const numImages = chunkedImages[page].length;
  for (let i = 0; i < numImages; i++) {
    const div = document.createElement('div');
    const style = `background-image:url('/sprites/${page}.jpg'); background-position:-0px -${i * 108}px`;
    div.setAttribute('style', style);
    div.className = 'thumb';

    parent!.appendChild(div);
  }

  loading = false;
  page += 1;
}

window.addEventListener('scroll', _e => {
  const minWindowRange = document.body.clientHeight - 10;
  const currPosition = document.documentElement.scrollTop + window.innerHeight;

  if (currPosition >= minWindowRange) appendNodes();
});
