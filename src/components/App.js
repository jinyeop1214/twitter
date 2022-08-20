import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setUserObj(user);
				if (!user.displayName)
					user.displayName = user.email.split("@")[0];
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);

	const refreshUser = () => setUserObj({ ...authService.currentUser });

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
		</>
	);
}

export default App;
