import { io } from 'socket.io-client';

const URL = 'https://lebronify.develoop.app';

export const socket = io(URL, { autoConnect: true });
