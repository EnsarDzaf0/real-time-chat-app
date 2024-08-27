import io from 'socket.io-client';
import { baseUrl } from '../services/services';

const socket = io(baseUrl);

export default socket;