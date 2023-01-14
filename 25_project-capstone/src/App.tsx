import { Routes, Route } from 'react-router-dom';
import { Home } from '@/routes/home/home.component';
import { Navigation } from '@/routes/navigation/navigation.component';
import { SignIn } from '@/routes/sign-in/sign-in.component';

const Shop = () => <h1>Shop</h1>;

const App = () => {
	return (
		<Routes>
			{/* pattern for Navigation rendering */}
			<Route path="/" element={<Navigation />}>
				{/* path={'home'} -> nested route path is relative to parent route */}
				{/* index={true} -> parent route path is taken */}
				<Route index element={<Home />} />
				<Route path="shop" element={<Shop />} />
				<Route path="sign-in" element={<SignIn />} />
			</Route>
		</Routes>
	);
};

export default App;
