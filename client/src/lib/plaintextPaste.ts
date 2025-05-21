// Ensures only plain text can be pasted
export default function PlainTextPasteHandler(e: React.ClipboardEvent<HTMLHeadingElement>): void {
    e.preventDefault();

    const text = e.clipboardData?.getData('text/plain');
    const selectedRange = window.getSelection()?.getRangeAt(0);
    if (!selectedRange || !text) {
        return;
    }

    selectedRange.deleteContents();
    selectedRange.insertNode(document.createTextNode(text));
    selectedRange.setStart(selectedRange.endContainer, selectedRange.endOffset);

    // Trigger change event to ensure that state is updated
    const changeEvent: Event = new Event('input', { bubbles: true });
    e.currentTarget.dispatchEvent(changeEvent);
}
