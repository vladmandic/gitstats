# [GitHub](github.com) [NPMjs](npmjs.com) [NPMs](npms.io) Stats

## Usage

To use, create `config.json` with the following structure:

```json
{
  "topK": 5,
  "github": { "user": "your_username", "token": "your_token_here" },
  "npmjs": { "user": "your_username" }
}
```

## Sample output

> ./stats.js

```js
2022-07-21 14:04:41 DATA:  npmjs stats: { user: 'vladmandic', repositories: 7, weekly: 6769, monthly: 20024 }
2022-07-21 14:04:41 DATA:  npmjs repositories: { count: 7 } [
  { name: '@vladmandic/pilogger', version: '0.4.5', date: 2022-07-14T13:06:09.759Z, weekly: 103, monthly: 314, score: 36, quality: 78, popularity: 3, maintenance: 33 },
  { name: '@vladmandic/face-api', version: '1.6.10', date: 2022-05-24T11:18:44.847Z, weekly: 5115, monthly: 12264, score: 33, quality: 64, popularity: 6, maintenance: 33 },
  { name: '@vladmandic/human', version: '2.8.1', date: 2022-06-08T12:53:39.300Z, weekly: 934, monthly: 4942, score: 33, quality: 64, popularity: 5, maintenance: 33 },
  { name: '@vladmandic/human-models', version: '2.8.1', date: 2022-06-08T12:57:54.665Z, weekly: 437, monthly: 2142, score: 28, quality: 53, popularity: 2, maintenance: 33 },
  { name: '@vladmandic/piproxy', version: '1.1.23', date: 2022-05-25T20:30:41.189Z, weekly: 6, monthly: 17, score: 27, quality: 52, popularity: 0, maintenance: 33 },
  { name: '@vladmandic/build', version: '0.7.7', date: 2022-07-14T13:33:51.927Z, weekly: 173, monthly: 305, score: 25, quality: 45, popularity: 1, maintenance: 33 },
  { name: '@vladmandic/piacme', version: '0.1.30', date: 2022-01-14T15:21:12.103Z, weekly: 1, monthly: 40, score: 25, quality: 43, popularity: 2, maintenance: 32 }
]
2022-07-21 14:04:43 DATA:  npms repositories: { count: 7 } [
  { name: '@vladmandic/human', score: 70, search: 91, quality: 95, popularity: 20, maintenance: 100 },
  { name: '@vladmandic/face-api', score: 70, search: 72, quality: 95, popularity: 18, maintenance: 100 },
  { name: '@vladmandic/pilogger', score: 59, search: 5, quality: 74, popularity: 5, maintenance: 100 },
  { name: '@vladmandic/piproxy', score: 53, search: 1, quality: 54, popularity: 6, maintenance: 100 },
  { name: '@vladmandic/human-models', score: 53, search: 1, quality: 53, popularity: 6, maintenance: 100 },
  { name: '@vladmandic/piacme', score: 49, search: 0, quality: 44, popularity: 4, maintenance: 97 },
  { name: '@vladmandic/build', score: 44, search: 0, quality: 46, popularity: 3, maintenance: 83 }
]
2022-07-21 14:04:45 DATA:  github stats: { user: 'vladmandic', repositories: 48, public: 45, private: 3, forks: 2, size: 2015942, stars: 1401, forked: 263, commits: 5235, issues: 0 }
2022-07-21 14:04:45 DATA:  all repositories: { count: 48 } [
  ...
]
2022-07-21 14:04:45 DATA:  repositories with most stars: { topK: 3 } [
  { name: 'vladmandic/human', public: true, fork: false, created: 2020-10-11T23:14:19.000Z, updated: 2022-07-21T17:06:17.000Z, size: 532541, stars: 843, forks: 135, issues: 0 },
  { name: 'vladmandic/face-api', public: true, fork: false, created: 2020-08-18T11:24:46.000Z, updated: 2022-05-24T11:19:05.000Z, size: 62533, stars: 318, forks: 68, issues: 0 },
  { name: 'vladmandic/pigallery', public: true, fork: false, created: 2020-05-03T19:24:28.000Z, updated: 2022-05-25T19:19:52.000Z, size: 322890, stars: 35, forks: 3, issues: 0 },
]
2022-07-21 14:04:45 DATA:  repositories with most forks: { topK: 3 } [
  { name: 'vladmandic/human', public: true, fork: false, created: 2020-10-11T23:14:19.000Z, updated: 2022-07-21T17:06:17.000Z, size: 532541, stars: 843, forks: 135, issues: 0 },
  { name: 'vladmandic/face-api', public: true, fork: false, created: 2020-08-18T11:24:46.000Z, updated: 2022-05-24T11:19:05.000Z, size: 62533, stars: 318, forks: 68, issues: 0 },
  { name: 'vladmandic/nudenet', public: true, fork: false, created: 2021-03-25T11:53:41.000Z, updated: 2022-05-25T19:15:23.000Z, size: 66226, stars: 24, forks: 9, issues: 0 },
]
2022-07-21 14:04:45 DATA:  last updated repositories: { topK: 3 } [
  { name: 'motionIQ-ai/motion-intelligence', public: false, fork: false, created: 2022-07-21T15:59:01.000Z, updated: 2022-07-21T17:39:11.000Z, size: 112027, stars: 0, forks: 0, issues: 0 },
  { name: 'motionIQ-ai/demo', public: true, fork: false, created: 2022-02-07T16:50:54.000Z, updated: 2022-07-21T17:09:09.000Z, size: 44595, stars: 0, forks: 0, issues: 0 },
  { name: 'vladmandic/human', public: true, fork: false, created: 2020-10-11T23:14:19.000Z, updated: 2022-07-21T17:06:17.000Z, size: 532541, stars: 843, forks: 135, issues: 0 },
]
2022-07-21 14:04:45 DATA:  largest repositories: { topK: 3 } [
  { name: 'vladmandic/human', public: true, fork: false, created: 2020-10-11T23:14:19.000Z, updated: 2022-07-21T17:06:17.000Z, size: 532541, stars: 843, forks: 135, issues: 0 },
  { name: 'vladmandic/pigallery', public: true, fork: false, created: 2020-05-03T19:24:28.000Z, updated: 2022-05-25T19:19:52.000Z, size: 322890, stars: 35, forks: 3, issues: 0 },
  { name: 'vladmandic/human-models', public: true, fork: false, created: 2021-09-25T10:52:00.000Z, updated: 2022-07-18T00:42:10.000Z, size: 196190, stars: 5, forks: 0, issues: 0 },
]
2022-07-21 14:04:45 DATA:  repositories with issues: { count: 0 } []
```

<br>
