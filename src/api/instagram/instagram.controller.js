'use strict';

const instagramService = require('../../services/instagram.service');

module.exports = {
  scrape: async (req, res) => {
    const { url } = req.body;

    if (!url) {
      return res.sendStatus(400);
    }

    try {
      const scrapedData = await instagramService.scrapeUrl(url);

      res.send(scrapedData);
    } catch (error) {
      res.send(error);
    }
  },

  dashboard: (req, res) => {
    res.render('dashboard');
  },
};
