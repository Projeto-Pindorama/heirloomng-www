#!/bin/sh
# man2html - Generate HTML files from manual pages inside man[1-8][,b,m]/ directories.
# Very simple hack in POSIX sh, do not reutilize so often.

progname="$(basename $0)"

main(){
	op="$1"; shift
	case "$op" in
		generate) generate "$1" "$2";;
		nuke) nuke "$1" ;;
		\?|*) print_help ;;
	esac
}

generate(){
	src="${1:-.}"
	destdir="${2:-.}"

	for manual in "$src/man"*/*.*; do
		man_name="${manual##*/}"
		man_dir="$(basename "$(dirname $manual)")"
		dest="$destdir/$man_dir"
		if [ ! -d "$dest" ]; then
			mkdir -p "$dest" || exit 1
		fi
		[ -z "$(cat "$manual.html" 2>/dev/null)" ] \
		&& mandoc -T html -O style=/assets/mandoc.css "$manual" > "$dest/$man_name.html" 
	done
	unset man_name man_dir dest

	for man_dir in man*; do
		# In case if mathces anything that isn't a directory.
		[ ! -d $man_dir ] && continue

		dest="$destdir/$man_dir.html"

		# Determine which is the volume description. 
		case "${man_dir#man*}" in
			1b) vol="BSD System Compatibility";;
			1) vol="User Commands";;
			5) vol="File Formats";;
			7) vol="Headers, Tables and Macros";;
			1m|8) vol="Maintenance Commands" ;;
		esac

		# Generate HTML T.O.C. page for each category
		printf '<html>\n\t<head>\n\t<title>%s</title>\n\t<link\n\t\ttype="text/css"\n\t\trel="stylesheet"\n\t\thref="../assets/style.css">\n\t</head>\n\t<body>\n\t\t<div id='main'>\n\t\t\t<h1>%s</h1>\n\t\t\t<ul>\n' "$vol" "$vol" > "$dest" 
		for manpage in "$destdir/$man_dir"/*.html; do
			_name="${manpage##*/}"; name="${_name%%.*}"; unset _name

			# Ugly hack for obtaining the description for a manual
			# page.
			description="$(nawk '/id="NAME"/{getline; gsub(/<p.*- /, "", $0); gsub(/<\/p>/, "", $0); print $0}' "$manpage")"
			printf 'Writing %s to %s ...\n' "$name" "$dest" 1>&2 
			printf '\t\t\t\t<li><a href="%s">%s</a> -  %s</li>\n' \
			       	"$manpage" "$name" "$description" >> "$dest"
		done
		# Close the HTML document.
		printf '\t\t\t</ul>\n\t\t</div>\n\t</body>\n</html>' >> "$dest"
	done
}

nuke(){
	find "${1:-'.'}" \( -type f -o -type d \) -name 'man*' \
		! \( -name '*.sh' -o -name 'index.html' \) -exec rm -rf {} \;
}

print_help(){
	printf 'usage: %s generate <origin>|nuke [dest]\n' $progname 1>&2
}

main "$@"
