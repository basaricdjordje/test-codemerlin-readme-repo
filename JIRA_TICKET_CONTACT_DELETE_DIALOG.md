# Jira ticket (copy-paste)

## Title
**Contact form: accessible delete confirmation dialog (focus, Escape, naming)**

## Description
The contact form shows a delete confirmation layer (`ContactForm.tsx`) with `role="dialog"` and `aria-modal="true"`, but it does not yet follow modal dialog patterns expected for WCAG 2.1: programmatic name for the dialog, focus move on open, focus trap while open, dismiss on Escape, and sensible focus return on close. This ticket hardens that flow for keyboard and screen reader users without changing the underlying delete/cancel business rules unless product explicitly requires it.

**Parent / Epic (optional):** Accessibility / Phase 2 follow-up  
**Type:** Task  
**Priority:** Medium

## Acceptance Criteria

1. **Accessible name:** The dialog element has an accessible name via `aria-labelledby` (or `aria-label` from i18n) pointing at visible dialog text or a dedicated heading; the name clearly indicates a destructive confirmation (not only generic “dialog”).

2. **Focus on open:** When the dialog opens, keyboard focus moves to the first focusable control inside the dialog (or the recommended primary action per UX), not left on the trigger behind the modal.

3. **Escape closes:** Pressing Escape closes the dialog and returns to a predictable state (same as Cancel: dialog closed, form unchanged unless product defines otherwise).

4. **Focus trap:** While the dialog is open, Tab / Shift+Tab keep focus within the dialog (including no escape to browser chrome except standard behavior); first Tab from last control wraps to first, and reverse from first to last.

5. **Focus on close:** When the dialog closes (Cancel, Escape, or confirm), focus returns to the control that opened the dialog (the Delete button) or another documented, sensible target so the user is not stranded.

6. **Background inertness:** While open, the rest of the page is not interactable via mouse or keyboard in a way that leaves two “active” contexts (e.g. `inert` on a wrapper, focus sentinel, or equivalent pattern documented in the PR).

7. **Visual layering:** The dialog appears above the form with sufficient contrast and a visible boundary (existing CSS may be adjusted); no reliance on color alone for the destructive action where guidelines apply.

8. **i18n:** Any new user-visible strings (dialog title, aria-label if used) are added to `en` and `sr` locale files and stay in sync with bundled keys if the project keeps a parity test.
