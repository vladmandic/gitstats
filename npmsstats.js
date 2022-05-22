#!/usr/bin/env node

const process = require('process');
const superagent = require('superagent');
const log = require('@vladmandic/pilogger');
const config = require('./config.json');

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

async function analyzeRepo(name, repo) {
  const data = await http(`https://api.npms.io/v2/package/${name.replace('/', '%2F')}`);
  return {
    name: repo?.package?.name || data.collected.metadata.name,
    version: repo?.package?.version || data.collected.metadata.version,
    date: new Date(repo?.package?.date || data.collected.metadata.date),
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
      downloads: Math.round(data.evaluation.popularity.downloadsCount),
      acceleration: Math.round(100 * data.evaluation.popularity.downloadsAcceleration) / 100,
    },
    maintenance: {
      score: Math.round(100 * (repo?.score?.detail?.maintenance || data.score.detail.maintenance)),
      releases: Math.round(100 * data.evaluation.maintenance.releasesFrequency),
      commits: Math.round(100 * data.evaluation.maintenance.commitsFrequency),
      issues: Math.round(100 * data.evaluation.maintenance.issuesDistribution),
    },
    search: Math.round(100 * repo?.searchScore),
  };
}

async function npmsRepositories() {
  const res = await http(`https://api.npms.io/v2/search?q=${config.npmjs.user}`);
  const repos = [];
  if (res && res.results) {
    for (const repo of res.results) {
      if (repo.package?.author?.username !== config.npmjs.user) continue
      const data = await analyzeRepo(repo.package.name, repo);
      repos.push(data);
    }
  }
  const stats = {
    user: config.npmjs.user,
    repositories: repos.length,
    weekly: repos.reduce((prev, curr) => prev += curr.weekly, 0),
    monthly: repos.reduce((prev, curr) => prev += curr.monthly, 0),
  };
  log.data('npms stats:', stats)
  return repos;
}

exports.npmsRepositories = npmsRepositories;

async function cli() {
  if (process.argv.length === 3) {
    const repo = await analyzeRepo(process.argv[2])
    log.data('npms repository:', repo);
  }
}

cli();
