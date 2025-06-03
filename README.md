# GitHub Action App user <!-- omit in toc -->

Get a [**GitHub** App][github-app]'s email and username, from a [**GitHub** Action][github-action].

- Use a [**GitHub** App][github-app] as [**Git**][git] author of commits.

---

[![Renovate](https://img.shields.io/badge/Renovate-enabled-brightgreen?logo=renovatebot&logoColor=&style=flat-square)](https://renovatebot.com)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Code coverage](https://img.shields.io/codecov/c/github/vidavidorra/github-action-app-user?logo=codecov&style=flat-square)](https://codecov.io/gh/vidavidorra/github-action-app-user)
[![License](https://img.shields.io/github/license/vidavidorra/github-action-app-user?style=flat-square)](LICENSE.md)

- [Usage](#usage)
- [Contributing](#contributing)
- [Security policy](#security-policy)
- [License](#license)

## Usage

This [**GitHub** Action][github-action] can be used in combination with a [**GitHub** Action][github-action] that creates a [**GitHub** App][github-app] installation token, for example [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token). The workflow below shows an example where this [**GitHub** Action][github-action] is used for the [**semantic-release**](https://github.com/semantic-release/semantic-release) author and committer.

```yml
name: Release
on:
  push:
    branches:
      - main
jobs:
  release:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/create-github-app-token
        id: app-token
        with:
          app-id: ${{ vars.APP_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
      - uses: vidavidorra/github-action-app-user
        id: app-user
        with:
          token: ${{ steps.app-token.outputs.token }}
          slug: ${{ steps.app-token.outputs.app-slug }}
      - name: Release
        env:
          GITHUB_TOKEN: ${{ steps.app-token.outputs.token }}
          GIT_AUTHOR_NAME: ${{ steps.app-user.outputs.username }}
          GIT_AUTHOR_EMAIL: ${{ steps.app-user.outputs.email }}
          GIT_COMMITTER_NAME: ${{ steps.app-user.outputs.username }}
          GIT_COMMITTER_EMAIL: ${{ steps.app-user.outputs.email }}
        run: npx --no-install semantic-release
```

### Inputs <!-- omit in toc -->

| name    | type   | required | description                          |
| ------- | ------ | -------- | ------------------------------------ |
| `token` | string | ✓        | GitHub App installation access token |
| `slug`  | string | ✓        | slug of the GitHub App               |

### Outputs <!-- omit in toc -->

| name       | type   | description                     |
| ---------- | ------ | ------------------------------- |
| `email`    | string | email of the GitHub App user    |
| `username` | string | username of the GitHub App user |

## Contributing

Please [create an issue](https://github.com/vidavidorra/github-action-app-user/issues/new/choose) if you have a bug report or feature proposal, or [create a discussion](https://github.com/vidavidorra/github-action-app-user/discussions) if you have a question. If you like this project, please consider giving it a star ⭐ to support my work.

Refer to the [contributing guide](https://github.com/vidavidorra/.github/blob/main/CONTRIBUTING.md) for detailed information about other contributions, like pull requests.

[![Conventional Commits: 1.0.0](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?style=flat-square)](https://conventionalcommits.org)
[![XO code style](https://img.shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray&style=flat-square)](https://github.com/xojs/xo)
[![Prettier code style](https://img.shields.io/badge/code_style-Prettier-ff69b4?logo=prettier&style=flat-square)](https://github.com/prettier/prettier)

## Security policy

Please refer to the [Security Policy on GitHub](https://github.com/vidavidorra/github-action-app-user/security) for the security policy.

## License

This project is licensed under the [GPLv3 license](https://www.gnu.org/licenses/gpl.html).

Copyright © 2024-2025 Jeroen de Bruijn

<details><summary>License notice</summary>
<p>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

The full text of the license is available in the [LICENSE](LICENSE.md) file in this repository and [online](https://www.gnu.org/licenses/gpl.html)

</details>

<!-- References -->

[github-action]: https://github.com/features/actions/
[github-app]: https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps
[git]: https://git-scm.com/
