FROM node:11.10-slim

RUN set -x \
    && apt-get update \
    && apt-get install -y build-essential git --no-install-recommends \
    && apt-get install -y python libcurl4-openssl-dev libsecret-1-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV APP_DIR /usr/src/app

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

ARG BUNDLE_GITHUB__COM
RUN git config --global url."https://$BUNDLE_GITHUB__COM@github.com/Talkdesk/".insteadOf "https://github.com/Talkdesk/"

ADD . ${APP_DIR}

RUN chmod 0755 ./scripts/*.sh
RUN yarn install --frozen-lockfile