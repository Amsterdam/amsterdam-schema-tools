#!/usr/bin/env bash

mkdir -p target/core
mkdir -p source

cd source

git clone -q https://github.com/Amsterdam/amsterdam-schema.git
cd amsterdam-schema

git tag -l 'v*' | while read version; do
  git ls-files --with-tree=$version "*.json" | while read path; do
    name=${path%.*}
    dir=../../target/core/$(dirname $path)
    mkdir -p $dir
    git show $version:$path > ../../target/core/$name@$version
  done
done

git ls-files "*.json" | while read path; do
  name=${path%.*}
  dir=$(dirname $path)
  mkdir -p $dir
  git show HEAD:$path > ../../target/core/$name
done

cd ..
git clone -q https://github.com/Amsterdam/amsterdam-schema-tools.git
cd amsterdam-schema-tools

git ls-files "schemas/**.json" | while read path; do
  name=${path%.*}
  name=${name#"schemas/"}
  dir=../../target/dataset/$(dirname $name)
  mkdir -p $dir
  git show HEAD:$path > ../../target/dataset/$name
done