#!/usr/bin/env node

const log = require('@vladmandic/pilogger');
const config = require('./config.json');

async function main() {
  log.configure({ inspect: { breakLength: process.stdout.columns } });

    const npmjsRepositories = require('./npmjsstats.js').npmjsRepositories;
  npmjsRepositories().then((repos) => {
    log.data('npmjs repositories:', { count: repos.length}, repos);
  });

  const githubRepositories = require('./gitstats.js').githubRepositories;
  githubRepositories().then((repos) => {
    const reposOrig = repos.filter((r) => !r.fork);
    log.data('github repositories:', { count: reposOrig.length}, reposOrig);

    const reposForks = repos.filter((r) => r.fork);
    log.data('github forks:', { count: reposForks.length}, reposForks);

    const reposPrivate = repos.filter((r) => !r.public);
    log.data('github private repositories:', { count: reposPrivate.length}, reposPrivate);

    log.data('github repos with most stars:', { topK: config.topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, config.topK));
    log.data('github repos with most forks:', { topK: config.topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, config.topK));
    log.data('github repos with most clones:', { topK: config.topK }, repos.sort((a, b) => b.clones - a.clones).slice(0, config.topK));
    log.data('github repos with most commits:', { topK: config.topK }, repos.sort((a, b) => b.commits - a.commits).slice(0, config.topK));
    log.data('github repos by last update:', { topK: config.topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, config.topK));
    log.data('github repos by size:', { topK: config.topK }, repos.sort((a, b) => b.size - a.size).slice(0, config.topK));

    const reposWithPulls = repos.filter((r) => r.pulls.open > 0);
    log.data('github repos with open prs:', { count: reposWithPulls.length }, reposWithPulls.sort((a, b) => b.branches - a.branches).slice(0, config.topK));

    const reposWithBranches = repos.filter((r) => r.branches > 1);
    log.data('github repos with branches:', { count: reposWithBranches.length }, reposWithBranches.sort((a, b) => b.branches - a.branches).slice(0, config.topK));

    const reposWithIssues = repos.filter((r) => r.issues > 0);
    log.data('github repos with issues:', { count: reposWithIssues.length }, reposWithIssues);
  });

  /*
  // npms.io is no longer maintained
  const npmsRepositories = require('./npmsstats.js').npmsRepositories;
  npmsRepositories().then((repos) => {
    log.data('npms repositories:', { count: repos.length }, repos);
  });
  */
}

main();
