export interface LabelState {
  width: number;
  height: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'regular' | 'bold';
  textColor: string;
  iconPrefix: string | null;
  iconName: string | null;
  iconSvg: string | null;
  iconColor: string;
  layout: 'ICON_LEFT' | 'ICON_RIGHT' | 'ICON_TOP' | 'TEXT_ONLY';
  backgroundColor: string;
  padding: number;
  borderRadius: number;
}
