#!/usr/bin/env node

const log = require('@vladmandic/pilogger');
const githubRepositories = require('./gitstats.js').githubRepositories;
const npmjsRepositories = require('./npmjsstats.js').npmjsRepositories;
const npmsRepositories = require('./npmsstats.js').npmsRepositories;
const config = require('./config.json');

async function main() {
  log.configure({ inspect: { breakLength: 350 } });
  let repos;

  npmjsRepositories().then((repos) => {
    log.data('npmjs repositories:', { count: repos.length}, repos);
  });

  npmsRepositories().then((repos) => {
    log.data('npms repositories:', { count: repos.length }, repos);
  });

  githubRepositories().then((repos) => {
    const reposOrig = repos.filter((r) => !r.fork);
    log.data('github repositories:', { count: reposOrig.length}, reposOrig);

    const reposForks = repos.filter((r) => r.fork);
    log.data('github forks:', { count: reposForks.length}, reposForks);

    const reposPrivate = repos.filter((r) => !r.public);
    log.data('github private repositories:', { count: reposPrivate.length}, reposPrivate);

    log.data('github repositories with most stars:', { topK: config.topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, config.topK));
    log.data('github repositories with most forks:', { topK: config.topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, config.topK));
    log.data('github repositories with most clones:', { topK: config.topK }, repos.sort((a, b) => b.clones - a.clones).slice(0, config.topK));
    log.data('github last updated repositories:', { topK: config.topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, config.topK));
    log.data('github largest repositories:', { topK: config.topK }, repos.sort((a, b) => b.size - a.size).slice(0, config.topK));

    const reposWithPulls = repos.filter((r) => r.pulls.open > 0);
    log.data('github repos with open prs:', { count: reposWithPulls.length }, reposWithPulls.sort((a, b) => b.branches - a.branches).slice(0, config.topK));

    const reposWithBranches = repos.filter((r) => r.branches > 1);
    log.data('github repos with branches:', { count: reposWithBranches.length }, reposWithBranches.sort((a, b) => b.branches - a.branches).slice(0, config.topK));

    const reposWithIssues = repos.filter((r) => r.issues > 0);
    log.data('github repositories with issues:', { count: reposWithIssues.length }, reposWithIssues);
  });
}

main();
