import { useReducer } from 'react';
import { LabelState } from '../types/label';
import { DEFAULT_FONT } from '../constants/fonts';

const DEFAULT_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.5 7A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 8.5 7A1.5 1.5 0 0 1 7 8.5A1.5 1.5 0 0 1 5.5 7M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"/></svg>';

const initialState: LabelState = {
  width: 287,
  height: 67,
  text: 'Lablary',
  fontFamily: DEFAULT_FONT,
  fontSize: 35,
  fontWeight: 'bold',
  textColor: '#000000',
  iconPrefix: 'default',
  iconName: 'label',
  iconSvg: DEFAULT_ICON_SVG,
  iconColor: '#000000',
  layout: 'ICON_LEFT',
  backgroundColor: '#ffffff',
  padding: 10,
  borderRadius: 12,
};

type Action =
  | { type: 'SET_TEXT'; text: string }
  | { type: 'SET_FONT'; fontFamily: string }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'SET_FONT_WEIGHT'; fontWeight: 'regular' | 'bold' }
  | { type: 'SET_TEXT_COLOR'; color: string }
  | { type: 'SET_ICON'; prefix: string; name: string; svg: string }
  | { type: 'CLEAR_ICON' }
  | { type: 'SET_ICON_COLOR'; color: string }
  | { type: 'SET_LAYOUT'; layout: LabelState['layout'] }
  | { type: 'SET_BG_COLOR'; color: string }
  | { type: 'SET_PADDING'; padding: number }
  | { type: 'SET_BORDER_RADIUS'; radius: number }
  | { type: 'RESIZE'; width: number; height: number }
  | { type: 'RESET_STYLE' };

const MIN_W = 100;
const MAX_W = 640;
const MIN_H = 50;
const MAX_H = 400;

function reducer(state: LabelState, action: Action): LabelState {
  switch (action.type) {
    case 'SET_TEXT': return { ...state, text: action.text };
    case 'SET_FONT': return { ...state, fontFamily: action.fontFamily };
    case 'SET_FONT_SIZE': return { ...state, fontSize: action.size };
    case 'SET_FONT_WEIGHT': return { ...state, fontWeight: action.fontWeight };
    case 'SET_TEXT_COLOR': return { ...state, textColor: action.color };
    case 'SET_ICON': return { ...state, iconPrefix: action.prefix, iconName: action.name, iconSvg: action.svg };
    case 'CLEAR_ICON': return { ...state, iconPrefix: null, iconName: null, iconSvg: null };
    case 'SET_ICON_COLOR': return { ...state, iconColor: action.color };
    case 'SET_LAYOUT': return { ...state, layout: action.layout };
    case 'SET_BG_COLOR': return { ...state, backgroundColor: action.color };
    case 'SET_PADDING': return { ...state, padding: action.padding };
    case 'SET_BORDER_RADIUS': return { ...state, borderRadius: action.radius };
    case 'RESIZE':
      return {
        ...state,
        width: Math.max(MIN_W, Math.min(MAX_W, action.width)),
        height: Math.max(MIN_H, Math.min(MAX_H, action.height)),
      };
    case 'RESET_STYLE':
      return {
        ...initialState,
        text: state.text,
        iconPrefix: state.iconPrefix,
        iconName: state.iconName,
        iconSvg: state.iconSvg,
      };
    default: return state;
  }
}

export function useLabel() {
  const [label, dispatch] = useReducer(reducer, initialState);
  return {
    label,
    setText: (text: string) => dispatch({ type: 'SET_TEXT', text }),
    setFont: (fontFamily: string) => dispatch({ type: 'SET_FONT', fontFamily }),
    setFontSize: (size: number) => dispatch({ type: 'SET_FONT_SIZE', size }),
    setFontWeight: (fontWeight: 'regular' | 'bold') => dispatch({ type: 'SET_FONT_WEIGHT', fontWeight }),
    setTextColor: (color: string) => dispatch({ type: 'SET_TEXT_COLOR', color }),
    setIcon: (prefix: string, name: string, svg: string) => dispatch({ type: 'SET_ICON', prefix, name, svg }),
    clearIcon: () => dispatch({ type: 'CLEAR_ICON' }),
    setIconColor: (color: string) => dispatch({ type: 'SET_ICON_COLOR', color }),
    setLayout: (layout: LabelState['layout']) => dispatch({ type: 'SET_LAYOUT', layout }),
    setBackgroundColor: (color: string) => dispatch({ type: 'SET_BG_COLOR', color }),
    setPadding: (padding: number) => dispatch({ type: 'SET_PADDING', padding }),
    setBorderRadius: (radius: number) => dispatch({ type: 'SET_BORDER_RADIUS', radius }),
    resize: (width: number, height: number) => dispatch({ type: 'RESIZE', width, height }),
    resetStyle: () => dispatch({ type: 'RESET_STYLE' }),
  };
}

