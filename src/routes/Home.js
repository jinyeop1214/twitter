import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		onSnapshot(collection(dbService, "tweets"), (snapshot) => {
			const tweetsArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTweets(tweetsArr);
		});
	}, []);

	return (
		<div>
			<TweetFactory userObj={userObj} />
			<div>
				{tweets.map((tweet) => (
					<Tweet
						key={tweet.id}
						tweetObj={tweet}
						isOwner={tweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
