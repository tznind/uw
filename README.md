# LC
This repository is a template for building interactive [PbtA-style](https://en.wikipedia.org/wiki/Powered_by_the_Apocalypse?utm_source=chatgpt.com) character sheets.

## Live Character Sheet

Players can create their own characters, choose skills etc. Data is saved only into the address bar (URL) - allowing sharing/saving for later e.g. as a bookmark.

<a href="https://tznind.github.io/st/cs.html?name=Inigo+Montoya&player=Thomas&role=Fox&move_l1a2b3=1&move_d4e5f6=1&takefrom_d4e5f6_role=The+Ranger&takefrom_d4e5f6_move=rg002&move_rg002=1&ac_nm=Foxy+Fox&ac_dt=messy&strength=1&dexterity=2&intelligence=1&wisdom=0">
<img width="50%" src="https://github.com/user-attachments/assets/9d21b4b4-6b42-4f22-a740-c78015beb577"/>
</a>

Showcases (GitHub Pages):
- [Demo](https://tznind.github.io/st/lc.html)
- [Stonetop Character Sheet](https://tznind.github.io/st/cs.html)

## Features

### State stored in the URL
Any changes you make to a sheet are automatically reflected in the page’s URL.  
This means your players can:

- Bookmark or save the URL to preserve a character’s state.  
- Share the URL with others so they can see the same sheet.  

Each player can track their own sheet independently by keeping their own link.

## Create your own

To make your own rule set with custom moves and roles:

1. Create a new repository from this template:  

   <img width="264" height="163" alt="GitHub template button" src="https://github.com/user-attachments/assets/6c97f925-6db8-4687-ba26-101705bf736e" />

2. Update the JSON files in the [data](./data) folder with your content.  
3. Enable **GitHub Pages** in your repository settings (Settings=>Pages).  
4. Visit your sheet at:  

```
https://your_name.github.io/your_repository_name/cs.html
```

You can read more about Powered by the Apocalypse, including their permissive license terms, here:

https://lumpley.games/2023/11/22/what-is-pbta/

## Sync changes

If after using the template, if find new features have been added that you want to sync into your repository run the following to sync changes:

```
git remote add upstream https://github.com/tznind/lc
git fetch upstream

git checkout main
git merge upstream/main --allow-unrelated-histories
```

(for merge conflicts e.g. in data folder - always keep your own changes and discard incoming)

## Running Locally

To run the page locally (i.e. not in GitHub Pages) you can use any of:

```powershell
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP  
php -S localhost:8000
```

Then visit `http://localhost:8000/cs.html`

### Adding New Roles

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

The system will automatically load the moves file and make the role available.

