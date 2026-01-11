"use client";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useFilterStore } from "@/store/filterStore";

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function CustomizedSlider() {
  const [price, setPrice] = useState<number>(100);

  const filterStore = useFilterStore((state) => state.filterPrice);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setPrice(newValue as number);
  };
  const handleChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    console.log("Filtering now with:", newValue);

    if (filterStore) {
      filterStore(newValue as number);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {" "}
      <Box sx={{ m: 3 }} />
      <Typography gutterBottom className="font-bold mb-2">
        Max Price: ${price}
      </Typography>
      <PrettoSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        value={price}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        min={0}
        max={500}
      />
    </Box>
  );
}
