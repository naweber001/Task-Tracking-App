import { createContext, useContext } from 'react';
import { T } from './constants';

export const Ctx = createContext(T.light);
export const useT = () => useContext(Ctx);
