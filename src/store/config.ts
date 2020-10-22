let websocketUri = 'ws://localhost:3000/ws';

if(process.env.NODE_ENV === 'production') {
    websocketUri = 'wss://codefr33k.live/ws';
}

export default {
    websocketUri,
};

