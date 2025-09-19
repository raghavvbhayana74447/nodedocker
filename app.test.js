const request = require('supertest');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Hello from Jenkins Node.js App , version 5🚀');
});

describe('GET /', () => {
  it('should return Hello message', async () => {
    const res = await request(app).get('/');
    expect(res.text).toBe('Hello from Jenkins Node.js App , version 5🚀');
  });
});
