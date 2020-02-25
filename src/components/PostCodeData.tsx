import * as React from "react";
import {Button, Card, CardActions, CardText, CardTitle, FontIcon, List, Tab, Tabs, TabsContainer,} from "react-md";
import {IAddress} from "../interfaces/Address";
import {IBikeTheft} from "../interfaces/BikeTheft";
import {CrimeData} from "../interfaces/Crime";
import {INeighbourhood} from "../interfaces/Neighbourhood";
import {BikeList} from "./BikeList";
import {CrimeList} from "./CrimeList";
import {HyperLinkListItem} from "./HyperLinkListItem";
import {Twitter} from "./Twitter";

/**
 * The props for postcode data.
 */
export interface IPostCodeDataProps {
    postcode: string | null
}

/**
 * The state for the post code data props.
 */
interface IPostCodeDataState {
    nearby: any[] | null,
    neighbourhood: INeighbourhood | null,
    address: IAddress | null,
    crimes: CrimeData[] | null,
    bikes: IBikeTheft[] | null,
}

/**
 * Given a postcode, lists data about the local area.
 */
export class PostCodeData extends React.Component<IPostCodeDataProps, IPostCodeDataState> {

    /**
     * Creates a new instance of the PostCodeData component.
     * @param props The properties for the component.
     */
    constructor(props: IPostCodeDataProps) {
        super(props);

        this.state = {
            nearby: null,
            neighbourhood: null,
            address: null,
            crimes: null,
            bikes: null,
        };

        if (this.props.postcode) {
            this.fetchNearbyLocations(this.props.postcode);
            this.fetchLocalDataForPostcode(this.props.postcode);
            this.fetchBikes(this.props.postcode);
            this.fetchCrimes(this.props.postcode);
        }
    }

    /**
     * Checks for a change in post code and updates the data if it is needed.
     * @param next The new props.
     */
    public componentWillReceiveProps(next: IPostCodeDataProps) {
        if (next.postcode === null) {
            this.setState({
                nearby: null,
                neighbourhood: null,
                address: null,
                bikes: null,
                crimes: null,
            })
        } else {
            if (this.props.postcode !== next.postcode) {
                this.fetchNearbyLocations(next.postcode);
                this.fetchLocalDataForPostcode(next.postcode);
                this.fetchCrimes(next.postcode);
                this.fetchBikes(next.postcode);
            }
        }
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchCrimes = async (postcode: string) => {
        const response = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/crime/`);
        this.setState({crimes: response.status == 200 ? await response.json() : []});
    };

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchBikes = async (postcode: string) => {
        const response = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/bikes/1.6/`);
        this.setState({bikes: response.status == 200 ? await response.json() : []})
    };

    /**
     * Gets nearby locations from wikipedia and sets the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchNearbyLocations = async (postcode: string) => {
        const request = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/nearby/`);
        this.setState({nearby: request.status == 200 ? await request.json() : []})
    };

    /**
     * Gets the data for a given postcode.
     * @param {string} postcode The postcode to look up.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchLocalDataForPostcode = async (postcode: string) => {
        const address_request = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/`);
        const neighbourhood_request = await fetch(`${process.env.API_URL}/api/postcode/${postcode}/neighbourhood/`);

        const address = address_request.status == 200 ? await address_request.json() : null;
        const neighbourhood = neighbourhood_request.status == 200 ? await neighbourhood_request.json() : null;

        this.setState({address, neighbourhood,})
    };

    /**
     * Renders the LocalInfo and PoliceInfo components if there is data for them.
     * @returns {HTMLElement} The markup for the component.
     */
    public render() {
        return (
            <section id="postcode-data">
                {this.state.address && this.state.nearby ?
                    <LocalInfo address={this.state.address} nearby={this.state.nearby}/> : null}
                {this.state.neighbourhood ? <PoliceInfo neighbourhood={this.state.neighbourhood}/> : null}
                {this.state.crimes || this.state.crimes ? <Card>
                    <TabsContainer
                        panelClassName="md-grid"
                        labelAndIcon={true}
                        colored={true}
                    >
                        <Tabs tabId="simple-tab">
                            <Tab label="Local Crime" icon={<FontIcon>fingerprint</FontIcon>}>
                                <CrimeList crimes={this.state.crimes}/>
                            </Tab>
                            <Tab label="Bike Crime" icon={<FontIcon>directions_bike</FontIcon>}>
                                <BikeList bikes={this.state.bikes}/>
                            </Tab>
                        </Tabs>
                    </TabsContainer>
                </Card> : null}
            </section>
        )
    }
}

/**
 * Displays information about a postcode area.
 * @param props The properties for the component.
 * @returns {HTMLElement} The markup for the component.
 */
