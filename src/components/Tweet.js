import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "firebase/storage";

const Tweet = ({ tweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newTweet, setNewTweet] = useState(tweetObj.text);

	const onDeleteClick = async () => {
		const ok = window.confirm(
			"Are you sure you want to delete this tweet?"
		);
		if (ok) {
			try {
				const tweetDoc = doc(dbService, "tweets", `${tweetObj.id}`);
				if (tweetObj.attachmentURL !== "") {
					const attachmentURLRef = ref(
						storageService,
						tweetObj.attachmentURL
					);
					await deleteObject(attachmentURLRef);
				}
				await deleteDoc(tweetDoc);
			} catch (error) {
				alert("게시물 삭제에 실패하였습니다.");
				console.log(error);
			}
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const tweetDoc = doc(dbService, "tweets", `${tweetObj.id}`);
		await updateDoc(tweetDoc, { text: newTweet });
		setEditing(false);
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewTweet(value);
	};

	const toggleEditing = () => setEditing((prev) => !prev);

	return (
		<div>
			{editing ? (
				isOwner && (
					<>
						<form onSubmit={onSubmit}>
							<input
								type="text"
								placeholder="Edit your tweet"
								value={newTweet}
								onChange={onChange}
								required
							/>
							<input type="submit" value="Update Tweet" />
						</form>
						<button onClick={toggleEditing}>Cancel</button>
					</>
				)
			) : (
				<>
					<h4>{tweetObj.text}</h4>
					{tweetObj.attachmentURL !== "" && (
						<img
							src={tweetObj.attachmentURL}
							alt="post"
							width="50px"
							height="50px"
						/>
					)}
					{isOwner && (
						<>
							<button onClick={onDeleteClick}>
								Delete tweet
							</button>
							<button onClick={toggleEditing}>Edit tweet</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Tweet;
