const log = require('@vladmandic/pilogger');
const config = require('./config.json');
const http = require('./http.js').http;
const head = require('./http.js').head;

const headers = {
  accept: 'application/vnd.github.v3+json',
  authorization: `token ${config.github.token}`,
}

async function githubRepository(r) {
  return new Promise(async (resolve) => {
    const branches = await http(`https://api.github.com/repos/${r.full_name}/branches`, headers);
    const pullsJson = await http(`https://api.github.com/repos/${r.full_name}/pulls?state=all`, headers);
    const clonesJson = await http(`https://api.github.com/repos/${r.full_name}/traffic/clones?per=week`, headers);
    const clones = clonesJson.clones ? clonesJson.clones.map((c) => c.count).reduce((avg, value, _, { length }) => avg + value / length, 0) : 0;
    const headersJson = await head(`https://api.github.com/repos/${r.full_name}/commits?per_page=1`, headers); // get headers
    pulls = {}
    for (const pull of Object.values(pullsJson)) pulls[pull.state] = pull.state in pulls ? pulls[pull.state] + 1 : 1
    resolve({
      name: r.full_name,
      url: r.html_url,
      public: r.visibility === 'public' ? true : false,
      fork: r.fork,
      created: new Date(r.created_at),
      updated: new Date(r.pushed_at),
      size: r.size,
      stars: r.stargazers_count,
      forks: r.forks_count,
      issues: r.open_issues_count,
      branches: Object.values(branches).length,
      pulls: pulls,
      commits: parseInt(headersJson.link?.match(/\d+/g).pop() || '0'), // extract total commit count from pagination data
      clones: Math.floor(clones),
    });
  });
}

async function githubRepositories() {
  const listObjects = await http('https://api.github.com/user/repos?visibility=all&per_page=100', headers);
  const commits = await http(`https://api.github.com/search/commits?q=author:${config.github.user}`, headers);
  let repos = [];
  for (const r of Object.values(listObjects)) {
    if (!r.permissions.admin) continue
    const result = githubRepository(r);
    repos.push(result);
  }
  repos = await Promise.all(repos);
  const stats = {
    user: config.github.user,
    repositories: repos.length,
    public: repos.filter((r) => r.public).length,
    private: repos.filter((r) => !r.public).length,
    forks:  repos.filter((r) => r.fork).length,
    size: repos.reduce((prev, curr) => prev += curr.size, 0),
    stars: repos.reduce((prev, curr) => prev += curr.stars, 0),
    forked: repos.reduce((prev, curr) => prev += curr.forks, 0),
    'clones/week': repos.reduce((prev, curr) => prev += curr.clones, 0),
    commits: commits.total_count,
    issues: repos.reduce((prev, curr) => prev += curr.issues, 0),
  };
  log.data('github stats:', stats);
  return repos;
}

exports.githubRepositories = githubRepositories;
