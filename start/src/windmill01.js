import { Stage } from 'tigerface-display';

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill01') || document.documentElement);
