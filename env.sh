#!/usr/bin/env bash

location=./src/config
file_name=appConfig.js
# Recreate config file
rm -rf ./"${location}/${file_name}"
touch ./"${location}/${file_name}"

# Add assignment
echo -e "window.config = {" >> ./"${location}/${file_name}"

publiccode_vars=($(env | grep -i PUBLICCODE_))

# Loop on environment variables prefixed with
# PUBLICCODE and add them to "${location}/${file_name}"
for (( i=0; i<${#publiccode_vars[@]}; i++ )); do
    # Store the var name:
    # * Only get the portion before the = sign
    # * Remove the prefixes PUBLICCODE_
    # * Transform from upper to lower case
    # * Transform snake case to camel case
    # * Remove blank lines
    varname=$(printf '"'; \
              printf '%s\n' "${publiccode_vars[$i]}" \
                | sed -e 's/=.*//' \
                | sed 's/PUBLICCODE_//g' \
                | tr '[:upper:]' '[:lower:]' \
                | awk -F _ '{printf "%s", $1; for(i=2; i<=NF; i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print"";}' \
                | tr -d '\n'; \
              printf '"')
    # Store the var value
    varvalue=$(printf '%s\n' "${publiccode_vars[$i]}" | sed -e 's/^[^=]*=//')

    if [[ $i -lt $(expr ${#publiccode_vars[@]} - 1) ]]; then
        # Write values in the file. Add comma at EOL
        echo "  $varname: \"$varvalue\"," >> ./"${location}/${file_name}"
    else
        # Write values in the file. Do not add comma at EOL
        echo "  $varname: \"$varvalue\"" >> ./"${location}/${file_name}"
    fi
done

echo "}" >> ./"${location}/${file_name}"
