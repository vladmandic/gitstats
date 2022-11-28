#!/usr/bin/env node

const log = require('@vladmandic/pilogger');
const githubRepositories = require('./gitstats.js').githubRepositories;
const npmjsRepositories = require('./npmjsstats.js').npmjsRepositories;
const npmsRepositories = require('./npmsstats.js').npmsRepositories;
const config = require('./config.json');

async function main() {
  log.configure({ inspect: { breakLength: 250 } });
  let repos;

  npmjsRepositories().then((repos) => {
    log.data('npmjs repositories:', { count: repos.length}, repos);
  });

  npmsRepositories().then((repos) => {
    log.data('npms repositories:', { count: repos.length }, repos.map((repo) => { return { name: repo.name, score: repo.score, search: repo.search, quality: repo.quality.score, popularity: repo.popularity.score, maintenance: repo.maintenance.score }; }));
  });

  githubRepositories().then((repos) => {
    log.data('github all repositories:', { count: repos.length}, repos);
    log.data('github repositories with most stars:', { topK: config.topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, config.topK));
    log.data('github repositories with most forks:', { topK: config.topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, config.topK));
    log.data('github last updated repositories:', { topK: config.topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, config.topK));
    log.data('github largest repositories:', { topK: config.topK }, repos.sort((a, b) => b.size - a.size).slice(0, config.topK));
    const reposWithIssues = repos.filter((r) => r.issues > 0);
    log.data('github repositories with issues:', { count: reposWithIssues.length }, reposWithIssues);
  });
}

main();
