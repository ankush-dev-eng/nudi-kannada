#!/usr/bin/env bash
set -euo pipefail

# Nudi Dataset Validation Script
echo "Running Go dataset validator on src/data/phrases.json..."
go test -v ./tools/validate/...
go run ./tools/validate -file src/data/phrases.json
echo "Dataset validation complete!"
