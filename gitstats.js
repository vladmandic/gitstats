#!/usr/bin/env node

const superagent = require('superagent');
const log = require('@vladmandic/pilogger');

const config = require('./config.json');
let topK = 5;

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

async function main() {
  const repos = await githubRepositories();
  log.data('all repositories:', { count: repos.length}, repos);
  log.data('repositories with most stars:', { topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, topK));
  log.data('repositories with most forks:', { topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, topK));
  log.data('last updated repositories:', { topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, topK));
  log.data('largest repositories:', { topK }, repos.sort((a, b) => b.size - a.size).slice(0, topK));
  const reposWithIssues = repos.filter((r) => r.issues > 0);
  log.data('repositories with issues:', { count: reposWithIssues.length }, reposWithIssues);
}

main();
