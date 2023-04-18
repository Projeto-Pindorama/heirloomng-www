#!/bin/sh
# man2html - Generate HTML files from manual pages inside man[1-8][,b,m]/ directories.
# Very simple hack in POSIX sh, do not reutilize so often.

for manual in man*/*; do
	_name="${manual#*/}"; name="${_name%%.*}"; unset _name
	description="$(awk -F' - ' '/id="NAME"/{ getline; print $2; }' "$manual")"
	printf 'Writing %s to %s ...\n' "$name" "${manual%/*}.html" 1>&2 
	printf '<li><a href="%s">%s</a> -  %s</li>\n' \
	       	"$manual" "$name" "$description" >> "${manual%/*}.html"
done

