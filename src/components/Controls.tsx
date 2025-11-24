import React from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  selectedCount: number;
  filteredSelectedCount: number;
  onMarkViewed: () => void;
  onMarkUnviewed: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedCount,
  filteredSelectedCount,
  onMarkViewed,
  onMarkUnviewed
}) => {
  const hasSelection = selectedCount > 0;

  return (
    <div className="controls">
      <div className="selection-info" role="status" aria-live="polite">
        {hasSelection ? (
          <>
            <span className="selection-count">{selectedCount} selected</span>
            {filteredSelectedCount < selectedCount && (
              <span className="filtered-info">
                ({filteredSelectedCount} in current view)
              </span>
            )}
          </>
        ) : (
          <span className="selection-count">No characters selected</span>
        )}
      </div>
      
      <div className="button-group">
        <button
          className="control-button"
          onClick={onMarkViewed}
          disabled={!hasSelection}
          aria-label="Mark selected as viewed"
        >
          Mark as Viewed
        </button>
        <button
          className="control-button secondary"
          onClick={onMarkUnviewed}
          disabled={!hasSelection}
          aria-label="Mark selected as unviewed"
        >
          Mark as Unviewed
        </button>
      </div>
    </div>
  );
};

