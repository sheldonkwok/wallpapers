import manifest from '../dist/sprites/manifest.json';

const { chunkedImages } = manifest;
const NUM_SPRITES = chunkedImages.length;

let loading = false;
let page = 1;
function appendNodes() {
  if (loading || page === NUM_SPRITES) return;
  loading = true;

  const parent = document.getElementById('gallery');
  if (!parent) throw new Error('Could not find parent');

  for (let i = 0; i < chunkedImages[page].length; i++) {
    const div = document.createElement('div');
    div.className = 'thumb';

    const style = `background-image:url('/sprites/${page}.jpg'); background-position:-0px -${i * 108}px`;
    div.setAttribute('style', style);

    parent.appendChild(div);
  }

  loading = false;
  page += 1;
}

window.addEventListener('scroll', _e => {
  const minWindowRange = document.body.clientHeight - 10;
  const currPosition = document.documentElement.scrollTop + window.innerHeight;

  if (currPosition >= minWindowRange) appendNodes();
});
