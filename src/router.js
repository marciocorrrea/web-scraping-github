import express from 'express';
const { Router } = express;

import ScrapeController from './controllers/ScrapeController.js';

const router = Router();

router.get('/scrape/*', ScrapeController.execute);

export default router;