#!/usr/bin/env node

const log = require('@vladmandic/pilogger');
const githubRepositories = require('./gitstats.js').githubRepositories;
const npmjsRepositories = require('./npmjsstats.js').npmjsRepositories;
const npmsRepositories = require('./npmsstats.js').npmsRepositories;
const config = require('./config.json');

async function main() {
  let repos;

  repos = await npmjsRepositories();
  log.data('npmjs repositories:', { count: repos.length}, repos);

  repos = await npmsRepositories();
  log.data('npms repositories:', { count: repos.length }, repos.map((repo) => { return { name: repo.name, score: repo.score, search: repo.search, quality: repo.quality.score, popularity: repo.popularity.score, maintenance: repo.maintenance.score }; }));

  repos = await githubRepositories();
  log.data('all repositories:', { count: repos.length}, repos);
  log.data('repositories with most stars:', { topK: config.topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, config.topK));
  log.data('repositories with most forks:', { topK: config.topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, config.topK));
  log.data('last updated repositories:', { topK: config.topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, config.topK));
  log.data('largest repositories:', { topK: config.topK }, repos.sort((a, b) => b.size - a.size).slice(0, config.topK));
  const reposWithIssues = repos.filter((r) => r.issues > 0);
  log.data('repositories with issues:', { count: reposWithIssues.length }, reposWithIssues);
}

main();
