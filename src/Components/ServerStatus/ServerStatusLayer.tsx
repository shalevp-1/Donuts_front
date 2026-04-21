import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { fetchServerHealth } from '../../Utils/serverHealth';
import './ServerStatusLayer.css';

type ServerStatus = 'checking' | 'online' | 'offline';

type ServerNotice = {
  tone: 'warning' | 'success';
  text: string;
};

type ConfettiPieceStyle = CSSProperties & {
  '--confetti-drift'?: string;
};

type ConfettiPiece = {
  id: string;
  style: ConfettiPieceStyle;
  fallDelayMs: number;
  fallDurationMs: number;
};

const confettiPalette = ['#ff8a5b', '#ffd166', '#7bd88f', '#5ec8ff', '#f76f8e', '#f4b860'];
const confettiPieces: ConfettiPiece[] = Array.from({ length: 54 }, (_, index) => {
  const size = 6 + (index % 4) * 3;
  const spread = (index * 13 + (index % 4) * 7) % 100;
  const drift = `${((index % 9) - 4) * 18}px`;
  const duration = 3.8 + (index % 5) * 0.35;
  const delay = (index % 10) * 0.08;

  return {
    id: `confetti-${index}`,
    style: {
      left: `${spread}%`,
      width: `${size}px`,
      height: `${Math.max(4, Math.round(size * 0.72))}px`,
      backgroundColor: confettiPalette[index % confettiPalette.length],
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      '--confetti-drift': drift
    } as ConfettiPieceStyle,
    fallDelayMs: delay * 1000,
    fallDurationMs: duration * 1000
  };
});

const confettiLifetimeMs = Math.ceil(
  Math.max(...confettiPieces.map((piece) => piece.fallDelayMs + piece.fallDurationMs)) + 300
);

export default function ServerStatusLayer() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>('checking');
  const [notice, setNotice] = useState<ServerNotice | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const statusRef = useRef<ServerStatus>('checking');
  const hasShownWaitingNoticeRef = useRef(false);
  const noticeTimerRef = useRef<number | null>(null);
  const confettiTimerRef = useRef<number | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const onlinePollDelayMs = 8000;
    const offlinePollDelayMs = 20000;

    const clearNoticeTimer = () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = null;
      }
    };

    const clearConfettiTimer = () => {
      if (confettiTimerRef.current !== null) {
        window.clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
    };

    const clearPollTimer = () => {
      if (pollTimerRef.current !== null) {
        window.clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };

    const updateStatus = (nextStatus: ServerStatus) => {
      statusRef.current = nextStatus;
      setServerStatus(nextStatus);
    };

    const showSuccessState = () => {
      updateStatus('online');
      setShowConfetti(true);
      clearConfettiTimer();
      confettiTimerRef.current = window.setTimeout(() => {
        if (isMounted) {
          setShowConfetti(false);
        }
      }, confettiLifetimeMs);

      setNotice({
        tone: 'success',
        text: 'Server is up and running! Thanks for waiting.'
      });

      clearNoticeTimer();
      noticeTimerRef.current = window.setTimeout(() => {
        if (isMounted) {
          setNotice(null);
        }
      }, 3400);
    };

    const showOfflineState = () => {
      hasShownWaitingNoticeRef.current = true;
      updateStatus('offline');
      clearConfettiTimer();
      setShowConfetti(false);
      clearNoticeTimer();
      setNotice({
        tone: 'warning',
        text: 'Server is waking up it might take a few seconds!'
      });
    };

    const pingServer = async () => {
      try {
        const health = await fetchServerHealth();

        if (!isMounted) {
          return;
        }

        if (health.status === 'ok') {
          if (statusRef.current !== 'online') {
            if (!hasShownWaitingNoticeRef.current) {
              updateStatus('online');
            } else {
              showSuccessState();
            }
          } else {
            updateStatus('online');
          }
        } else if (statusRef.current !== 'offline') {
          showOfflineState();
        } else {
          updateStatus('offline');
        }
      } catch {
        if (!isMounted) {
          return;
        }

        if (statusRef.current !== 'offline') {
          showOfflineState();
        } else {
          updateStatus('offline');
        }
      } finally {
        if (!isMounted) {
          return;
        }

        clearPollTimer();
        pollTimerRef.current = window.setTimeout(() => {
          void pingServer();
        }, statusRef.current === 'offline' ? offlinePollDelayMs : onlinePollDelayMs);
      }
    };

    void pingServer();

    return () => {
      isMounted = false;
      clearPollTimer();
      clearNoticeTimer();
      clearConfettiTimer();
    };
  }, []);

  if (!notice && !showConfetti && serverStatus === 'online') {
    return null;
  }

  return (
    <div className="serverStatusLayer" aria-live="polite" aria-atomic="true">
      {showConfetti && (
        <div className="confettiLayer" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span key={piece.id} className="confettiPiece" style={piece.style} />
          ))}
        </div>
      )}

      {notice && (
        <div className={`serverNotice ${notice.tone}`}>
          <div className="serverNoticeCard">
            <img src="/donut.png" alt="" className="serverNoticeDonut" />
            <div className="serverNoticeCopy">
              <p className="serverNoticeLabel">
                {notice.tone === 'warning' ? 'The Server is Starting' : 'Server is Online'}
              </p>
              <p className="serverNoticeText">{notice.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
