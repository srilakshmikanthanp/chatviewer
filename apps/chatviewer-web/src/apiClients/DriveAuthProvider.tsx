import {
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google';

import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_EXPIRY_BUFFER_MS = 60_000;

type DriveAuthContextValue = {
  getToken: (interactive?: boolean, loginHint?: string) => Promise<string>;
  clearToken: () => void;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

const DriveAuthContext = createContext<DriveAuthContextValue | null>(null);

export function DriveAuthProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<CachedToken | null>(null);
  const pendingRequest = useRef<Promise<string> | null>(null);
  const resolveRequest = useRef<((accessToken: string) => void) | null>(null);
  const rejectRequest = useRef<((error: Error) => void) | null>(null);

  const handleToken = (response: TokenResponse) => {
    const expiresAt = Date.now() + (Number(response.expires_in) || 3600) * 1000;
    setCache({ accessToken: response.access_token, expiresAt });
    resolveRequest.current?.(response.access_token);
    pendingRequest.current = null;
    resolveRequest.current = null;
    rejectRequest.current = null;
  };

  const handleTokenError = (response: Pick<TokenResponse, 'error' | 'error_description'>) => {
    const errorCode = response.error || 'interaction_required';
    const error = new Error(response.error_description || errorCode);
    error.name = errorCode;
    rejectRequest.current?.(error);
    pendingRequest.current = null;
    resolveRequest.current = null;
    rejectRequest.current = null;
  };

  const login = useGoogleLogin({
    scope: DRIVE_SCOPE,
    onSuccess: handleToken,
    onError: handleTokenError,
  });

  const getToken = (interactive = false, loginHint?: string): Promise<string> => {
    if (cache && cache.expiresAt - Date.now() > TOKEN_EXPIRY_BUFFER_MS) {
      return Promise.resolve(cache.accessToken);
    }

    if (pendingRequest.current) {
      return pendingRequest.current;
    }

    const request = new Promise<string>((resolve, reject) => {
      resolveRequest.current = resolve;
      rejectRequest.current = reject;
      login({
        prompt: interactive ? '' : 'none',
        hint: loginHint,
      });
    });

    pendingRequest.current = request;
    return request;
  };

  const clearToken = () => {
    setCache(null);
    pendingRequest.current = null;
    resolveRequest.current = null;
    rejectRequest.current = null;
  };

  return (
    <DriveAuthContext.Provider value={{ getToken, clearToken: clearToken }}>
      {children}
    </DriveAuthContext.Provider>
  );
}

export function useDriveAuth(): DriveAuthContextValue {
  const context = useContext(DriveAuthContext);

  if (!context) {
    throw new Error('useDriveAuth must be used inside DriveAuthProvider');
  }

  return context;
}
