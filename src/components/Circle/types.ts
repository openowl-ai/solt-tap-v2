export interface CircleProps {
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
  expandClickArea?: number;
}
