import io from 'socket.io-client';
import { baseUrl } from '../services/services';

const socket = io('ws://localhost:8080');

export default socket;