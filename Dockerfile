FROM node

WORKDIR /server_basic

COPY package*.json /server_basic/
COPY entrypoint.sh /server_basic/

ENTRYPOINT [ "sh", "/server_basic/entrypoint.sh" ]
















































