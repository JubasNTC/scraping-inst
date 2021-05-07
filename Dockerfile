FROM node:14.16.1-slim

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic \
    fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 \
    libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
    libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils x11vnc x11-xkb-utils \
    xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

RUN mkdir -p /usr/src/app/ && chown node:node /usr/src/app/
RUN mkdir -p /usr/src/app/var && chown node:node /usr/src/app/var

WORKDIR /usr/src/app/

COPY --chown=node:node package.json package-lock.json* ./

RUN npm install --production

COPY --chown=node:node . .

RUN chown node:node /usr/bin/google-chrome
RUN chown node:node /usr/bin/xvfb-run

USER node

EXPOSE 1337

CMD [ "sh", "./run.sh" ]