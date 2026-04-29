type OptionButtonProps = {
  label: string;
  onClick: () => void;
};

export function OptionButton({ label, onClick }: OptionButtonProps) {
  return (
    <button className="sd-chip" onClick={onClick}>
      {label}
    </button>
  );
}