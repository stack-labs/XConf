#!/bin/bash

handler() {
  local dir=$1
  local entry="${dir}/index.ts"

  if [ -e $entry ]; then
    rm -f $entry
  fi

  files=$(ls $dir)
  for f in $files; do
    local filename=${f%.*}
    local ext=${f##*.}

    if [ -d "$dir/$f" -o $ext == 'ts' -o $ext == 'tsx' ]; then
      if [ $filename != 'index' ] && [[ ! $filename =~ '.test' ]]; then
        echo "export * from './${filename}';" >>$entry
      fi
    fi

    if [ -d "$dir/$f" ]; then
      handler "$dir/$f"
    fi
  done
}

handler "./src/hoc"
handler "./src/hooks"
handler "./src/tools"
handler "./src/stores"
handler "./src/renders"
handler "./src/typings"
handler "./src/services"
