import * as React from "react";
import * as ReactDOM from "react-dom";

import {People} from "./components/people";
import {CrimeList} from "./components/crime";

/**
 *
 */
ReactDOM.render(
    <section><People /><CrimeList/></section>,
    document.getElementById("root")
);