# UW

This is an [Uncharted Worlds](https://uncharted-worlds.com/) implementation of [LC Character Sheets](https://github.com/tznind/lc?tab=readme-ov-file#live-character-sheet).

It is online at https://tznind.github.io/uw/cs.html

<a href="https://tznind.github.io/uw/cs.html">
<img width="824" height="849" alt="image" src="https://github.com/user-attachments/assets/79df7d87-7cbc-48d2-a757-a8ee3309c93b" />
</a>


See https://github.com/tznind/lc for main template repository.

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

## License

Character sheet code is licensed under the [MIT license](./LICENSE).

Uncharted Worlds content by **Sean Gomes** is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) - used with permission of Sean Gomes.
