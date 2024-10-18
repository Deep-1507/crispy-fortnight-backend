import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: "https://ready-louse-26885.upstash.io",
  token: "AWkFAAIjcDE2ZDIxYmNlMmEwODY0ZDg3YTViZWUxMjRjNDQzOGI1OXAxMA",
});

export default redis;