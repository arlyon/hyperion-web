import * as React from "react";
import Avatar from "react-md/lib/Avatars/Avatar";
import List from "react-md/lib/Lists/List";
import {HyperLinkListItem} from "./HyperLinkListItem";

/**
 * Given a list of tweets, displays them.
 * @param {{tweets}} props The props containing the list of tweets.
 * @returns {any} The markup for the component.
 */
export const Twitter = (props: { twitter: { user: any, tweets: any[] } }) => {
    const tweets = props.twitter.tweets
        .map((tweet, index) => (
            <HyperLinkListItem
                leftAvatar={<Avatar src={props.twitter.user.profile_image_url_https}/>}
                primaryText={props.twitter.user.name}
                secondaryText={tweet.text}
                threeLines={true}
                key={index}
                href={tweet.url}
                newtab={true}
                primaryTextClassName="bold"
            />
        ));
    return (<List>{tweets}</List>)
};
