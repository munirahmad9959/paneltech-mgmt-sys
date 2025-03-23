import { useSession } from "../../Utils/SessionContext";

const SessionExpiredModal = () => {
  const { isSessionExpired, closeSessionPopup } = useSession();

  if (!isSessionExpired) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-800">Session Expired</h2>
        <p className="text-gray-600 mt-2">
          Your session has expired. Please log in again.
        </p>
        <button
          onClick={closeSessionPopup}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login Again
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;