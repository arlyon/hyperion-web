import * as React from "react";
import {Button, Toolbar} from "react-md";

import {CrimeList} from "./components/crime";
import {People} from "./components/people";
import {SearchBox} from "./components/searchbox"

export const App = () => (
    <div>
        <Toolbar
            colored={true}
            title="My App"
            actions={<Button icon={true}>favorite</Button>}
            component="nav"
        />
        <main>
            <SearchBox/>
            <People/>
            <CrimeList/>
            <BikeList />
        </main>
    </div>);