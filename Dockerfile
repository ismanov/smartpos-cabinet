FROM node:8.16.0-jessie
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN mkdir -p /usr/src/uzkassa/smartpos-web
WORKDIR /usr/src/uzkassa/smartpos-web
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package*.json yarn.lock ./
RUN yarn install
COPY  . /usr/src/uzkassa/smartpos-web
EXPOSE 9026
CMD ["yarn", "build"]