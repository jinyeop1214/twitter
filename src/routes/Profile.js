import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const navigate = useNavigate();

	const onLogOutClick = () => {
		signOut(authService);
		navigate("/", { replace: true });
	};

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewDisplayName(value);
	};

	// useEffect(() => {
	// 	const getMyTweets = async () => {
	// 		const myTweetsQuery = query(
	// 			collection(dbService, "tweets"),
	// 			where("creatorId", "==", userObj.uid),
	// 			orderBy("createdAt", "desc")
	// 		);
	// 		const querySnapshot = await getDocs(myTweetsQuery);
	// 		querySnapshot.forEach((doc) => {
	// 			console.log(doc.id, "=>", doc.data());
	// 		});
	// 	};

	// 	getMyTweets();
	// }, [userObj.uid]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newDisplayName && newDisplayName !== "") {
			await updateProfile(authService.currentUser, {
				displayName: newDisplayName,
			});
			refreshUser();
		}
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Display name"
					value={newDisplayName}
					onChange={onChange}
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
