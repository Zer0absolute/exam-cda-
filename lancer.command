#!/bin/zsh
cd "${0:A:h}"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20 ou plus récent est nécessaire pour lancer CDA Studio."
  read -r "reply?Appuie sur Entrée pour fermer."
  exit 1
fi
node server.mjs --open
