FROM node:12-alpine AS deps

RUN apk add jq
COPY package.json /tmp
RUN jq '{ dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json

FROM node:12-alpine

RUN mkdir -p /code

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

# install dependencies first, with just dependencies, to avoid version numbers breaking cache
WORKDIR /code
COPY --from=deps /tmp/deps.json ./package.json
COPY package-lock.json* ./
RUN npm install --production && npm cache clean --force
ENV PATH /code/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
COPY ./index.js /code
COPY ./build /code/build
COPY ./public /code/public/

# Restore original, with version and all the content
COPY package.json ./

# RUN apk add --update bash && rm -rf /var/cache/apk/*

CMD [ "node", "index.js" ]
