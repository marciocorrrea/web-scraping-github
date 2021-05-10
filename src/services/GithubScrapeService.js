'use strict'
import { JSDOM } from 'jsdom';
import { formatUrl } from '../utils/functions.js';
import HttpService from './HttpService.js';
const GITHUB_URL = "https://github.com";

export default class ScrapeService {
  
  static async dowloadPage(repository) {
    const url = formatUrl(repository);
    return await HttpService.get(`${GITHUB_URL}${url}`);
  }

  static async getStatistics(repository) {
    try {
      const files = await this.readRepository(repository.data), filesObject = {}, statistics = [];
      await Promise.all(files.map(async file => {
        const fileInfo = await this.getFileInformation(file.href);
        const [name] = file.href.split('/').reverse(), [extension] = name.split(".").reverse();
        if (!filesObject[extension]) filesObject[extension] = { ...fileInfo, count: 1 };
        else {
          filesObject[extension].lines += fileInfo.lines;
          filesObject[extension].bytes += fileInfo.bytes;
          filesObject[extension].count++;
        }
      })
      );

      for (const extencion in filesObject) statistics.push({ extencion, ...filesObject[extencion] })
      return [null, statistics];

    } catch (error) {
      return [error, null];
    }
  }

  static async readRepository(html) {
    try {
      const items = await this.getItemsRepository(html)
      return await this.readFiles(items);
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getItemsRepository(html) {
    try {
      const { window: { document } } = new JSDOM(html);
      const items = document.querySelectorAll('.js-navigation-item');
      if (!items.length) return null;
      return items;
    } catch (error) {
      throw new Error(error)
    }
  }

  static async readFiles(items, files = []) {
    const directoryes = [];
    items.forEach(element => {
      if (element.nodeName == 'DIV' && !!element.querySelector('svg') &&
        element.querySelector('svg').getAttribute('aria-label') != 'Repository') {
        const
          type = element.querySelector('svg').getAttribute('aria-label'),
          href = element.querySelector('span a').getAttribute('href');
        if (type == 'Directory') directoryes.push(href);
        else if (type == 'File') files.push({ type, href });
      }
    })
    if (directoryes.length) await this.readDirectoryes(directoryes, files);
    return files;
  }

  static async readDirectoryes(directoryes, files) {
    try {
      await Promise.all(
        directoryes.map(async (href) => {
          const [error, page] = await this.dowloadPage(href);
          const items = await this.getItemsRepository(page.data);
          await this.readFiles(items, files);
        })
      );
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getFileInformation(url) {
    const
      [error, page] = await this.dowloadPage(url),
      { window: { document } } = new JSDOM(page.data),
      div = document.querySelector('div.text-mono.flex-md-order-1').textContent,
      info = div.trim().replace(/(\r\n|\t|\r|\s)/gm, "").toLowerCase();
    return { lines: Number(info.substring(0, info.indexOf("lines"))), bytes: this.getFileBytes(info) };
  };

  static getFileBytes(info) {
    let config = {};
    if (info.includes('bytes')) config = { afterSize: info.indexOf("bytes"), quantifier: 1 };
    if (info.includes('kb')) config = { afterSize: info.indexOf("kb"), quantifier: 1024 };
    if (info.includes('mb')) config = { afterSize: info.indexOf("mb"), quantifier: 1024 };
    config.beforeSize = info.indexOf(')');
    const bytes = Number(info.substring(config.beforeSize + 1, config.afterSize));
    return Math.round(bytes * config.quantifier);
  };
}