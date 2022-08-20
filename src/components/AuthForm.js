import React, { useState } from "react";
import { authService } from "fbase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
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
			if (newAccount) {
				await createUserWithEmailAndPassword(
					authService,
					email,
					password
				);
			} else {
				await signInWithEmailAndPassword(authService, email, password);
			}
		} catch (error) {
			console.log(error.message);
			setError(error.message);
		}
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);

	return (
		<>
			<form onSubmit={onSubmit} className="container">
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
					className="authInput"
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
					className="authInput"
				/>
				<input
					type="submit"
					className="authInput authSubmit"
					value={newAccount ? "Create Account" : "Sign In"}
				/>
				{error && <span className="authError">{error}</span>}
			</form>
			<span onClick={toggleAccount} className="authSwitch">
				{newAccount ? "Sign In" : "Create Account"}
			</span>
		</>
	);
};

export default AuthForm;
