// Confirmation pop up box
// Custom message and event methods can be provided
// Used in conjunction with the confirmationProvider
// To provide an elegant way to confirm actions
export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    return (
        <div className={`${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} transition fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`} >
            <div className="bg-bg-dark p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="font-semibold text-white text-base mb-4">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="font-semibold px-4 py-2 text-sm text-bg-dark bg-gray-200 rounded hover:bg-gray-300" >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="font-semibold px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div >
    );
};
