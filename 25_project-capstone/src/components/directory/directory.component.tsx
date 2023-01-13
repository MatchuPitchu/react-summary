import type { ICategory } from '@/App';
import { CategoryItem } from '@/components/category-item/category-item.component';
import './directory.styles.scss';

interface IDirectoryProps {
	categories: ICategory[];
}

export const Directory = ({ categories }: IDirectoryProps) => {
	return (
		<div className="directory-container">
			{categories.map(({ id, title, imageUrl }) => (
				<CategoryItem key={id} title={title} imageUrl={imageUrl} />
			))}
		</div>
	);
};
