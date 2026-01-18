import Button from "@mui/material/Button";
interface buttonTypes {
  textBtn: string;
  func?: () => void;
  style?: string;
}
export default function ({ textBtn, func, style }: buttonTypes) {
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
          backgroundColor: "transparent",
          color: "black",
          border: "1px solid  #d1d5dc",
        }}
      >
        {textBtn}
      </Button>
    </div>
  );
}
