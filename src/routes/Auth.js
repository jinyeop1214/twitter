import React, { useState } from "react";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
	};
	const onSubmit = (e) => {
		e.preventDefault();
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
				<input type="submit" value="Log In" />
			</form>
			<div>
				<button>Continue With Google</button>
				<button>Continue With GitHub</button>
			</div>
		</div>
	);
};

export default Auth;
