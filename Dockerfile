FROM node:latest

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV BUILD /app/dist/Nagare

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli
RUN apt update && apt install -y nginx

# add app
COPY . /app
RUN ng build --prod
RUN rm -r /var/www/html
RUN cp -r ${BUILD} /var/www/html

EXPOSE 80/TCP

CMD ["nginx", "-g", "daemon off;"]

# docker run -d -p 8080:80 nagare:latest