const LocalInfo = (props: { address: IAddress | null, nearby: any[] | null }) => {

    const nearby = props.nearby?.map((item, index) => (
        <HyperLinkListItem
            key={index}
            primaryText={item.title}
            secondaryText={`${item.dist} meters away`}
            href={`https://en.wikipedia.org/?curid=${item.pageid}`}
            newtab={true}
        />
    ));

    return (
        <Card>
            <CardTitle
                title={props.address?.zone}
                subtitle={props.address?.district}
            />
            <CardActions
                expander={props.nearby !== null}
                className="md-divider-border md-divider-border--top md-divider-border--bottom"
            >
                <Button
                    flat={true}
                    href={`http://maps.google.com/maps?q=${props.address?.lat},${props.address?.long}`}
                >
                    View on Google Maps
                </Button>
            </CardActions>
            {props.nearby?.length ? <CardText expandable={true}><List>{nearby!}</List></CardText> : null}
        </Card>
    )
};

interface IPoliceInfoProps {
    neighbourhood: any
}

/**
 * Displays information about a police neighbourhood.
 * @param props The props for the component.
 */
class PoliceInfo extends React.Component<IPoliceInfoProps, { tweets: any[] }> {
    constructor(props: IPoliceInfoProps) {
        super(props);

        this.state = {
            tweets: []
        };

        const twitter_handle = PoliceInfo.getHandle(this.props.neighbourhood.twitter);
        if (twitter_handle) this.fetchData(twitter_handle);
    }

    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData(twitterHandle: string) {
        const response = await fetch(`${process.env.API_URL}/api/twitter/${twitterHandle}/`);
        this.setState({tweets: response.status == 200 ? await response.json() : []})
    }

    /**
     * Given a url with a facebook/twitter handle, returns the handle.
     * @param {string} url The url to parse.
     * @returns {string} The facebook handle.
     */
    private static getHandle(url: string): string | null {
        if (url) {
            const parts = url.split("/");
            const handle = parts.pop() || parts.pop(); // trailing slash
            return handle ? handle : null // handle could be undefined. if it is set it to null
        }
        return null;
    }

    /**
     * Given some input html, it creates a dom element
     * and gets the innerText, wiping out the html tags.
     * @param {string} html The html to strip.
     * @returns {string} The cleaned text.
     */
    private static cleanHTMLTags(html: string) {
        const parsed_text = document.createElement("div");
        parsed_text.innerHTML = html;
        return parsed_text.innerText
    }

    /**
     * Called when the component get its props.
     * @param next The next props.
     */
    public componentWillReceiveProps(next: IPoliceInfoProps) {
        if (next.neighbourhood.twitter !== this.props.neighbourhood.twitter) {
            if (next.neighbourhood.twitter === null) {
                this.setState({tweets: []})
            } else {
                const twitter_handle = PoliceInfo.getHandle(next.neighbourhood.twitter);
                if (twitter_handle) this.fetchData(twitter_handle);
            }
        }
    }

    /**
     * Renders the html for the component.
     * @returns {any} The markup for the component.
     */
    public render() {
        const facebook_handle = PoliceInfo.getHandle(this.props.neighbourhood.facebook);
        const twitter_handle = PoliceInfo.getHandle(this.props.neighbourhood.twitter);

        const description = this.props.neighbourhood.description ?
            <CardText><p>{PoliceInfo.cleanHTMLTags(this.props.neighbourhood.description)}</p></CardText> :
            null;

        const email_button = this.props.neighbourhood.email ?
            <Button icon={true} href={`mailto:${this.props.neighbourhood.email}`}>mail</Button> :
            null;

        const phone_button = this.props.neighbourhood.telephone ?
            <Button icon={true} href={`tel:${this.props.neighbourhood.telephone}`}>phone</Button> :
            null;

        const twitter_button = twitter_handle ?
            <Button flat={true} href={`https://www.twitter.com/${twitter_handle}`}>twitter</Button> :
            null;

        const facebook_button = facebook_handle ?
            <Button flat={true} href={`https://www.facebook.com/${facebook_handle}`}>facebook</Button> :
            null;

        const twitter_feed = this.state.tweets.length ? (
            <section>
                <h1 className="center bold">Recent Twitter Posts</h1>
                <Twitter tweets={this.state.tweets}/>
            </section>
        ) : null;

        const locations_list = this.props.neighbourhood.locations.map((location, index) => (
            <Card key={index}>
                <CardTitle title={location.name} subtitle={location.type}/>
            </Card>
        ));

        const locations = locations_list.length ? (
            <section>
                <h1 className="center bold">Local Police Locations</h1>
                {locations_list}
            </section>
        ) : null;


        return (
            <Card className="policeneighbourhood">
                <CardTitle title="Local Police" subtitle={`${this.props.neighbourhood.name}`}/>
                {description}
                <CardActions
                    expander={!!locations_list.length || !!this.state.tweets.length}
                    className="md-divider-border md-divider-border--top md-divider-border--bottom"
                >
                    {email_button}
                    {phone_button}
                    {twitter_button}
                    {facebook_button}
                </CardActions>
                <CardText expandable={true}>
                    {twitter_feed}
                    {locations}
                </CardText>
            </Card>
        )
    }
}
