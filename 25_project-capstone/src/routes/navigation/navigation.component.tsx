import { Outlet, Link } from 'react-router-dom';
// importing SVG as a component works in Vite with vite-plugin-svgr
import { ReactComponent as Logo } from '@/assets/crown.svg';
import './navigation.styles.scss';

export const Navigation = () => {
	return (
		<>
			<nav className="navigation">
				<Link className="logo" to="/">
					<Logo className="logo__svg" />
				</Link>
				<div className="navigation__links-container">
					<Link className="navigation__link" to="/shop">
						Shop
					</Link>
					<Link className="navigation__link" to="/sign-in">
						Sign In
					</Link>
				</div>
			</nav>
			{/* Outlet contains content of nested route components (-> App.tsx) */}
			<Outlet />
		</>
	);
};
