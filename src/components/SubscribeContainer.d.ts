interface SubscribeContainerProps {
  title?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void> | void;
  className?: string;
  showStarBorder?: boolean;
  starBorderColor?: string;
  starBorderSpeed?: string;
  starBorderThickness?: number;
  containerClassName?: string;
  titleClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

declare function SubscribeContainer(props?: SubscribeContainerProps): JSX.Element;
export default SubscribeContainer; 