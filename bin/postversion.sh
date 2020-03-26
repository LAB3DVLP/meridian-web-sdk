#!/usr/bin/env bash
set -eu

git push
git push --tags
if [[ -z "${BETA:-}" ]]; then
  npm publish --access=public
else
  npm publish --access=public --tag "$BETA"
fi
