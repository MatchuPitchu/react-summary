// recommended pattern for redux with TypeScript
// create predefined versions of React Redux hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './index';

// add types to react redux hooks
// -> in components you're importing these predefined hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
