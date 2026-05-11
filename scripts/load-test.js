import http from 'k6/http';
import { sleep, check } from 'k6';

// Set this to your production URL or local dev URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 500 },   // Increase to 500
    { duration: '2m', target: 2000 },  // Peak at 2000 users (Event Simulation)
    { duration: '1m', target: 2000 },  // Stay at 2000 for 1 minute
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must be under 1s
    http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
  },
};

export default function () {
  // 1. Visit Home Page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'home status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1); // Think time: 1-3 seconds

  // 2. Load Artists List (Cached)
  const artistsRes = http.get(`${BASE_URL}/api/artists`);
  check(artistsRes, {
    'artists status is 200': (r) => r.status === 200,
  });

  // 3. Load Leaderboard (The critical path)
  const lbRes = http.get(`${BASE_URL}/api/artists/leaderboard`);
  check(lbRes, {
    'leaderboard status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 3 + 2); // Think time: 2-5 seconds
}
