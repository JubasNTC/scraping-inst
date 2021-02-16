'use strict';

const fs = require('fs').promises;

module.exports = {
  createReport: async (result) => {
    const template = await fs.readFile('template.html', 'utf-8');
    const replaced = template.replace('{result}', result);
    await fs.writeFile('result.html', replaced, 'utf-8');
  },
};
