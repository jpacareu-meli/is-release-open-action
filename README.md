# is-release-open-action

How to use this action:

1. Create a folder in your project's root named `.github`

2. Create a folder inside `.github` named `workflows`

3. Create a file inside of `workflows` named `is-release-opened.yml` (or the name you want)

4. Add into the newly created file:

```yml
name: 'Check if release is opened'
on:
  pull_request:
    types:
      - opened
jobs:
  check-release:
    if: contains(github.head_ref, 'feature/') || contains(github.head_ref, 'hotfix/')
    runs-on: ubuntu-latest
    steps:
      - uses: jpacareu-meli/is-release-open-action@v1.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

4. Commit and push your changes.

5. Open your Pull Request with your new workflow.
