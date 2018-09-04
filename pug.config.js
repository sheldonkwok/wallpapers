const manifest = require('./dist/sprites/manifest.json');

module.exports = { 
  locals: { page1Images: manifest.chunkedImages[0] },
};
