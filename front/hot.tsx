// main.js
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {AppContainer} from "react-hot-loader"
import {App} from './app'

const render = (Component: any) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root'),
    )
};

render(App);

// Webpack Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./app', () => render(App));
}