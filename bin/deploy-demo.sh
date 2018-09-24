#!/usr/bin/env bash
set -eu

bold=$'\e[1m'
cyan=$'\e[36m'
clear=$'\e[0m'

Heading() {
  echo "${clear}"
  echo "${bold}${cyan}$@${clear}"
  echo "${clear}"
}

# `npm run` provides this environment variable so we don't have to parse the
# package.json just to get the version number
version="${VERSION:-$npm_package_version}"
name="${npm_package_name}"

Heading "--- Deploying $name demos v$version ---"

Heading "* Cleaning old build..."
rm -rf dist

Heading "* Building SDK JS bundle..."
npm run -s build
cp -r demo/* dist/

Heading "* Copying build files..."
npx gh-pages --dist dist

Heading "* Cleaning up build files..."
rm -rf dist

Heading "==> https://arubanetworks.github.io/meridian-web-sdk"
