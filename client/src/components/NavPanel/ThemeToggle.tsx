import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme
      ? localStorage.getItem('theme') === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <p className='theme-toggle'>
      Theme:{' '}
      <button onClick={() => setIsDarkTheme((idt) => !idt)}>
        {isDarkTheme ? '🌒' : '☀️'}
      </button>
    </p>
  );
}
