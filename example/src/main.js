/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import AppRoot from './AppRoot';
import $ from 'jquery';
window.$ = $;

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

