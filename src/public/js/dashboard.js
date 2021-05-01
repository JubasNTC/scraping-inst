'use strict';

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);

  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }

  return obj;
};

const generateHtmlReport = (links) => {
  const listItems = links.reduce(
    (acc, curr) => `
      ${acc}
      <li class="list-group-item">
        <a href="${curr}" target="_blank" rel="noopener noreferrer">${curr}</a>
      </li>
    `,
    ''
  );

  return `
    <hr>
    <label for="links-list">
      Number of links: ${links.length}. 
    </label>
    <ul id="links-list" class="list-group">${listItems}</ul>
  `;
};

const createDomElement = ({ tag, id, innerHTML }) => {
  const element = document.createElement(tag);
  element.setAttribute('id', id);
  element.innerHTML = innerHTML;

  return element;
};

document.addEventListener('submit', async (event) => {
  event.preventDefault();

  const previousReport = document.body.querySelector('div#report');
  const previousErrorMessage = document.body.querySelector('div#erorr-message');

  if (previousReport) {
    document.body.removeChild(previousReport);
  }

  if (previousErrorMessage) {
    document.body.removeChild(previousErrorMessage);
  }

  const preloader = createDomElement({
    tag: 'div',
    id: 'preloader',
    innerHTML: 'Loading...',
  });
  document.body.appendChild(preloader);

  try {
    const response = await fetch('/api/instagram', {
      method: 'POST',
      body: JSON.stringify(serializeForm(event.target)),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const linkList = await response.json();

    const reportInnerHTML = generateHtmlReport(linkList);

    const report = createDomElement({
      tag: 'div',
      id: 'report',
      innerHTML: reportInnerHTML,
    });

    document.body.appendChild(report);
  } catch (error) {
    const errorMessage = createDomElement({
      tag: 'div',
      id: 'erorr-message',
      innerHTML: error.message,
    });

    document.body.appendChild(errorMessage);
  } finally {
    document.body.removeChild(preloader);
  }
});
