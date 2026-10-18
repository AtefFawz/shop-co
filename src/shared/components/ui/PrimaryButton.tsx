import Button from "@mui/material/Button";
interface PrimaryButtonProps {
  textBtn: string;
  func?: () => void;
  style?: string;
}
export default function PrimaryButton({ textBtn, func, style }: PrimaryButtonProps) {
  return (
    <div className="w-full">
      <Button
        onClick={func}
        className={`${style}`}
        variant="contained"
        sx={{
          backgroundColor: "var(--action)",
          color: "var(--text-on-action)",
          transition: "background-color 180ms ease, transform 180ms ease",
          "&:hover": { backgroundColor: "var(--action-hover)" },
          "&:focus-visible": { outline: "2px solid var(--focus)", outlineOffset: 3 },
          borderRadius: "9999px",
          fontWeight: "bolder",
          padding: "8px 32px",
        }}
      >
        {textBtn}
      </Button>
    </div>
  );
}
