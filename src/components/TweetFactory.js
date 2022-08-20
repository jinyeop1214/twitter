import React, { useState, useRef } from "react";
import { dbService, storageService } from "fbase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
	const [tweet, setTweet] = useState("");
	const [attachment, setAttachment] = useState("");
	const fileInput = useRef();

	const onSubmit = async (e) => {
		e.preventDefault();
		if (tweet === "") return;
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
		<form onSubmit={onSubmit} className="factoryForm">
			<div className="factoryInput__container">
				<input
					className="factoryInput__input"
					value={tweet}
					onChange={onChange}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input
					type="submit"
					value="&rarr;"
					className="factoryInput__arrow"
				/>
			</div>
			<label htmlFor="attach-file" className="factoryInput__label">
				<span>Add photos</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>
			<input
				id="attach-file"
				type="file"
				accept="image/*"
				onChange={onFileChange}
				ref={fileInput}
				style={{
					opacity: 0,
				}}
			/>
			{attachment !== "" && (
				<div className="factoryForm__attachment">
					<img
						src={attachment}
						style={{
							backgroundImage: attachment,
						}}
						alt="preview"
					/>
					<div
						className="factoryForm__clear"
						onClick={onClearAttachment}
					>
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			)}
		</form>
	);
};

export default TweetFactory;
