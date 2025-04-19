import React, { FC } from "react";

interface Props {
  label?: string;
  status?: "primary" | "secondary" | "warning" | "error" | "info" | "success" | "cancel";
  className?: string;
  wrapClassName?: string;
  onClick?: React.MouseEventHandler;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: FC<Props> = ({
  label = "Login",
  status = "primary",
  className = "",
  onClick,
  startIcon,
  endIcon,
  wrapClassName = "",
  type = "button",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${wrapClassName}`} onClick={onClick}>
      {status === "primary" ? (
        <button
          type={type}
          className={`flex items-center justify-center gap-1 bg-primary-c900 w-fit px-4 py-3 2xl:py-3.5 rounded-full cursor-pointer hover:bg-primary-c800 active:bg-primary-c900 hover:scale-105 duration-300 transition ${className}`}
        >
          {startIcon && <div className="flex items-center">{startIcon}</div>}
          <div className="text-center font-medium text-sm 2xl:text-base text-white">{label}</div>
          {endIcon && <div className="flex items-center">{endIcon}</div>}
        </button>
      ) : null}

      {status === "secondary" ? (
        <button
          type={type}
          className={`text-center border-[2px] border-primary-c900 border-opacity-20 font-normal text-sm bg-white w-fit px-4 py-1.5 hover:text-primary-c900 active:text-primary-c900 rounded-full hover:cursor-pointer hover:bg-primary-c50/40 hover:border-primary-c50/40 active:bg-primary-c50/80 active:border-primary-c50/80 hover:scale-105 duration-300 transition ${className}`}
        >
          {startIcon && <div className="flex items-center">{startIcon}</div>}
          <div className="text-center font-medium text-sm 2xl:text-base text-primary-c900">{label}</div>
          {endIcon && <div className="flex items-center">{endIcon}</div>}
        </button>
      ) : null}

      {status === "success" ? (
        <button
          type={type}
          className={`flex items-center justify-center gap-1 bg-success-c800 w-fit px-4 py-1.5 rounded-full cursor-pointer hover:bg-success-c700 active:bg-success-c900 hover:scale-105 duration-300 transition ${className}`}
        >
          {startIcon ? startIcon : null}
          <div className={`text-center font-medium text-sm 2xl:text-base text-white`}>{label}</div>
          {endIcon ? endIcon : null}
        </button>
      ) : null}

      {status === "cancel" ? (
        <button
          type={type}
          className={`flex items-center justify-center gap-1 bg-grey-c50 w-fit px-4 py-1.5 rounded-full cursor-pointer hover:bg-grey-c100 active:bg-grey-c200 hover:scale-105 duration-300 transition ${className}`}
        >
          {startIcon ? startIcon : null}
          <div className={`text-center font-medium text-sm 2xl:text-base text-black/90`}>{label}</div>
          {endIcon ? endIcon : null}
        </button>
      ) : null}

      {status === "error" ? (
        <button
          type={type}
          className={`flex items-center justify-center gap-1 bg-support-c900 w-fit px-4 py-1.5 rounded-full cursor-pointer hover:bg-support-c700 active:bg-support-c800 hover:scale-105 duration-300 transition ${className}`}
        >
          {startIcon ? startIcon : null}
          <div className={`text-center font-medium text-sm 2xl:text-base text-white`}>{label}</div>
          {endIcon ? endIcon : null}
        </button>
      ) : null}
    </div>
  );
};

export default Button;
