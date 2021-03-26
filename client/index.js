#!/usr/bin/env node

/*
  chmod +x index.js
*/

/*

// deletar do heroku
heroku apps:delete

npm i -g @halexv/hacker-chat-client

// retirar do npm
npm unpublish --force

// retirar o comando global
npm unlink -g @halexv/hacker-chat-client

hacker-chat \
  --username erickwendel \
  --room sala01

./node index.js
bash node index.js
bash ./index.js \
  --username erickwendel \
  --room sala01

node index.js \
  --username erickwendel \
  --room sala01 \
  --hostUri localhost
*/

import Events from "events";
import CliConfig from "./src/cliConfig.js";
import EventManager from "./src/eventManager.js";
import SocketClient from "./src/socket.js";
import TerminalController from "./src/terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

// console.log("config", config);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();

const eventManager = new EventManager({ componentEmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
  roomId: config.room,
  userName: config.username,
};
eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();

await controller.initializeTable(componentEmitter);
