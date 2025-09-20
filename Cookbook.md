# Cookbook

This document describes how to create different types of moves.

## Add a new role

To add a new role with moves:

1. Create a JSON file in `data/moves/` (e.g., `data/moves/new-role.json`)
2. Add the role to `data/availability.json` with a `_movesFile` property:

```json
"New Role": {
  "_movesFile": "data/moves/new-role.json",
  "move1": true,
  "move2": false
}
```

