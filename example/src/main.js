import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import AppRoot from './AppRoot';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root'),
    )
}

render(AppRoot)

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./AppRoot', () => {
        render(AppRoot)
    })
}

