import { io } from 'socket.io-client';
import { Buffer } from 'buffer';

const URL = 'http://localhost:3000';

export const socket = io(URL, { autoConnect: true });
