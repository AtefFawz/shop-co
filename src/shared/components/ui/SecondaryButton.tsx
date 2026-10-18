import Button from "@mui/material/Button";
interface SecondaryButtonProps {
  textBtn: string;
  func?: () => void;
  style?: string;
}
export default function SecondaryButton({ textBtn, func, style }: SecondaryButtonProps) {
  return (
    <div className="w-full flex justify-center">
      <Button
        onClick={func}
        className={`${style}`}
        variant="outlined"
        sx={{
          borderRadius: "9999px",
          fontWeight: "bolder",
          padding: "8px 32px",
          backgroundColor: "var(--surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-strong)",
          transition: "background-color 180ms ease, border-color 180ms ease, color 180ms ease",
          "&:hover": { backgroundColor: "var(--surface-muted)", borderColor: "var(--focus)" },
          "&:focus-visible": { outline: "2px solid var(--focus)", outlineOffset: 3 },
        }}
      >
        {textBtn}
      </Button>
    </div>
  );
}
