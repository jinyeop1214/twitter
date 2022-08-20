import { authService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import React, { useState } from "react";
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
					autoFocus
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
