import React, { useState, useRef, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/Button";
import { Add, ChevronDownIcon } from "@/assets/app-icons";
import useTheme from "@/utils/hooks/useTheme";

interface ServicesActionProps {
  onOpenDialog?: () => void;
}

const ServicesAction: React.FC<ServicesActionProps> = ({ onOpenDialog }) => {
  const { isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonWrapperRef.current &&
        !buttonWrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen && buttonWrapperRef.current) {
      const rect = buttonWrapperRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const serviceTypes = [
    { id: "database", label: "Database Service" },
    { id: "custom", label: "Custom Service" },
  ];

  const handleAddService = (type: string) => {
    console.log("Add service type:", type);
    setDropdownOpen(false);
    if (type === "database" && onOpenDialog) {
      onOpenDialog();
    }
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2
            className={`text-[18px] font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            Services
          </h2>
          <div className="relative z-[10001]" ref={buttonWrapperRef}>
            <Button
              onClick={handleToggleDropdown}
              className="px-3 !py-2 !rounded-xl !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
            >
              <span className="flex items-center gap-1 text-white">
                Add Service
                <ChevronDownIcon color="white" size={14} />
              </span>
            </Button>
          </div>
        </div>
        {isDark && <hr className="border-t border-[#2B3643]" />}
      </div>

      {dropdownOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm"
            onClick={() => setDropdownOpen(false)}
            aria-hidden="true"
          />,
          document.body
        )}

      {dropdownOpen &&
        dropdownPosition &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed w-48 rounded-xl shadow-lg z-[10000] ${
              isDark
                ? "bg-[#0C1116] border border-[#394757]"
                : "bg-white border border-[#E3E6EB]"
            }`}
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }}
          >
            {serviceTypes.map((type, index) => (
              <Fragment key={type.id}>
                <button
                  onClick={() => handleAddService(type.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    index === 0 ? "rounded-t-xl" : ""
                  } ${
                    index === serviceTypes.length - 1 ? "rounded-b-xl" : ""
                  } ${
                    isDark
                      ? "hover:bg-[#1E293B] text-white"
                      : "hover:bg-gray-100 text-[#162230]"
                  } transition-colors`}
                >
                  {type.label}
                </button>
                {index < serviceTypes.length - 1 && (
                  <div
                    className={`${
                      isDark ? "border-[#394757]" : "border-[#E3E6EB]"
                    } border-t`}
                  />
                )}
              </Fragment>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default ServicesAction;
