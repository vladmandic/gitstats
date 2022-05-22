# [GitHub](github.com) and [NPMjs](npmjs.com) Stats

## Usage

To use, create `config.json` with the following structure:

```json
{
  "github": { "user": "your_username", "token": "your_token_here" },
  "npmjs": { "user": "your_username" }
}
```

## Sample output

> ./gitstats.js

```js

2022-05-22 11:47:20 DATA:  npmjs stats: { user: 'vladmandic', repositories: 7, weekly: 8747, monthly: 21645 }
2022-05-22 11:47:20 DATA:  npmjs repositories: { count: 7 } [
  { name: '@vladmandic/human', version: '2.7.2', date: 2022-05-18T12:35:51.754Z, weekly: 1833, monthly: 3620, score: 32, quality: 64, popularity: 4, maintenance: 33 },
  ...
]
2022-05-22 11:47:22 DATA:  github stats: { user: 'vladmandic', repositories: 52, public: 44, private: 8, forks: 2, size: 2165946, stars: 1209, forked: 227, commits: 5242, issues: 0 }
2022-05-22 11:47:22 DATA:  all repositories: { count: 52 } [
  { name: 'vladmandic/human', public: true, fork: false, created: 2020-10-11T23:14:19.000Z, updated: 2022-05-22T12:50:57.000Z, size: 544410, stars: 729, forks: 117, issues: 0 },
  ...
]
2022-05-22 11:47:22 DATA:  repositories with issues: { count: 0 } []
```

<br>

# [NPMS](npms.io) Stats

## Usage

- Just run using package name as parameter or
- Run without parameter in which case it will display all records for configured npmjs user (`config.npmjs.user`)


## Sample output

> ./npmsstats.js @vladmandic/human

```js
2022-05-22 12:43:05 DATA:  npms repository: {
  name: '@vladmandic/human',
  version: '2.7.2',
  date: 2022-05-18T12:35:51.754Z,
  analyzed: 2022-05-20T14:52:45.906Z,
  score: 70,
  quality: { score: 95, carefulness: 100, tests: 60, health: 100, branding: 100 },
  popularity: { score: 19, community: 879, downloads: 2440, acceleration: 14.37 },
  maintenance: { score: 100, releases: 100, commits: 100, issues: 100 },
}
```
