const log = require('@vladmandic/pilogger');
const superagent = require('superagent');

const http = async (url) => {
  let json = {};
  try {
    const res = await superagent
      .get(url)
      .set('content-type', 'application/json')
      .set('user-agent', 'nodejs superagent/7.1.1')
    json = JSON.parse(res.text);
  } catch (err) {
    log.error(err.response ? { code: err.response.statusCode, text: err.response.text } : { status: err.status || err }, url);
  }
  return (Array.isArray(json)) ? { ...json } : json;
};

exports.http = http;
