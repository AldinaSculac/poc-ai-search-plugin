import { useState, type SubmitEvent } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { clearApiKey, devApiKey, loadApiKey, saveApiKey } from '../settings/apiKeyStorage';
import './ApiKeySettings.css';

/** Shows only the start and the last four characters of the key. */
function maskKey(apiKey: string): string {
  return `${apiKey.slice(0, 7)}…${apiKey.slice(-4)}`;
}

export function ApiKeySettings() {
  const [savedKey, setSavedKey] = useState(loadApiKey);
  const [draft, setDraft] = useState('');

  function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const apiKey = draft.trim();
    if (!apiKey) return;
    saveApiKey(apiKey);
    setSavedKey(apiKey);
    setDraft('');
  }

  function handleRemove() {
    clearApiKey();
    setSavedKey(null);
  }

  return (
    <div className="api-key">
      {savedKey ? (
        <div className="api-key__saved">
          <KeyRound className="api-key__icon" size={20} />
          <span>
            <span className="api-key__label">Anthropic API key</span>
            <code className="api-key__value">{maskKey(savedKey)}</code>
          </span>
          <button className="button button--ghost" type="button" onClick={handleRemove}>
            Remove
          </button>
        </div>
      ) : (
        <form className="api-key__form" onSubmit={handleSave}>
          <label className="api-key__label" htmlFor="api-key-input">
            Anthropic API key
          </label>
          <div className="api-key__row">
            <input
              id="api-key-input"
              className="api-key__input"
              type="password"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="sk-ant-…"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="button" type="submit" disabled={!draft.trim()}>
              Save
            </button>
          </div>
          {devApiKey && (
            <p className="api-key__dev">
              Using <code>VITE_ANTHROPIC_API_KEY</code> from <code>.env.local</code> (development
              only). Save a key here to use a different one.
            </p>
          )}
        </form>
      )}
      <p className="api-key__note">
        <ShieldAlert size={16} />
        Demo only: the key stays in this browser and is sent straight to Anthropic.
      </p>
    </div>
  );
}
