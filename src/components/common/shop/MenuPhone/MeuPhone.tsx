import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineControl } from "react-icons/ai";
import { FilterButton } from "@/components/common/FilterButton";
import PrettoSlider from "../menu/Slider";
import { Colors } from "../menu/Colors";
import { Sizing } from "../menu/Sizing";
import { useFilterStore } from "@/store/filterStore";
type Anchor = "bottom";

export default function AnchorTemporaryDrawer() {
  const useFilter = useFilterStore((e) => e.resetFilter);
  const product = useFilterStore((e) => e.products);
  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "bottom" ? "auto" : 250, padding: "0 10px" }}
      role="presentation"
    >
      <div className="py-4 px-2 flex justify-between items-center">
        <AiOutlineControl
          className="text-2xl hover:rotate-180"
          onClick={() => useFilter()}
        />
        <AiOutlineClose
          className="text-2xl"
          onKeyDown={toggleDrawer(anchor, false)}
          onClick={toggleDrawer(anchor, false)}
        />
      </div>
      <Divider />

      <List>
        <FilterButton content={["T-SHIRT", "SHIRT", "PANTS", "JEANS"]} />
      </List>
      <List sx={{ padding: "0 6px" }}>
        {" "}
        <PrettoSlider />{" "}
      </List>
      <Divider />
      <List>
        <Colors />
      </List>
      <Divider />
      <List>
        {" "}
        <Sizing />{" "}
      </List>
      <List>
        <FilterButton content={["Casual", "Formal", "Party", "Gym"]} />
      </List>
    </Box>
  );
  const find = product.find((e) => e.id);
  return (
    <div className="container mx-auto ">
      {(["bottom"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <div className="flex justify-between items-center bg-white max-w-full ">
            <h1 className="font-bold ">
              {`Shopping >`}{" "}
              <span className="text-gray-500 text-sm">{find?.type}</span> {`>`}
              <span className="text-gray-500 text-sm">
                {find?.section}
              </span>{" "}
            </h1>

            <Button onClick={toggleDrawer(anchor, true)}>
              <AiOutlineControl className="text-2xl text-gray-500" />
            </Button>
          </div>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
