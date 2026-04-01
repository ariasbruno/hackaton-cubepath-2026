#!/bin/bash

# Obtenemos la ruta absoluta de la raíz del proyecto
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PROJECT_ROOT="$(cd "$DIR/../.." && pwd)"

# Lanzamos Kitty con la sesión de host
kitty --session "$DIR/kitty.host.session" &

# Cerramos la terminal base
exit
