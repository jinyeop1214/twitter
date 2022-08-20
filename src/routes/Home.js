import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		const tweetsQuery = query(
			collection(dbService, "tweets"),
			orderBy("createdAt", "desc")
		);
		onSnapshot(tweetsQuery, (snapshot) => {
			const tweetsArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTweets(tweetsArr);
		});
	}, []);

	return (
		<div className="container">
			<TweetFactory userObj={userObj} />
			<div style={{ marginTop: 30 }}>
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
