#!/usr/bin/env node

const superagent = require('superagent');
const log = require('@vladmandic/pilogger');

const config = require('./config.json');
let topK = 4;

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

  const listObjects = await http(`https://api.github.com/user/repos`);
  const list = Object.values(listObjects).filter((r) => r.permissions.admin);
  const size = list.reduce((prev, curr) => prev += curr.size, 0);
  log.data({ user: config.github.user, repositories: list.length, size });
  const repos = [];
  for (const r of list) {
    if (!r.permissions.admin) continue
    repos.push({
      name: r.full_name,
      public: r.visibility === 'public' ? true : false,
      created: new Date(r.created_at),
      updated: new Date(r.updated_at),
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
  log.data('all', repos);
  if (topK > repos.length) topK = repos.length;
  log.data('with issues', repos.filter((r) => r.issues > 0));
  log.data('most stars', repos.sort((a, b) => b.stars - a.stars).slice(0, topK));
  log.data('most forks', repos.sort((a, b) => b.forks - a.forks).slice(0, topK));
  log.data('last updated', repos.sort((a, b) => b.updated - a.updated).slice(0, topK));
  log.data('largest', repos.sort((a, b) => b.size - a.size).slice(0, topK));
}

main();
