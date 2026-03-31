#!/bin/bash

# Obtenemos la ruta absoluta de la carpeta donde está este script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Lanzamos Kitty con la sesión de host
kitty --session "$DIR/kitty.host.session" &

# Cerramos la terminal base
exit
