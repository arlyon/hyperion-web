import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './app'
import {RegisterServiceWorker} from "./service";

/**
 * Given a react component, renders it to the page.
 * @param Component The component to render.
 */
const render = (Component: any) => {
    ReactDOM.render(
        <Component/>,
        document.getElementById('root'),
    )
};

async function start() {
    render(App);
    RegisterServiceWorker();
}

start();