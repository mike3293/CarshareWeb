# docker build --progress=plain -t carshare-web .
# docker tag carshare-web mikhailgorodilov/carshare-web:latest
# docker push mikhailgorodilov/carshare-web:latest
FROM node:16.13-alpine as dependencies
WORKDIR /my-project
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16.13-alpine as builder
WORKDIR /my-project
COPY . .
COPY --from=dependencies /my-project/node_modules ./node_modules
RUN yarn build

# remove development dependencies 
RUN npm prune --production

FROM node:16.13-alpine as runner
WORKDIR /my-project
ENV NODE_ENV production
COPY --from=builder /my-project/public ./public
COPY --from=builder /my-project/.next ./.next
COPY --from=builder /my-project/node_modules ./node_modules
COPY --from=builder /my-project/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]