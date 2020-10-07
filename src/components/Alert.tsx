import React, { ReactNode } from "react";
import "./Alert.css";

type AlertType = "info" | "success" | "warning" | "error";

type BaseAlertProps = {
  type?: AlertType;
  className?: string;
  passive?: boolean;
};

export const BaseAlert: React.FC<BaseAlertProps> = ({
  type = "info",
  className,
  passive = false,
  children,
}) => (
  <div
    className={`base-alert base-alert--${type} ${className}`}
    role={passive ? undefined : "alert"}
  >
    {children}
  </div>
);

export const Alert: React.FC<
  {
    heading: string | ReactNode;
    description: string | ReactNode;
    actions?: string | ReactNode;
  } & BaseAlertProps
> = ({ heading, description, type, className, actions }) => {
  return (
    <BaseAlert type={type} className={`alert ${className}`}>
      <div className="alert__text">
        <header>{heading}</header>
        <p>{description}</p>
      </div>
      {actions && <div className="alert__actions">{actions}</div>}
    </BaseAlert>
  );
};
