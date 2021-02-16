import React from 'react';

import { IconContext, IconContextProps, DefaultContext } from './IconContext';

export interface IconTree {
  tag: string;
  attr: { [key: string]: string };
  child?: IconTree[];
}

function Tree2Element(tree: IconTree[]): React.ReactElement<{}>[] {
  return (
    tree &&
    tree.map((node, i) =>
      React.createElement(
        node.tag,
        { key: i, ...node.attr },
        Tree2Element(node.child || []),
      ),
    )
  );
}
export function GenIcon(
  data: IconTree,
): (props: IconBaseProps) => React.ReactElement<{}> {
  const IconWrapper = (props: IconBaseProps): React.ReactElement<{}> => (
    <IconBase attr={{ ...data.attr }} {...props}>
      {Tree2Element(data.child || [])}
    </IconBase>
  );
  return IconWrapper;
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  title?: string;
  className?: string;
}

export type IconType = (props: IconBaseProps) => JSX.Element;
export function IconBase(props: IconBaseProps & { attr?: {} }): JSX.Element {
  const elem = (conf: IconContextProps): JSX.Element => {
    const computedSize = props.size || conf.size || '1em';
    let className;
    if (conf.className) className = conf.className;
    if (props.className)
      className = (className ? className + ' ' : '') + props.className;
    const { attr, title, ...svgProps } = props;

    return (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        {...conf.attr}
        {...attr}
        {...svgProps}
        className={className}
        style={{
          color: props.color || conf.color,
          ...conf.style,
          ...props.style,
        }}
        height={computedSize}
        width={computedSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        {title && <title>{title}</title>}
        {props.children}
      </svg>
    );
  };

  return IconContext !== undefined ? (
    <IconContext.Consumer>
      {(conf: IconContextProps): JSX.Element => elem(conf)}
    </IconContext.Consumer>
  ) : (
    elem(DefaultContext)
  );
}
