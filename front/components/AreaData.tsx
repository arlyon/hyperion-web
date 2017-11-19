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

interface AreaDataProps {
    address: IAddress | null,
    neighbourhood: INeighbourhood | null
}

/**
 * AreaData shows data about a specific location.
 */
export class AreaData extends React.Component<AreaDataProps, { nearby: any[] }> {

    /**
     * Creates a new instance of the AreaData component.
     * @param {AreaDataProps} props The properties for the component.
     */
    constructor(props: AreaDataProps) {
        super(props);
        this.state = {
            nearby: []
        }
    }

    /**
     * Finds nearby locations when the component loads.
     */
    public componentDidMount() {
        this.fetchNearbyLocations();
    }

    /**
     * Gets nearby locations from wikipedia and sets the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private fetchNearbyLocations = async () => {
        if (this.props.address) {
            const request = await fetch(`/api/nearby/${this.props.address.postcode}`);
            const nearby = await request.json();
            this.setState({nearby,})
        }
    };

    /**
     * Renders the LocalInfo and PoliceInfo components if there is data for them.
     * @returns {HTMLElement} The markup for the component.
     * TODO: clean up the props
     */
    public render() {
        return (
            <div>
                {this.props.address ? <LocalInfo neighbourhood={this.props.neighbourhood} address={this.props.address} nearby={this.state.nearby} />: null}
                {this.props.neighbourhood ? <PoliceInfo neighbourhood={this.props.neighbourhood} address={this.props.address} nearby={this.state.nearby} />: null}
            </div>
        )
    }
}

/**
 * Extends the ListItem to also define an href.
 */
interface LinkedListItemProps extends ListItemProps {
    href: string;
    newtab?: boolean;
}

/**
 * Displays information about a postcode area.
 * @param props The properties for the component.
 * @returns {HTMLElement} The markup for the component.
 * TODO: revise the prop interface
 */
const LocalInfo = (props: {neighbourhood: any, address: any, nearby: any}) => {

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
)};

/**
 * A hyperlinked list item.
 */
const HyperLinkListItem = (props: LinkedListItemProps) => (
    <a href={props.href} style={{color: "inherit", textDecoration: "inherit"}} target={props.newtab ? "_blank" : undefined}>
        <ListItem {...props} />
    </a>
);

/**
 * Displays information about a police neighbourhood.
 * @param props The props for the component.
 * @constructor
 */
const PoliceInfo = (props: {neighbourhood: any, address: any, nearby: any}) => {

    const showExtra = props.neighbourhood.locations.length > 0;

    const locations = props.neighbourhood.locations.map((location, index) => (
        <Card>
            <CardTitle title={location.name} subtitle={location.type} />
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

    return (
        <Card style={{marginTop:"2em"}}>
            <CardTitle title="Local Police" subtitle={`${props.neighbourhood.name}`}/>
            {props.neighbourhood.description ? <CardText><p>{props.neighbourhood.description}</p></CardText> : null}
            <CardActions expander={showExtra} className="md-divider-border md-divider-border--top md-divider-border--bottom">
                {props.neighbourhood.email ? <Button icon={true} href={`mailto:${props.neighbourhood.email}`}>mail</Button> : null}
                {props.neighbourhood.telephone ? <Button icon={true} href={`tel:${props.neighbourhood.telephone}`}>phone</Button> : null}
                {props.neighbourhood.twitter ? <Button flat={true} href={`https://www.twitter.com/${twitter_handle}`}>twitter</Button> : null}
                {props.neighbourhood.facebook ? <Button flat={true} href={`https://www.facebook.com/${facebook_handle}`}>facebook</Button> : null}
            </CardActions>
            {showExtra ? <CardText expandable={true}>{locations}</CardText> : null}
        </Card>
)};
