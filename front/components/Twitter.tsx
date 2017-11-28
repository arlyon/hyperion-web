import * as React from "react";
import List from "react-md/lib/Lists/List";
import Avatar from "react-md/lib/Avatars/Avatar";
import ListItem from "react-md/lib/Lists/ListItem";

//create a new component to display the information about the twitter rss

export class Twitter extends React.Component <{twitterHandle : string}, {tweets : any[]}> {
    constructor(props: { twitterHandle }) {
        super(props);
        this.state = {
            tweets : [],
        };

        if (this.props.twitterHandle) {
            this.fetchData(this.props.twitterHandle);
        }
    }


    /**
     * Fetches the data from the server and sets the received data in the state.
     * @returns {Promise<void>} Returns nothing.
     */
    private async fetchData(twitterHandle: string) {
        const response = await fetch(`/api/rss/${twitterHandle}`);
        this.setState({tweets: await response.json()})
    }

      public componentWillReceiveProps(nextProps) {
        if (nextProps.twitterHandle !== this.props.twitterHandle) { //new props object
            //If postcode is null
            if (nextProps.twitterHandle === null) {
                //Remove all displayed data by setting bike state to empty list
                this.setState({tweets: []})
            } //if its not null we want to display all information about that postcode
            this.fetchData(nextProps.twitterHandle);
        }
    }
    render() {

        const tweets = this.state.tweets
            .map((tweet, index) => <ListItem leftAvatar = {<Avatar src = {tweet.image}/>}
              primaryText = {tweet.author} secondaryText = {tweet.title}
              threeLines = {true}
              key={index} />);

        return (
            <List>
                {tweets}
            </List>
        )
    }
}
