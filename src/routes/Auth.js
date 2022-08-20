import { authService } from "fbase";
import React from "react";
import {
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import AuthForm from "components/AuthForm";

const Auth = () => {
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
		await signInWithPopup(authService, provider);
	};

	return (
		<div>
			<AuthForm />
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
