import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { Check } from './Icons.jsx'

/**
 * 화면 아래 알림 (6초 동안 표시)
 * toast: { message, actions: [{ id, label, to } | { id, label, close: true }] }
 */
export default function Toast() {
  const { toast, hideToast } = useStore()

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.key}>
          <Check />
          <span className="toast__msg">{toast.message}</span>
          {toast.actions?.map((a) =>
            a.to ? (
              <Link key={a.id} data-id={a.id} to={a.to} className="toast__btn" onClick={hideToast}>
                {a.label}
              </Link>
            ) : (
              <button key={a.id} data-id={a.id} type="button" className="toast__text-btn" onClick={hideToast}>
                {a.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
