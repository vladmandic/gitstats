const log = require('@vladmandic/pilogger');
const http = require('./http.js').http;
const config = require('./config.json');

async function npmjsRepositorie(repo) {
  return new Promise(async (resolve) => {
    const weekly = await http(`https://api.npmjs.org/downloads/point/last-week/${repo.package?.name}`);
    const monthly = await http(`https://api.npmjs.org/downloads/point/last-month/${repo.package?.name}`);
    const yearly = await http(`https://api.npmjs.org/downloads/point/last-year/${repo.package?.name}`);
    resolve({
      name: repo.package?.name,
      version: repo.package?.version,
      date: new Date(repo.package?.date),
      downloads: {
        day: Math.round(weekly.downloads / 7),
        week: weekly.downloads,
        month: monthly.downloads,
        year: yearly.downloads,
      },
      score: {
        final: Math.round(100 * repo.score?.final),
        quality: Math.round(100 * repo.score?.detail?.quality),
        popularity: Math.round(100 * repo.score?.detail?.popularity),
        maintenance: Math.round(100 * repo.score?.detail?.maintenance), 
      }
    });
  });
}

async function npmjsRepositories() {
  const res = await http(`https://registry.npmjs.org/-/v1/search?text=@${config.npmjs.user}`);
  let repos = [];
  if (res && res.objects) {
    for (const repo of res.objects) {
      const result = npmjsRepositorie(repo);
      repos.push(result);
    }
  }
  repos = await Promise.all(repos);
  const stats = {
    user: config.npmjs.user,
    repositories: repos.length,
    downloads: {
      day: Math.round(repos.reduce((prev, curr) => prev += curr.downloads.week, 0) / 7),
      week: repos.reduce((prev, curr) => prev += curr.downloads.week, 0),
      month: repos.reduce((prev, curr) => prev += curr.downloads.month, 0),
      year: repos.reduce((prev, curr) => prev += curr.downloads.year, 0),
      annualized: Math.round(repos.reduce((prev, curr) => prev += curr.downloads.week, 0) * 52.1428571),
    }
  };
  log.data('npmjs stats:', stats)
  return repos;
}

exports.npmjsRepositories = npmjsRepositories;
