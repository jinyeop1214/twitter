import { authService } from "fbase";
import React, { useState } from "react";
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState("");

	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let data;
			if (newAccount) {
				data = await createUserWithEmailAndPassword(
					authService,
					email,
					password
				);
			} else {
				data = await signInWithEmailAndPassword(
					authService,
					email,
					password
				);
			}
			console.log(data);
		} catch (error) {
			console.log("오류가발생하였습니다.");
			console.log(error.message);
			setError(error.message);
		}
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);

	const onSocialClick = async (e) => {
		const {
			target: { name },
		} = e;
		let provider;
		if (name === "google") {
			provider = new GoogleAuthProvider();
			provider.addScope("profile");
			provider.addScope("email");
		} else if (name === "github") {
			provider = new GithubAuthProvider();
			provider.addScope("repo");
		}
		const data = await signInWithPopup(authService, provider);
		console.log(data);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
				/>
				<input
					type="submit"
					value={newAccount ? "Create Account" : "Sign In"}
				/>
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Sign In" : "Create Account"}
			</span>
			<div>
				<button onClick={onSocialClick} name="google">
					Continue With Google
				</button>
				<button onClick={onSocialClick} name="github">
					Continue With GitHub
				</button>
			</div>
		</div>
	);
};

export default Auth;
