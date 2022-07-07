import React from "react";
import cn from 'classnames';


export const StatItem = (props) => {
  const { icon, name, value, onClick, active } = props;

  const itemProps = {};
  if (onClick) {
    itemProps.onClick = onClick;
  }

  return (
    <div className={cn("custom-content__stats__item", { active })} {...itemProps}>
      {icon && <div className="custom-content__stats__left">
        <div className="custom-content__stats__icon">{icon}</div>
      </div>}
      <div className="custom-content__stats__right">
        <div className="custom-content__stats__name">{name}</div>
        <div className="custom-content__stats__val">{value}</div>
      </div>
    </div>
  );
};
