import * as React from "react";
import List from "react-md/lib/Lists/List";
import Avatar from "react-md/lib/Avatars/Avatar";
import {HyperLinkListItem} from "./HyperLinkListItem";

//create a new component to display the information about the twitter rss

export const Twitter = (props: {tweets}) => {
    const tweets = props.tweets
            .map((tweet, index) => (
                <HyperLinkListItem
                    leftAvatar={<Avatar src={tweet.image}/>}
                    primaryText={tweet.author.replace("(", "").replace(")", "")}
                    secondaryText={tweet.title}
                    threeLines={true}
                    key={index}
                    href={tweet.link}
                    newtab={true}
                    primaryTextClassName="bold"
                />
            ));

        return (
            <List>
                {tweets}
            </List>
        )
};
