import React from 'react';
import ReactDOM from 'react-dom';

const { $ } = global;
// eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from 'react-hot-loader';
import AppRoot from './ChartsAppRoot';

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
    module.hot.accept('./ChartsAppRoot', () => {
        render(AppRoot);
    });
}

