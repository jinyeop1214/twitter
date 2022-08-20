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
		<div className="container">
			<form onSubmit={onSubmit} className="profileForm">
				<input
					type="text"
					placeholder="Display Name"
					value={newDisplayName}
					onChange={onChange}
					autoFocus
					className="formInput"
				/>
				<input
					type="submit"
					value="Update Profile"
					className="formBtn"
					style={{
						marginTop: 10,
					}}
				/>
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
				Log Out
			</span>
		</div>
	);
};

export default Profile;
