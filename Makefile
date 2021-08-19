develop:
	npx webpack serve

install:
	npm install

publish:
	npm publish --dry-run

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

.PHONY: test
