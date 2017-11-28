import * as React from "react";
import {
    Card,
    Button,
    CardTitle,
    CardText,
    List,
    ListItem,
    CardActions,
    ListItemProps,
} from "react-md";
import {IAddress} from "../interfaces/Address";
import {INeighbourhood} from "../interfaces/Neighbourhood";

/**
 * Extends the ListItem to also define an href.
 */
interface LinkedListItemProps extends ListItemProps {
    href: string;
    newtab?: boolean;
}

interface IPostCodeDataState {
    nearby: any[],
    neighbourhood: INeighbourhood | null,
    address: IAddress | null
}

export interface IPostCodeDataProps {
    postcode: string
}

/**
 * PostCodeData shows data about a specific location.
 */
export class PostCodeData extends React.Component<IPostCodeDataProps, IPostCodeDataState> {

    /**
     * Creates a new instance of the PostCodeData component.
     * @param props The properties for the component.
     */
    constructor(props: { postcode: string }) {
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
     * @param {Readonly<P>} nextProps
     */
    public componentWillReceiveProps(nextProps) {

        console.log("new props", nextProps, this.props)
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
        const request = await fetch(`/api/nearby/${postcode}`);
        this.setState({nearby: await request.json()})
    };

    /**
     * Gets the data for a given postcode.
     * @param {string} postcode The postcode to look up.
     * @returns {Promise<void>} Returns nothing.
     */
    private getLocalDataForPostcode = async (postcode: string) => {
        const address = fetch(`/api/postcode/${postcode}`);
        const neighbourhood = fetch(`/api/neighbourhood/${postcode}`);

        const address_json = await (await address).json();
        const neighbourhood_json = await (await neighbourhood).json();

        this.setState({
            address: address_json.message ? null : address_json,
            neighbourhood: neighbourhood_json.message ? null : neighbourhood_json,
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

    /**
     * Creates LinkedListItems for each nearby wikipedia entry.
     * @type {HTMLElement[]}
     */
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
 * A hyperlinked list item.
 */
const HyperLinkListItem = (props: LinkedListItemProps) => (
    <a href={props.href} style={{color: "inherit", textDecoration: "inherit"}}
       target={props.newtab ? "_blank" : undefined}>
        <ListItem {...props} />
    </a>
);

/**
 * Displays information about a police neighbourhood.
 * @param props The props for the component.
 * @constructor
 */
const PoliceInfo = (props: { neighbourhood: any }) => {

    const showExtra = props.neighbourhood.locations.length > 0;

    const locations = props.neighbourhood.locations.map((location, index) => (
        <Card>
            <CardTitle title={location.name} subtitle={location.type}/>
        </Card>
    ));

    let twitter_handle;

    if (props.neighbourhood.twitter) {
        const twitter_parts = props.neighbourhood.twitter.split("/");
        twitter_handle = twitter_parts.pop() || twitter_parts.pop(); // trailing slash
    }

    let facebook_handle;

    if (props.neighbourhood.facebook) {
        const facebook_parts = props.neighbourhood.facebook.split("/");
        facebook_handle = facebook_parts.pop() || facebook_parts.pop(); // trailing slash
    }

    const parsed_text = document.createElement("div");
    parsed_text.innerHTML = props.neighbourhood.description;

    return (
        <Card style={{marginTop: "2em"}}>
            <CardTitle title="Local Police" subtitle={`${props.neighbourhood.name}`}/>
            {props.neighbourhood.description ? <CardText><p>{parsed_text.innerText}</p></CardText> : null}
            <CardActions
                expander={showExtra}
                className="md-divider-border md-divider-border--top md-divider-border--bottom"
            >
                {props.neighbourhood.email ?
                    <Button icon={true} href={`mailto:${props.neighbourhood.email}`}>mail</Button> : null}
                {props.neighbourhood.telephone ?
                    <Button icon={true} href={`tel:${props.neighbourhood.telephone}`}>phone</Button> : null}
                {props.neighbourhood.twitter ?
                    <Button flat={true} href={`https://www.twitter.com/${twitter_handle}`}>twitter</Button> : null}
                {props.neighbourhood.facebook ?
                    <Button flat={true} href={`https://www.facebook.com/${facebook_handle}`}>facebook</Button> : null}
            </CardActions>
            {showExtra ? <CardText expandable={true}>{locations}</CardText> : null}
        </Card>
    )
};
