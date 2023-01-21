const superagent = require('superagent');
const log = require('@vladmandic/pilogger');
const config = require('./config.json');

async function githubRepositories() {
  const http = async (url) => {
    let json = {};
    try {
      const res = await superagent
        .get(url)
        .set('content-type', 'application/json')
        .set('accept', 'application/vnd.github.v3+json')
        .set('user-agent', 'nodejs superagent/7.1.1')
        .set('authorization', `token ${config.github.token}`);
      json = JSON.parse(res.text);
    } catch (err) {
      log.error({ err });
    }
    return (Array.isArray(json)) ? { ...json } : json;
  };

  const listObjects = await http('https://api.github.com/user/repos?visibility=all&per_page=100');
  const commits = await http(`https://api.github.com/search/commits?q=author:${config.github.user}`);
    const repos = [];
  for (const r of Object.values(listObjects)) {
    if (!r.permissions.admin) continue
    const branches = await http(`https://api.github.com/repos/${r.full_name}/branches`);
    const pullsJson = await http(`https://api.github.com/repos/${r.full_name}/pulls?state=all`);
    pulls = {}
    for (const pull of Object.values(pullsJson)) {
      pulls[pull.state] = pull.state in pulls ? pulls[pull.state] + 1 : 1
    }
    repos.push({
      name: r.full_name,
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
    });
  }
  const stats = {
    user: config.github.user,
    repositories: repos.length,
    public: repos.filter((r) => r.public).length,
    private: repos.filter((r) => !r.public).length,
    forks:  repos.filter((r) => r.fork).length,
    size: repos.reduce((prev, curr) => prev += curr.size, 0),
    stars: repos.reduce((prev, curr) => prev += curr.stars, 0),
    forked: repos.reduce((prev, curr) => prev += curr.forks, 0),
    commits: commits.total_count,
    issues: repos.reduce((prev, curr) => prev += curr.issues, 0),
  };
  log.data('github stats:', stats);
  return repos;
}

exports.githubRepositories = githubRepositories;
