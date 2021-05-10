'use strict'
import ScrapeService from '../services/GithubScrapeService.js';
import MemoryDB from'../database/MemoryDB.js'
import { formatUrl } from '../utils/functions.js';

const DB = new MemoryDB();

export default class ScrapeController {

  static async execute({ params: { 0: repository } }, response) {

    if (!repository || !repository.includes('/')) return response.status(400).json({ error: 'Repository name is missing!' });
    try {
      const url = formatUrl(repository)
      const isCached = DB.getItem(url);

      if(!!isCached) return response.status(200).json({ statistics: isCached.statistics });

      const [errorDowload, page] = await ScrapeService.dowloadPage(repository);
      if (errorDowload || !page) return response.status(404).json({ message: 'Invalid repository url!', error: errorDowload });

      const [errorStatistics, statistics] = await ScrapeService.getStatistics(page);
      if (errorStatistics || !statistics) return response.status(400).json({ message: 'Failed to read repository files!', error });

      DB.setItem({url, statistics});
      return response.status(200).json({ statistics });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}