import { useEffect } from "react";

import { X } from "lucide-react";

import {
  legalBackButtonStyle,
  legalDocumentCardStyle,
  legalDocumentEyebrowStyle,
  legalDocumentIntroStyle,
  legalDocumentTitleStyle,
  legalDocumentUpdatedStyle,
  legalHeaderStyle,
  legalModalBodyStyle,
  legalModalOverlayStyle,
  legalModalStyle,
  legalSectionBodyStyle,
  legalSectionTitleStyle,
} from "@/features/auth/components/authStyles";

export function LegalDocumentModal({
  title,
  updatedAt,
  intro,
  sections,
  onClose,
}: {
  title: string;
  updatedAt: string;
  intro: string;
  sections: { title: string; body: string }[];
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div style={legalModalOverlayStyle} className="modal-backdrop-motion ledger-auth-legal-modal-overlay" data-state="open" onClick={onClose}>
      <div
        style={legalModalStyle}
        className="ledger-modal-shell modal-shell-motion ledger-auth-legal-modal"
        data-state="open"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header style={legalHeaderStyle} className="ledger-auth-legal-header">
          <button type="button" onClick={onClose} style={legalBackButtonStyle} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
          <p style={legalDocumentEyebrowStyle}>Legal</p>
          <h1 style={legalDocumentTitleStyle}>{title}</h1>
          <p style={legalDocumentUpdatedStyle}>
            {updatedAt}. <span style={legalDocumentIntroStyle}>{intro}</span>
          </p>
        </header>

        <div style={legalModalBodyStyle} className="ledger-auth-legal-body">
          <div style={legalDocumentCardStyle} className="ledger-auth-legal-card">
            {sections.map((section, index) => (
              <div
                key={section.title}
                style={{ marginBottom: index === sections.length - 1 ? 0 : 28 }}
              >
                <h2 style={legalSectionTitleStyle}>{section.title}</h2>
                <p style={legalSectionBodyStyle}>{section.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
