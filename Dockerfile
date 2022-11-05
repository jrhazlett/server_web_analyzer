FROM node

WORKDIR /server_web_analyzer

COPY package*.json /server_web_analyzer/
COPY entrypoint.sh /server_web_analyzer/

ENTRYPOINT [ "sh", "/server_web_analyzer/entrypoint.sh" ]
















































