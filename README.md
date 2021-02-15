# is-release-open-action

How to use this action:

1. Create a folder in your project named `.workflows`

2. Create a file inside of it named `is-release-opened.yml`

3. Add into it:

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

4. Push your files.
