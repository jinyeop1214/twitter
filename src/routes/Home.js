import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
	const [tweet, setTweet] = useState("");
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

	const onSubmit = async (e) => {
		e.preventDefault();
		if (tweet.length === 0) return;
		let text = tweet;
		setTweet("");
		await addDoc(collection(dbService, "tweets"), {
			text,
			createdAt: Date.now(),
			creatorId: userObj.uid,
		});
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
					value={tweet}
					onChange={onChange}
				/>
				<input type="submit" value="Tweet" />
			</form>
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
