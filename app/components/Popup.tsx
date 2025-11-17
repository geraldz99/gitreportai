"use client";

interface PopupProps {
  text: string;
  onClose: () => void;
}
export default function Popup({ text, onClose }: PopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 w-[90%] max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Report results</h2>

        <p className="text-white mb-4">{text}</p>

        <button  onClick={onClose} className="w-full mt-5 cursor-pointer bg-white hover:bg-slate-100 disabled:bg-slate-600 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:cursor-not-allowed">
          Close
        </button>
      </div>
    </div>
  );
}
