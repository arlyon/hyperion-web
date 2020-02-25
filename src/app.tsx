import * as React from "react";
import {Button, DialogContainer, Snackbar, Toolbar} from "react-md";
import {SearchBox} from "./components/SearchBox";
import POSTCODES from "./data/postcodes";
import './style/main.styl';
import {PostCodeData} from "./components/PostCodeData";

/**
 * The state of the app.
 */
interface IAppState {
    postcode: string | null,
    toasts: any[],
    showInfo: boolean,
    autoHide: boolean,
    online: boolean
}

/**
 * The main entry point of the application.
 */
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
        });

        {
            const secret = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];
            let recentKeys: string[] = [];
            window.addEventListener("keydown", (event) => {
                if (secret[recentKeys.length] === event.key) recentKeys.push(event.key);
                else recentKeys = [];

                if (secret.length == recentKeys.length) {
                    console.log("Konami!");
                    recentKeys = [];
                }
            })
        }
    }

    /**
     * Lets the user know if they are offline.
     */
    public componentDidMount() {
        if (!navigator.onLine) {
            this.addToast("Looks like you're offline. Functionality will be limited.");
        }
    }

    /**
     * Passed into the search box and called to update the postcode.
     * @param postcode
     * @param valid
     */
    private updatePostcode = (postcode: string) => {
        this.setState({postcode,})
    };

    /**
     * Adds a new toast to the toast list.
     * @param {string} text The toast text.
     * @param {any} action An action button.
     * @param {boolean} autoHide Whether to auto hide.
     */
    private addToast = (text: string, action?: { children: string, onClick: any }, autoHide = true) => {
        this.setState((state) => {
            const toasts = state.toasts.slice();
            toasts.push({text, action});
            return {toasts, autoHide};
        });
    };

    /**
     * Called to remove a toast.
     */
    private dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({toasts})
    };

    /**
     * Shows the info dialog box.
     */
    private showInfo = () => {
        this.setState({showInfo: true})
    };

    /**
     * Hides the info dialog box.
     */
    private hideInfo = () => {
        this.setState({showInfo: false})
    };

    /**
     * Renders the html for the component.
     * @returns {any} The markup for the component.
     */
    public render() {
        return (
            <div id="app">
                <Toolbar
                    colored={true}
                    title="UK Crime Lookup"
                    actions={<Button icon={true} onClick={this.showInfo}>info</Button>}
                    component="nav"
                    fixed={true}
                />
                <DialogContainer
                    id="info-box"
                    visible={this.state.showInfo}
                    title="More Information"
                    onHide={this.hideInfo}
                    initialFocus="info-box"
                >
                    <p>
                        This app is a frontend for <a href="https://github.com/arlyon/hyperion">hyperion</a>,
                        a cli tool and api to quickly determine the amount of crime at a given postcode.
                    </p>
                    <h4><b>Frontend Technologies</b></h4>
                    <ul>
                        <li>typescript</li>
                        <li>react</li>
                        <li>react-md</li>
                        <li>webpack</li>
                        <li>stylus</li>
                    </ul>
                    <p>
                        Source code available <a href="https://github.com/arlyon/hyperion-web">on github</a>.
                    </p>
                </DialogContainer>
                <main>
                    <SearchBox regions={POSTCODES} updatePostcode={this.updatePostcode} online={this.state.online}/>
                    <PostCodeData postcode={this.state.postcode}/>
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
