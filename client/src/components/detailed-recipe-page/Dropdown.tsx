import { useState } from "react";
import "./Dropdown.css";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Dropdown({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="dropdown">
      <button
        className="dropdown-header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="dropdown-title">{title}</span>
        <span className="dropdown-chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <div className="dropdown-body">
          {children}
        </div>
      )}
    </div>
  );
}