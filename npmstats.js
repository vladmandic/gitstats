const superagent = require('superagent');
const log = require('@vladmandic/pilogger');
const config = require('./config.json');

async function npmjsRepositories() {
  const http = async (url) => {
    let json = {};
    try {
      const res = await superagent
        .get(url)
        .set('content-type', 'application/json')
        .set('user-agent', 'nodejs superagent/7.1.1')
      json = JSON.parse(res.text);
    } catch (err) {
      log.error({ err });
    }
    return (Array.isArray(json)) ? { ...json } : json;
  };

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
