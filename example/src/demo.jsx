import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppRoot from './DomSpriteAppRoot';

const { $ } = global;
window.$ = $;

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root'),
    );
};

render(AppRoot);

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./DomSpriteAppRoot', () => {
        render(AppRoot);
    });
}

