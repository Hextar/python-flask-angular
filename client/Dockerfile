FROM node:alpine AS builder

MAINTAINER Stefano st.salidu@gmail.com

WORKDIR /src/app

COPY . .

RUN npm install && \
    npm run build

FROM nginx:alpine

COPY --from=builder /src/app/dist/ /usr/share/nginx/html/
