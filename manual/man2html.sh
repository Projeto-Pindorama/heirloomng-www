#!/bin/sh
# man2html - Generate HTML files from manual pages inside man[1-8][,b,m]/ directories.
# Very simple hack in POSIX sh, do not reutilize so often.

progname="$(basename $0)"

main(){
	case $1 in
		generate) generate ;;
		nuke) nuke ;;
		\?|*) print_help ;;
	esac
}

generate(){
	for manual in man*/*.*; do	
		# Generate HTML version of each manual page, then delete the original
		# [g,n,t]roff version
		[ -z "$(cat "$manual.html" 2>/dev/null)" ] \
		&& mandoc -T html -O style=/assets/mandoc.css "$manual" > "$manual.html" \
		&& rm -f "$manual"
		
		# Generate HTML T.O.C. page for each category
		_name="${manual#*/}"; name="${_name%%.*}"; unset _name
		description="$(awk -F' - ' '/id="NAME"/{ getline; print $2; }' "$manual.html")"
		printf 'Writing %s to %s ...\n' "$name" "${manual%/*}.html" 1>&2 
		printf '<li><a href="%s">%s</a> -  %s</li>\n' \
		       	"$manual.html" "$name" "$description" >> "${manual%/*}.html"
	done
}

nuke(){
	find . \( -type f -o -type d \) -name 'man*' \
		! \( -name '*.sh' -o -name 'index.html' \) -exec rm -rf {} \;
}

print_help(){
	printf 'usage: %s [generate|nuke]\n' $progname 1>&2
}

main $1
