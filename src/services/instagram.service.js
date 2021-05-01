'use strict';

const path = require('path');
const { Worker } = require('worker_threads');

const { readCookie } = require('../utils/cookie');
const { FEATURES_MAPPING, INSTAGRAM_URL_REGEXP } = require('../constants');

class InstagramService {
  async login() {
    const workerOptions = {
      feature: 'login',
      workerData: {},
    };

    return await this.runWorker(workerOptions);
  }

  async scrapeUrl(url) {
    const urlType = this.determineUrlType(url);

    if (!urlType) {
      return Promise.reject(new Error('Unsupported url type.'));
    }

    const cookie = await readCookie();

    const workerOptions = {
      feature: FEATURES_MAPPING.get(urlType),
      workerData: { cookie, url },
    };

    return await this.runWorker(workerOptions);
  }

  runWorker({ feature, workerData }) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, `../features/${feature}.js`),
        {
          workerData,
        }
      );

      worker.on('message', ({ error, data }) => {
        if (error) {
          return reject(error);
        }

        resolve(data);
      });

      worker.on('error', reject);

      worker.on('exit', (code) => {
        if (code > 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  determineUrlType(url) {
    const pathname = new URL(url).pathname;
    const matchedType = pathname.match(INSTAGRAM_URL_REGEXP);

    if (Array.isArray(matchedType)) {
      return matchedType[0];
    }

    return '';
  }
}

const instagramService = new InstagramService();

module.exports = instagramService;
