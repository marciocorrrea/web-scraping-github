import app from '../app.js';
import request from 'supertest';

describe('Scraper', () => {
  const repository = 'https://github.com/marciocorreadev/numbers-name';
  let supertest;

  beforeAll(async () => supertest = await request(app))

  it('Should be able to read a repository', async () => {
    const response = await supertest.get(`/scrape/${repository}`);
    expect(response.status).toBe(200);
    expect(response.body.statistics.length).toBeGreaterThan(0);
    const jsonFiles = response.body.statistics.find(file => file.extencion == 'json');
    expect(jsonFiles.bytes).toBe(8878);
    expect(jsonFiles.count).toBe(6);
    expect(jsonFiles.lines).toBe(320);
  }, 100000);

  it('Should be able to read a repository faster', async () => {
    const response = await supertest.get(`/scrape/${repository}`);
    expect(response.status).toBe(200);
    expect(response.body.statistics.length).toBeGreaterThan(0);
    const jsonFiles = response.body.statistics.find(file => file.extencion == 'gitignore');
    expect(jsonFiles.bytes).toBe(1577);
    expect(jsonFiles.count).toBe(1);
    expect(jsonFiles.lines).toBe(103);
  });

});