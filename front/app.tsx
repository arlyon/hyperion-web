import * as React from "react";
import {Button, Toolbar, Card, Tab, Tabs, TabsContainer, FontIcon} from "react-md";

import {CrimeList} from "./components/crime";
import {SearchBox} from "./components/SearchBox"
import {BikeList} from "./components/BikeList";
import POSTCODES from "./data/postcodes"

export const App = () => (
    <div>
        <Toolbar
            colored={true}
            title="Crime Checker"
            actions={<Button icon={true}>info</Button>}
            component="nav"
        />
        <main>
            <h1 className="title">Find Crime Near You</h1>
            <SearchBox postcodes={POSTCODES}/>
            <Card style={{marginTop: "5em"}}>
                <TabsContainer
                    panelClassName="md-grid"
                    labelAndIcon={true}
                    colored={true}
                >
                    <Tabs tabId="simple-tab">
                        <Tab label="Local Crime" icon={<FontIcon>warning</FontIcon>}>
                            <CrimeList/>
                        </Tab>
                        <Tab label="Bike Crime" icon={<FontIcon>directions_bike</FontIcon>}>
                            <BikeList/>
                        </Tab>
                    </Tabs>
                </TabsContainer>
            </Card>
        </main>
    </div>);