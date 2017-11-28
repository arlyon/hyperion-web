import * as React from "react";
import {Button, Toolbar, Card, Tab, Tabs, TabsContainer, FontIcon, Snackbar, DialogContainer} from "react-md";

import {CrimeList} from "./components/Crime";
import {SearchBox} from "./components/SearchBox";
import {BikeList} from "./components/BikeList";
import POSTCODES from "./data/postcodes";
import './style/main.styl';
import {PostCodeData} from "./components/PostCodeData";

interface IAppState {
    postcode: string | null,
    toasts: any[],
    showInfo: boolean,
    autoHide: boolean,
    online: boolean
}

export class App extends React.Component<{}, IAppState> {

    /**
     * Called to construct the app class.
     * @param {{}} props
     */
    constructor(props: {}) {
        super(props);

        this.state = {
            postcode: null,
            toasts: [],
            showInfo: false,
            autoHide: false,
            online: navigator.onLine
        };

        window.addEventListener("offline", () => {
            this.setState({online: false});
            this.addToast("Connection lost. Functionality will be limited.");
        });

        window.addEventListener("online", () => {
            this.setState({online: true});
            this.addToast("Reconnected. Functionality restored.");
        })
    }

    public componentDidMount() {
        if (!navigator.onLine) {
            this.addToast("Looks like you're offline. Functionality will be limited.");
        }
    }

    private reconnect = () => {
        if (navigator.onLine) {
            this.addToast("Reconnected");
        } else {
            this.addToast("Couldn't reconnect.", {children: "Try Again", onClick: this.reconnect}, false);
        }
    };

    private addToast = (text: string, action?: { children: string, onClick: any }, autoHide = true) => {
        this.setState((state) => {
            const toasts = state.toasts.slice();
            toasts.push({text, action});
            return {toasts, autoHide};
        });
    };

    private updatePostcode = (postcode: string) => {
        this.setState({postcode,})
    };

    private dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({toasts})
    };

    private showInfo = () => {
        this.setState({showInfo: true})
    };

    private hideInfo = () => {
        this.setState({showInfo: false})
    };

    public render() {
        return (

            <div id="app">
                <Toolbar
                    colored={true}
                    title="Crime Checker"
                    actions={<Button icon={true} onClick={this.showInfo}>info</Button>}
                    component="nav"
                />
                <DialogContainer
                    id="info-box"
                    visible={this.state.showInfo}
                    title="More Information"
                    onHide={this.hideInfo}
                    initialFocus="info-box"
                >
                    <p>
                        This app uses a set of APIs allow a user to quickly
                        determine the amount of crime in their local area. To begin, enter a postcode
                        into the box, and it will begin to suggest postcodes to you.
                    </p>
                    <h4><b>Web APIs Used</b></h4>
                    <ul>
                        <li>postcodes.io</li>
                        <li>data.police.uk</li>
                        <li>bikeregister.com</li>
                        <li>wikipedia.com</li>
                        <li>twitter rss feeds</li>
                    </ul>
                    <h4><b>Frontend Technologies</b></h4>
                    <ul>
                        <li>typescript</li>
                        <li>react ui library</li>
                        <li>react-md component library</li>
                        <li>webpack build tool</li>
                        <li>stylus</li>
                    </ul>
                    <h4><b>Backend Technologies</b></h4>
                    <ul>
                        <li>flask micro-framework</li>
                        <li>peewee orm library</li>
                        <li>requests - http for humans</li>
                        <li>beautifulsoup 4</li>
                    </ul>
                </DialogContainer>
                <main>
                    <h1 id="title" className="title">Find Crime Near You</h1>
                    <SearchBox regions={POSTCODES} foundValid={this.updatePostcode} online={this.state.online}/>
                    {this.state.postcode ? <PostCodeData postcode={this.state.postcode}/> : null}
                    <Card className="data">
                        <TabsContainer
                            panelClassName="md-grid"
                            labelAndIcon={true}
                            colored={true}
                        >
                            <Tabs tabId="simple-tab">
                                <Tab label="Local Crime" icon={<FontIcon>fingerprint</FontIcon>}>
                                    <CrimeList postcode = {this.state.postcode}/>
                                </Tab>
                                <Tab label="Bike Crime" icon={<FontIcon>directions_bike</FontIcon>}>
                                    <BikeList postcode={this.state.postcode}/>
                                </Tab>
                            </Tabs>
                        </TabsContainer>
                    </Card>
                </main>
                <Snackbar
                    id="example"
                    toasts={this.state.toasts}
                    autohide={this.state.autoHide}
                    onDismiss={this.dismissToast}
                />
            </div>
        );
    }
}
