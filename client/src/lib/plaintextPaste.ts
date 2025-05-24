// Ensures only plain text can be pasted
export default function PlainTextPasteHandler(e: React.ClipboardEvent<HTMLHeadingElement>): void {
    e.preventDefault();

    // Get clipboard plain text
    const text = e.clipboardData?.getData('text/plain');
    // Get selected element (has to be an input type field)
    const selectedRange = window.getSelection()?.getRangeAt(0);
    if (!selectedRange || !text) {
        return;
    }

    // Delete any selected text
    selectedRange.deleteContents();
    // Insert plain text
    selectedRange.insertNode(document.createTextNode(text));
    // Ensure that start and end are kept updated
    // Could cause weird bugs with home and end buttons if not done
    selectedRange.setStart(selectedRange.endContainer, selectedRange.endOffset);

    // Trigger change event to ensure that state is updated
    const changeEvent: Event = new Event('input', { bubbles: true });
    e.currentTarget.dispatchEvent(changeEvent);
}
