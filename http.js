const log = require('@vladmandic/pilogger');

const globalHeaders = {
  'content-type': 'application/json',
  'user-agent': 'nodejs/fetch',
};

const http = async (url, headers = {}) => {
  try {
    const res = await fetch(url, { method: 'GET', headers: { ...globalHeaders, ...headers } })
    if (res.status !== 200) {
      const limit = res.headers.get('x-ratelimit-remaining');
      if (limit && parseInt(limit) === 0) log.error({ ratelimit: url, date: new Date(1000 * parseInt(res.headers.get('x-ratelimit-reset'))) });
      else log.error({ code: res.status, test: res.statusText, url })
      return {};
    }
    const text = await res.text();
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    log.error({ exception: e, url })
    return {};
  }
};

const head = async (url, headers = {}) => {
  let json = {};
  const res = await fetch(url, { method: 'GET', headers: { ...globalHeaders, ...headers } })
  if (res.status !== 200) return {};
  for (const h of res.headers) json[h[0]] = h[1];
  return json;
};

exports.http = http;
exports.head = head;
