import * as React from "react";
import * as ReactDOM from "react-dom";

import {People} from "./components/people";
import {CrimeList} from "./components/crime";
import {BikeList} from "./components/BikeList";




ReactDOM.render(
    <section><People /><CrimeList/><BikeList/></section>,
    document.getElementById("root")
);
