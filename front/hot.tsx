import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {AppContainer} from "react-hot-loader"
import {App} from './app'
import config from "./config";

/**
 * Given a react component, renders it to the page.
 * @param Component The component to render.
 */
const render = (Component: any) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root'),
    )
};

async function start() {
    render(App);

    // Webpack Hot Module Replacement API
    if ((module as any).hot) {
        (module as any).hot.accept('./app', () => render(App));
    }

    /*
    // Check for browser support of service worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/static/service-worker.js');
            if (config.debug) console.log('Hooray. Registration successful, scope is:', registration.scope);
        } catch (error) {
            if (config.debug) console.error('Service worker registration failed, error:', error);
        }
    }
    */
}

start();