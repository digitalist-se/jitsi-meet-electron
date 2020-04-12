#!/usr/bin/env bash

# @file makeicons.sh
# @author Colin Campbell <colin.campbell@digitalistgroup.com>
# App specific. runs on OSX only.
# Generates icon sets and branding for OSX, linux and windows.
# Supply a 1024x1024 PNG file as input. 


if [[ -z "$*" ]] || [[ "${*##*.}" != "png" ]]; then
     echo "Input file invalid"
else
    filename="${1%.*}"
    mkdir "$filename".iconset
    for i in 16 24 32 48 64 96 128 256 512 ; do
        n=$(( i * 2 ))
        sips -z $i $i "$1" --out "$filename".iconset/icon_${i}x${i}.png
        sips -z $i $i "$1" --out resources/icons/icon_${i}x${i}.png
        sips -z $n $n "$1" --out "$filename".iconset/icon_${i}x${i}@2x.png
        [[ $n -eq 512 ]] && \
        sips -z $n $n "$1" --out "$filename".iconset/icon_${n}x${n}.png
        (( i++ ))
    done
    cp "$1" "$filename".iconset/icon_512x512@2x.png
    iconutil -c icns --output resources/icon.icns "$filename".iconset
    rm -r "$filename".iconset
    # npm install -g png-to-ico
    png-to-ico "$1" > resources/icon.ico
fi