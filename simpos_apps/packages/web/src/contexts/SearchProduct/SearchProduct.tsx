import React, { useContext, useEffect, useReducer } from 'react';
import { Product, productRepository } from '../../services/db';

export interface SearchProductState {
  categoryId?: number;
  keyword: string;
  products: Product[];
}

export type SearchProductAction =
  | { type: 'CATEGORY_CHANGED'; payload: number | undefined }
  | { type: 'KEYWORD_CHANGED'; payload: string }
  | { type: 'PRODUCTS_FOUND'; payload: Product[] };

export type SearchProductDispatch = (action: SearchProductAction) => void;

const initialState: SearchProductState = {
  categoryId: undefined,
  keyword: '',
  products: [],
};

const SearchProductStateContext = React.createContext<SearchProductState>(
  initialState,
);

const SearchProductDispatchContext = React.createContext<
  SearchProductDispatch | undefined
>(undefined);

export function searchProductReducer(
  state: SearchProductState,
  action: SearchProductAction,
): SearchProductState {
  switch (action.type) {
    case 'CATEGORY_CHANGED':
      return {
        ...state,
        categoryId: action.payload,
      };
    case 'KEYWORD_CHANGED':
      return {
        ...state,
        keyword: action.payload,
      };
    case 'PRODUCTS_FOUND':
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
}

export const SearchProductProvider: React.FunctionComponent = ({
  children,
}) => {
  const [state, dispatch] = useReducer(searchProductReducer, initialState);
  const findProducts = async (categoryId?: number, keyword = '') => {
    const foundProducts = await productRepository.findProducts(
      categoryId,
      keyword,
    );
    dispatch({ type: 'PRODUCTS_FOUND', payload: foundProducts });
  };
  useEffect(() => {
    findProducts(state.categoryId, state.keyword);
  }, [state.categoryId, state.keyword]);

  return (
    <SearchProductStateContext.Provider value={state}>
      <SearchProductDispatchContext.Provider value={dispatch}>
        {children}
      </SearchProductDispatchContext.Provider>
    </SearchProductStateContext.Provider>
  );
};

export function useSearchProductState(): SearchProductState {
  const context = useContext(SearchProductStateContext);
  if (!context) {
    throw new Error(
      'useSearchProductState must be inside a SearchProductProvider',
    );
  }
  return context;
}

export function useSearchProductDispatch(): SearchProductDispatch {
  const context = useContext(SearchProductDispatchContext);
  if (!context) {
    throw new Error(
      'useSearchProductDispatch must be inside a SearchProductProvider',
    );
  }
  return context;
}
