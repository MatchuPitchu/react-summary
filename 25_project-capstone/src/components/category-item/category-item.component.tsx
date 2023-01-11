import './category-item.styles.scss';

interface ICategoryItemProps {
	title: string;
	imageUrl: string;
}

export const CategoryItem = ({ title, imageUrl }: ICategoryItemProps) => {
	return (
		<div className="category-container">
			{/* <img src="" alt="" /> */}
			<div className="background-image" style={{ backgroundImage: `url(${imageUrl})` }} />
			<div className="category-body-container">
				<h2>{title}</h2>
				<p>Shop Now</p>
			</div>
		</div>
	);
};
