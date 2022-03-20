#!/usr/bin/env node

const superagent = require('superagent');
const log = require('@vladmandic/pilogger');

const config = require('./config.json');
let topK = 20;

async function github() {
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
  const list = Object.values(listObjects);
  const size = list.reduce((prev, curr) => prev += curr.size, 0);
  log.data({ user: config.github.user, repositories: list.length, size });
  const repos = [];
  for (const r of list) {
    if (!r.permissions.admin) continue
    repos.push({
      name: r.full_name,
      public: r.visibility === 'public' ? true : false,
      created: new Date(r.created_at),
      updated: new Date(r.pushed_at),
      size: r.size,
      stars: r.stargazers_count,
      forks: r.forks_count,
      issues: r.open_issues_count,
    });
  }
  return repos;
}

async function main() {
  const repos = await github();
  log.data('all', { count: repos.length}, repos);
  if (topK > repos.length) topK = repos.length;
  const reposWithIssues = repos.filter((r) => r.issues > 0);
  log.data('with issues', { count: reposWithIssues.length }, reposWithIssues);
  log.data('most stars', { topK }, repos.sort((a, b) => b.stars - a.stars).slice(0, topK));
  log.data('most forks', { topK }, repos.sort((a, b) => b.forks - a.forks).slice(0, topK));
  log.data('last updated', { topK }, repos.sort((a, b) => b.updated - a.updated).slice(0, topK));
  log.data('largest', { topK }, repos.sort((a, b) => b.size - a.size).slice(0, topK));
}

main();
