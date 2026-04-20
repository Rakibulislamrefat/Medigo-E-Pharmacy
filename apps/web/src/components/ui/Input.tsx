export function Input(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  name?: string;
  autoComplete?: string;
}) {
  return (
    <input
      className="input"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      type={props.type ?? "text"}
      name={props.name}
      autoComplete={props.autoComplete}
    />
  );
}

