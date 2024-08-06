export default function AutoSendToggle({
  isAutoSendOn,
  toggleIsAutoSendOn,
}: {
  isAutoSendOn: boolean;
  toggleIsAutoSendOn: () => void;
}) {
  return (
    <p className='auto-send-toggle'>
      Auto Send:{' '}
      <button onClick={toggleIsAutoSendOn}>{isAutoSendOn ? '🔛' : '✖️'}</button>
    </p>
  );
}
