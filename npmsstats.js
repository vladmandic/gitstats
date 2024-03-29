const process = require('process');
const http = require('./http.js').http;
const config = require('./config.json');

async function analyzeRepo(name, repo) {
  return new Promise(async (resolve) => {
    const data = await http(`https://api.npms.io/v2/package/${name.replace('/', '%2F')}`);
    resolve({
      name: repo?.package?.name || data.collected.metadata.name,
      version: repo?.package?.version || data.collected.metadata.version,
      // date: new Date(repo?.package?.date || data.collected.metadata.date),
      analyzed: new Date(data.analyzedAt),
      score: Math.round(100 * (repo?.score?.final || data.score.final)),
      quality: {
        score: Math.round(100 * (repo?.score?.detail?.quality || data.score.detail.quality)),
        carefulness: Math.round(100 * data.evaluation?.quality.carefulness),
        tests: Math.round(100 * data.evaluation?.quality.tests),
        health: Math.round(100 * data.evaluation?.quality.health),
        branding: Math.round(100 * data.evaluation?.quality.branding),
      },
      popularity: {
        score: Math.round(100 * (repo?.score?.detail?.popularity || data.score.detail.popularity)),
        community: data.evaluation.popularity.communityInterest,
        dl: Math.round(data.evaluation.popularity.downloadsCount),
        accel: Math.round(100 * data.evaluation.popularity.downloadsAcceleration) / 100,
      },
      maintenance: {
        score: Math.round(100 * (repo?.score?.detail?.maintenance || data.score.detail.maintenance)),
        releases: Math.round(100 * data.evaluation.maintenance.releasesFrequency),
        commits: Math.round(100 * data.evaluation.maintenance.commitsFrequency),
        issues: Math.round(100 * data.evaluation.maintenance.issuesDistribution),
      },
      search: Math.round(100 * repo?.searchScore),
    });
  });
}

async function npmsRepositories() {
  const res = await http(`https://api.npms.io/v2/search?q=${config.npmjs.user}`);
  let repos = [];
  if (res && res.results) {
    for (const repo of res.results) {
      if (repo.package?.author?.username !== config.npmjs.user) continue
      const data = analyzeRepo(repo.package.name, repo);
      repos.push(data);
    }
  }
  repos = await Promise.all(repos);
  return repos;
}

exports.npmsRepositories = npmsRepositories;
