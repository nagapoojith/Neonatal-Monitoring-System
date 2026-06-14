import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Filter } from "lucide-react";

type CustomSelectOption = {
  label: string;
  value: string;
};

type CustomSelectStyles = {
  buttonClass?: string;
  textClass?: string;
  placeholderClass?: string;
  borderClass?: string;
  focusRingClass?: string;
  dropdownClass?: string;
  optionClass?: string;
  optionHoverClass?: string;
  selectedClass?: string;
};

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  styles?: CustomSelectStyles;
}

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  className = "",
  disabled = false,
  styles = {},
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const {
    buttonClass = "bg-background hover:bg-muted/50",
    textClass = "text-foreground",
    placeholderClass = "text-muted-foreground",
    borderClass = "border-input",
    focusRingClass = "focus:ring-primary focus:border-primary",
    dropdownClass = "bg-popover",
    optionClass = "text-popover-foreground",
    optionHoverClass = "hover:bg-accent hover:text-accent-foreground",
    selectedClass = "bg-accent text-accent-foreground font-semibold",
  } = styles;

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedWrapper = wrapperRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);

      if (!clickedWrapper && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          event.preventDefault();
          break;
        case "ArrowUp":
          event.preventDefault();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3
          ${buttonClass}
          ${borderClass}
          border rounded-lg
          ${textClass}
          ${selectedOption ? "" : placeholderClass}
          focus:outline-none ${focusRingClass}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          transition-all duration-200
          flex items-center justify-between
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
            className={`
              ${dropdownClass}
              ${borderClass}
              border
              rounded-lg
              shadow-2xl
              z-[99999]
              max-h-60
              overflow-y-auto
            `}
            role="listbox"
          >
            {options.length === 0 ? (
              <div className={`px-4 py-3 ${placeholderClass} text-sm`}>
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                    px-4 py-3
                    cursor-pointer
                    transition-colors duration-150
                    ${
                      isSelected
                        ? `${selectedClass} ${textClass} border-l-4 ${borderClass}`
                        : `${optionClass} ${optionHoverClass}`
                    }
                    first:rounded-t-lg
                    last:rounded-b-lg
                  `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </div>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default CustomSelect;
