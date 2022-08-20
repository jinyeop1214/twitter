import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setUserObj(user);
				if (!user.displayName)
					user.displayName = user.email.split("@")[0];
			}
			setInit(true);
		});
	}, []);

	const refreshUser = () => {
		// await updateCurrentUser(authService, authService.currentUser);
		// setUserObj(authService.currentUser);
		setUserObj({ ...authService.currentUser });
	};

	return (
		<>
			{init ? (
				<AppRouter
					isLoggedIn={Boolean(userObj)}
					userObj={userObj}
					refreshUser={refreshUser}
				/>
			) : (
				"Initializing..."
			)}
			{/* <footer>&copy; Twitter {new Date().getFullYear()}</footer> */}
		</>
	);
}

export default App;
