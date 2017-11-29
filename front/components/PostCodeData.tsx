import * as React from "react";
import {
    Card,
    Button,
    CardTitle,
    CardText,
    List,
    CardActions,
} from "react-md";
import {IAddress} from "../interfaces/Address";
import {INeighbourhood} from "../interfaces/Neighbourhood";
import {Twitter} from "./Twitter";
import {HyperLinkListItem} from "./HyperLinkListItem";
import config from "../config";

/**
 * The props for postcode data.
 */
export interface IPostCodeDataProps {
    postcode: string
}

/**
 * The state for the post code data props.
 */
interface IPostCodeDataState {
    nearby: any[],
    neighbourhood: INeighbourhood | null,
    address: IAddress | null
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
            nearby: [],
            neighbourhood: null,
            address: null
        };

        if (this.props.postcode) {
            this.fetchNearbyLocations(this.props.postcode);
            this.getLocalDataForPostcode(this.props.postcode);
        }
    }

    /**
     * Checks for a change in post code and clears or
     * updates the data if it is needed.
     * @param {Readonly<P>} nextProps The next props.
     */
    public componentWillReceiveProps(nextProps) {
        if (this.props.postcode !== nextProps.postcode) {
            if (nextProps.postcode === null) {
                this.setState({
                    neighbourhood: null,
                    address: null
                })
            } else {
                this.fetchNearbyLocations(nextProps.postcode);
                this.getLocalDataForPostcode(nextProps.postcode);
            }
        }
    }

    /**
     * Gets nearby locations from wikipedia and sets the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchNearbyLocations = async (postcode: string) => {
        const request = await fetch(`${config.apiRoot}/api/nearby/${postcode}`);
        this.setState({nearby: await request.json()})
    };

    /**
     * Gets the data for a given postcode.
     * @param {string} postcode The postcode to look up.
     * @returns {Promise<void>} Returns nothing.
     */
    private getLocalDataForPostcode = async (postcode: string) => {
        const address_request = fetch(`${config.apiRoot}/api/postcode/${postcode}`);
        const neighbourhood_request = fetch(`${config.apiRoot}/api/neighbourhood/${postcode}`);

        const address = await (await address_request).json();
        const neighbourhood = await (await neighbourhood_request).json();

        this.setState({
            address: address.message ? null : address,
            neighbourhood: neighbourhood.message ? null : neighbourhood,
        })
    };

    /**
     * Renders the LocalInfo and PoliceInfo components if there is data for them.
     * @returns {HTMLElement} The markup for the component.
     */
    public render() {
        return (
            <div id="postcodedata">
                {this.state.address ? <LocalInfo address={this.state.address} nearby={this.state.nearby}/> : null}
                {this.state.neighbourhood ? <PoliceInfo neighbourhood={this.state.neighbourhood}/> : null}
            </div>
        )
    }
}

/**
 * Displays information about a postcode area.
 * @param props The properties for the component.
 * @returns {HTMLElement} The markup for the component.
 */
const LocalInfo = (props: { address: IAddress, nearby: any[] }) => {

    const nearby = props.nearby.map((item, index) => (
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
                title={props.address.zone}
                subtitle={props.address.district}
            />
            <CardActions
                expander={props.nearby !== null}
                className="md-divider-border md-divider-border--top md-divider-border--bottom"
            >
                <Button
                    flat={true}
                    href={`http://maps.google.com/maps?q=${props.address.lat},${props.address.long}`}
                >
                    View on Google Maps
                </Button>
            </CardActions>
            {props.nearby ? <CardText expandable={true}><List>{nearby}</List></CardText> : null}
        </Card>
    )
};

/**
 * Displays information about a police neighbourhood.
 * @param props The props for the component.
 */
class PoliceInfo extends React.Component<{ neighbourhood: any }, { tweets: any[] }> {
    constructor(props: { neighbourhood: any }) {
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
        const response = await fetch(`${config.apiRoot}/api/rss/${twitterHandle}`);
        this.setState({tweets: await response.json()})
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
            return  handle ? handle : null // handle could be undefined. if it is set it to null
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
     * @param {Readonly<P>} nextProps The next props.
     */
    public componentWillReceiveProps(nextProps) {
        if (nextProps.neighbourhood.twitter !== this.props.neighbourhood.twitter) {
            if (nextProps.neighbourhood.twitter === null) {
                this.setState({tweets: []})
            } else {
                const twitter_handle = PoliceInfo.getHandle(nextProps.neighbourhood.twitter);
                if (twitter_handle) this.fetchData(twitter_handle);
            }
        }
    }

    /**
     * Renders the html for the component.
     * @returns {any} The markup for the component.
     */
    public render() {
        const facebook_handle = PoliceInfo.getHandle(this.props.neighbourhood.facebook)
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
