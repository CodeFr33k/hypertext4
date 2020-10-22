FROM node:15.5-alpine
ADD . /hypertext4
WORKDIR /hypertext4
CMD npm start 
