// ErrorModal.jsx

function ErrorModal({ message, onClose }) {
  if (!message) return null;
  // message가 없으면 모달을 표시하지 않음 (null 반환)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      style={{ zIndex: 9999 }}
    >
      <div className="rounded bg-white p-6 shadow-md">
        <p className=" mb-4 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
