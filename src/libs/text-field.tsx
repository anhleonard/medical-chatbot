"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

interface TextFieldProps {
  label?: string;
  defaultValue?: string;
  onChange?: (value: any) => void;
  className?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type?: string;
  name?: string;
  value?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const TextField = ({
  label = "Enter text",
  defaultValue = "",
  onChange,
  className = "",
  error = false,
  helperText = "",
  placeholder = "",
  startIcon,
  endIcon,
  type = "text",
  name,
  value,
  onBlur,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  const handleLabelClick = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  return (
    <div>
      <div className={`relative w-full group ${className}`}>
        {/* Start Icon */}
        {startIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-c300">{startIcon}</div>}

        {/* End Icon */}
        {endIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-c300">{endIcon}</div>}

        {/* Label */}
        <label
          onClick={handleLabelClick}
          className={`absolute left-4 text-xs 2xl:text-sm font-semibold transition-all duration-300 z-10 cursor-text
            ${isFocused || value || placeholder ? "-top-[8px] 2xl:-top-[10px] bg-white px-1 text-xs" : "left-4 top-[13px]"} 
            ${isFocused ? "text-primary-c900" : "text-grey-c200"} 
            ${error ? "bg-gradient-to-b from-transparent to-support-c10" : ""}
          `}
        >
          {label}
        </label>

        {/* Input Box */}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`text-sm 2xl:text-base w-full border-2 rounded-[20px] py-3 2xl:py-3.5 outline-none transition-all
            ${startIcon ? "pl-11" : "pl-4"}
            ${endIcon ? "pr-11" : "pr-4"}
            ${
              isFocused && !error
                ? "border-primary-c900"
                : error
                ? "border-support-c100 bg-support-c10"
                : "border-grey-c200 group-hover:border-primary-c700 group-hover:border-opacity-80"
            }`}
        />
      </div>
      {helperText ? <div className="text-xs mt-0.5 pl-1 text-support-c300">{helperText}</div> : null}
    </div>
  );
};

export default TextField;
