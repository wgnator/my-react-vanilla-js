export default function Component({ element, props }) {
  if (props?.onClick)
    element.onclick = () => {
      props.onClick();
    };
  if (props?.onChange) element.onchange = props.onChange;
  return element;
}
