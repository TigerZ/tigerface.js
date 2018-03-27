import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from 'react-hot-loader';
import AppRoot from './DomSpriteAppRoot';


const render = (Component) => {
    ReactDOM.render(
            <Component />,
        document.getElementById('root'),
    );
};

render(AppRoot);

