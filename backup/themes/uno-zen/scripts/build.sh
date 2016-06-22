#!/bin/bash

# This script creates an archive of the theme files to be used with Ghost(Pro).
# Note: Be sure to first run 'Gulp build' before executing this script, to ensure everything is compiled and minified for production.

FILES="*.hbs *.md *.html partials/ assets/js/uno-zen.js assets/css/uno-zen.css assets/fonts/ assets/img/"
OUTPUT="uno-zen"

if [ $# -eq 0 ]; then
    printf "\nNo argument supplied, using default as archive name.\n\n"
else
	printf "\nArgument supplied, using that as archive name.\n\n"
	OUTPUT=$1
fi

printf "Using $OUTPUT as archive name.\n\n"

if [ -f "$OUTPUT.zip" ]; then
    printf "Output file $OUTPUT.zip already exists, removing old version.\n\n"
    rm $OUTPUT.zip
    printf "Old version removed.\n\n"
fi

printf "Creating archive.\n\n"

zip -r $OUTPUT $FILES

printf "\nDone!\n\n"
