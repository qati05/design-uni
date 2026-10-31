#!/usr/bin/env bash
# Lädt die Fotos der Auto Speedy AG von autospeedy.ch für die lokale Vorschau.
# Die Bilder gehören der Auto Speedy AG. Sie bleiben ausserhalb des Repositorys
# (bilder-roh/ und site/bilder/ stehen in .gitignore) und werden erst nach
# Freigabe des Betriebs auf einer echten Website verwendet.
set -euo pipefail
ziel="$(cd "$(dirname "$0")/.." && pwd)/bilder-roh"
mkdir -p "$ziel"
while read -r name id; do
  [ -z "$name" ] && continue
  [ -f "$ziel/$name.jpg" ] || curl -sSfL -o "$ziel/$name.jpg" "https://static.wixstatic.com/media/$id/v1/fill/w_2000,h_2000,al_c,q_90,lg_1/$name.jpg" || echo "fehlt: $name"
done <<'LISTE'
lack-911 23d933_e63dae0920774df88111d84ffb406fe2~mv2.jpg
folie-ferrari 23d933_8d0cac5a197043849e1e6ab1b33c0481~mv2.jpg
dellen-haende 23d933_04227a35c51c47699de070c24220f09b~mv2.jpg
carr-2 23d933_92a05568ccb04a76bf552d0f1491efca~mv2.jpg
halle-vorne 23d933_2be29023e4c644b7a031c834b0e8d407~mv2.jpg
halle-himmel 23d933_553a2a3b7d444a45ad6a92f58d388c8f~mv2_d_4032_3024_s_4_2.jpg
spritz-dienst 23d933_e0b932c4767246e3b5f50ef68647e02d~mv2_d_3024_4032_s_4_2.jpg
carr-dienst 23d933_1a41a5e7ed704f34b2ef8b6c7c5d4cde~mv2_d_5184_3456_s_4_2.jpg
lack-a 23d933_0fbadc3c516045e2b348a79a76a85368~mv2.jpg
lack-b 23d933_a9aeaa0617bb43ac9a3fc44a7a6f5ac1~mv2.jpg
lack-c 23d933_15c5b63869444a96aacc63821021f1a8~mv2.jpg
lack-d 23d933_2f9f19250960428980a17b950f086d3b~mv2.jpg
lack-e 23d933_381cd5f7a98548d59a86f85a59eff5f8~mv2.jpg
lack-f 23d933_a45544cbcc0d4ff9a0367d9f8ffe4556~mv2.jpg
lack-g 23d933_63196707d5b64c218d394a79a85f99ab~mv2.jpg
lack-h 23d933_046be8a08b2c4b2fab76327c39cf713c~mv2.jpg
lack-i 23d933_a3dc4e7733d941fa8ccccf950e782acf~mv2.jpg
lack-j 23d933_eb7017fadc9f4966b608783e6e4d40bf~mv2.jpg
lack-k 23d933_bec16031ce1a4b7e923359d15f3bb88b~mv2.jpg
lack-l 23d933_0adc6ce013ef4fd9bee2edeff389ed2c~mv2.jpg
lack-m 23d933_6f967245e3fe4c5197a174f7c36c13ea~mv2.jpg
aufbereitung 23d933_dcddc922b7ff4dceb46bce4b7ea342bb~mv2.jpg
lack-n 23d933_8ff47220375e462c849575ac19ac5d99~mv2.jpg
felge-a 23d933_993e5e2f8afa4d42a47e1c25a393670c~mv2.jpeg
felge-b 23d933_57b05abdf3674036b084b976c3dd181c~mv2.jpeg
felge-c 23d933_e21da27037e44718a37a7d17563fb39f~mv2.jpeg
felge-d 23d933_30faf987792d4c1e9919c1834165e0cd~mv2.jpeg
folie-a 23d933_27e10184ab2849fa978eae7e28b60972~mv2.jpeg
folie-b 23d933_e7cfc6736e8043d9a1b6b2f583670837~mv2.jpeg
folie-c 23d933_9eb9fecd33794f9484cf91a7232508b4~mv2.jpeg
folie-d 23d933_921cf01cab3745929a0c7540a9ea56aa~mv2.jpeg
folie-e 23d933_6f8125b29e76404daa7c39eae882f3b2~mv2.jpeg
occasion 23d933_f9a91dbf6802449ba16e7378c4f011a0~mv2.jpeg
LISTE
echo "Bilder in $ziel"
