import { Stage } from 'tigerface-display';

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,.5)',
    },
}, document.getElementById('windmill') || document.documentElement);
