let httpUrl: string;
let wsUrl: string;

if (import.meta.env.PROD) {
  httpUrl = 'https://ben-chatroom.onrender.com';
  wsUrl = 'wss://ben-chatroom.onrender.com';
} else {
  httpUrl = 'http://localhost:3000';
  wsUrl = 'ws://localhost:3000';
}

export { httpUrl, wsUrl };
