export default function ErrorMessage({ message }) {
  if (!message) return null
  return <div className="alert alert-error">⚠ {message}</div>
}
