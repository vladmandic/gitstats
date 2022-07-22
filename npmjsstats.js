const log = require('@vladmandic/pilogger');
const http = require('./http.js').http;
const config = require('./config.json');

async function npmjsRepositories() {
  const res = await http(`https://registry.npmjs.org/-/v1/search?text=@${config.npmjs.user}`);
  const repos = [];
  if (res && res.objects) {
    for (const repo of res.objects) {
      const weekly = await http(`https://api.npmjs.org/downloads/point/last-week/${repo.package?.name}`);
      const monthly = await http(`https://api.npmjs.org/downloads/point/last-month/${repo.package?.name}`);
      repos.push({
        name: repo.package?.name,
        version: repo.package?.version,
        date: new Date(repo.package?.date),
        weekly: weekly.downloads,
        monthly: monthly.downloads,
        score: Math.round(100 * repo.score?.final),
        quality: Math.round(100 * repo.score?.detail?.quality),
        popularity: Math.round(100 * repo.score?.detail?.popularity),
        maintenance: Math.round(100 * repo.score?.detail?.maintenance),
      });
    }
  }
  const stats = {
    user: config.npmjs.user,
    repositories: repos.length,
    weekly: repos.reduce((prev, curr) => prev += curr.weekly, 0),
    monthly: repos.reduce((prev, curr) => prev += curr.monthly, 0),
  };
  log.data('npmjs stats:', stats)
  return repos;
}

exports.npmjsRepositories = npmjsRepositories;
