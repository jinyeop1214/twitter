import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import {
	collection,
	addDoc,
	getDocs,
	onSnapshot,
	doc,
} from "firebase/firestore";

const Home = ({ userObj }) => {
	const [tweet, setTweet] = useState("");
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		// const getNweets = async () => {
		// 	const dbTweets = await getDocs(collection(dbService, "tweets"));
		// 	let tweetsArr = [];
		// 	dbTweets.forEach((document) => {
		// 		tweetsArr.push({
		// 			...document.data(),
		// 			id: document.id,
		// 		});
		// 	});
		// 	setTweets(tweetsArr);
		// };
		// getNweets();

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
					<div key={tweet.id}>
						<h4>{tweet.text}</h4>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
