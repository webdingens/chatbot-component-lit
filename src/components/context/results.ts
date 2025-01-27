import {createContext} from '@lit/context';

export type Results = {
  text: string;
  type: 'assistant' | 'user';
}[]

export const resultsContext = createContext<Results>('results');