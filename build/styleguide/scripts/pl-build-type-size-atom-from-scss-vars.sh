#!/bin/bash
# Change directory to where this script is kept
cd "$(dirname $0)"

# Script Settings
SCSS_VAR_PREFIX="typesize--"
SCSS_VAR_FILE="../source/scss/global/variables/_type-sizes.scss"
PL_TYPESIZES_FILE="../source/_patterns/00-atoms/02-text/02-type-sizes.mustache"
# End Settings

# All SCSS Color Variables with the prefix
SCSS_TYPESIZES="$(cat $SCSS_VAR_FILE | grep "^\$$SCSS_VAR_PREFIX")"

# Erase old colors atom and add the top line
echo '<table class="pl-typesizes"><thead><tr><th>Name</th><th>Example</th></tr></thead><tbody>' > "$PL_TYPESIZES_FILE"

# Loop through all SCSS type size variables and add a type size example to the Pattern Lab type size Atom
IFS=$'\n'
for i in ${SCSS_TYPESIZES}; do

  # Get variable name, remove $ and swap _ and - for spaces
  NAME="$(echo "$i" | sed 's,:.*,,' | sed "s,\$$SCSS_VAR_PREFIX,," | sed "s,[_|-], ,g" )"

  # Get color value, remove spaces and final ;
  TYPESIZE="$(echo "$i" | sed 's,^.*:,,' | sed 's,;.*,,' | tr -d ' ' | tr -d '\t')"

  # Add the color swatch
  echo "  <tr class=\"pl-typesize\"><td>${NAME}</td><td style=\"font-size: ${TYPESIZE};\">{{ headline.short }}</td></tr>" >> "$PL_TYPESIZES_FILE"

done
unset IFS
# Done looping

# Add closing tag
echo '</tbody></table>' >> "$PL_TYPESIZES_FILE"

echo "SCSS Type Size Variables Added to Pattern Lab Type Size Atom"

