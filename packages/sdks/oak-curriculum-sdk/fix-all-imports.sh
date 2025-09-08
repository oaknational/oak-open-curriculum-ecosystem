#!/bin/bash

# Fix all relative imports in TypeScript files to include .js extension

echo "Fixing all relative imports in TypeScript source files..."

# Find all TypeScript files and fix imports
find src -name "*.ts" -type f | while read file; do
  # Skip test files
  if [[ "$file" == *".test.ts" ]] || [[ "$file" == *".spec.ts" ]]; then
    continue
  fi
  
  # Create a temporary file
  tmp_file="${file}.tmp"
  
  # Fix relative imports - handle various patterns
  sed -E "s/(import .* from ['\"])(\.\/.+)(['\"])/\1\2.js\3/g" "$file" | \
  sed -E "s/(export .* from ['\"])(\.\/.+)(['\"])/\1\2.js\3/g" | \
  sed -E "s/\.js\.js/\.js/g" > "$tmp_file"
  
  # Check if file changed
  if ! cmp -s "$file" "$tmp_file"; then
    mv "$tmp_file" "$file"
    echo "✓ Fixed: $file"
  else
    rm "$tmp_file"
  fi
done

echo "Done!"