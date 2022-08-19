import { authService } from "fbase";
import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const navigate = useNavigate();
	const onLogOutClick = () => {
		signOut(authService);
		// navigate("/");
		navigate("/", { replace: true });
	};
	return (
		<>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
