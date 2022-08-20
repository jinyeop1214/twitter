import { dbService, storageService } from "fbase";
import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
	const [tweet, setTweet] = useState("");
	const [tweets, setTweets] = useState([]);
	const [attachment, setAttachment] = useState("");
	const fileInput = useRef();

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
		let attachmentURL = "";

		if (attachment !== "") {
			const attachmentRef = ref(
				storageService,
				`${userObj.uid}/${uuidv4()}`
			);
			await uploadString(attachmentRef, attachment, "data_url");
			attachmentURL = await getDownloadURL(
				ref(storageService, attachmentRef)
			);
		}

		await addDoc(collection(dbService, "tweets"), {
			text: tweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentURL,
		});

		setTweet("");
		setAttachment("");
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value);
	};

	const onFileChange = (e) => {
		const {
			target: { files },
		} = e;
		const theFile = files[0];
		const reader = new FileReader();

		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};

		if (theFile) reader.readAsDataURL(theFile);
		else setAttachment("");
	};

	const onClearAttachment = () => {
		fileInput.current.value = null;
		setAttachment("");
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
				<input
					type="file"
					accept="image/*"
					onChange={onFileChange}
					ref={fileInput}
				/>
				<input type="submit" value="Tweet" />
				{attachment !== "" && (
					<div>
						<img
							src={attachment}
							alt="preview"
							width="50px"
							height="50px"
						/>
						<button onClick={onClearAttachment}>Clear</button>
					</div>
				)}
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
