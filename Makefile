init:
	mkdir -p dist/thumbnails dist/sprites
	ls -a ~/Dropbox/Wallpapers/*.{jpg,jpeg,png} | xargs -n1 basename | xargs -n1 -I {} convert -strip -resize '192x108!' ~/Dropbox/Wallpapers/{} dist/thumbnails/{}

build:
	npm run build

sprite sprites:
	node lib/sprite.js

bundle:
	rm -rf dist/web
	mkdir dist/web
	cp -r dist/sprites dist/web
	npm run pkg
