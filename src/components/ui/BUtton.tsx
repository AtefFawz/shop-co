import Button from "@mui/material/Button";
interface buttonTypes {
  textBtn: string;
  func?: () => void;
  style?: string;
}
export default function ({ textBtn, func, style }: buttonTypes) {
  return (
    <div className="w-full">
      <Button
        onClick={func}
        className={`${style}`}
        variant="contained"
        sx={{
          backgroundColor: "#1e2939",
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
