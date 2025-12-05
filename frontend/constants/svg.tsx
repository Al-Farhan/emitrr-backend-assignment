export const redDisc = (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="grad-red" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffddd6" />
        <stop offset="55%" stop-color="#ff4d4d" />
        <stop offset="100%" stop-color="#c91f1f" />
      </radialGradient>

      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.35" />
      </filter>

      <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="34"
      fill="url(#grad-red)"
      filter="url(#shadow)"
    />
    <circle
      cx="40"
      cy="40"
      r="29"
      fill="none"
      stroke="#8a1212"
      stroke-opacity="0.12"
      stroke-width="2"
    />
    <ellipse cx="30" cy="25" rx="20" ry="10" fill="url(#shine)" opacity="0.9" />
  </svg>
);

export const yellowDisc = (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="grad-yellow" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#fff7d6" />
        <stop offset="55%" stop-color="#ffc940" />
        <stop offset="100%" stop-color="#d08e00" />
      </radialGradient>

      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.35" />
      </filter>

      <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="34"
      fill="url(#grad-yellow)"
      filter="url(#shadow)"
    />
    <circle
      cx="40"
      cy="40"
      r="29"
      fill="none"
      stroke="#a06500"
      stroke-opacity="0.12"
      stroke-width="2"
    />
    <ellipse cx="30" cy="25" rx="20" ry="10" fill="url(#shine)" opacity="0.9" />
  </svg>
);
