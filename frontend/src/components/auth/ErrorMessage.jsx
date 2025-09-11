export default function ErrorMessage({ ErrorMessage }) {
  return (
    <div className="flex items-center gap-2 -mb-3 text-sm text-red-400">
      <i className="bx bx-error"></i>
      <p>{ErrorMessage}</p>
    </div>
  );
}