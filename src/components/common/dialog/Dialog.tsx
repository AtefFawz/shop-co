"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { IoSettingsOutline } from "react-icons/io5";
import { MdManageHistory } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
const emails = ["Manage Product", "user02@gmail.com"];
import { useRouter } from "next/navigation";
const menu = [
  {
    icon: <MdManageHistory />,
    title: "Mange Product",
    path: "/dashboard/products",
  },
  { icon: <ImStatsDots />, title: "Min stats", path: "/dashboard" },
  { icon: <IoMdAdd />, title: "Add product", path: "/dashboard/products/add" },
];
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;
  const router = useRouter();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {menu.map((item) => (
          <ListItem disablePadding key={item.title}>
            <ListItemButton
              onClick={() => {
                handleListItemClick(item.title);
                router.push(item.path);
              }}
            >
              <ListItemAvatar onClick={() => router.push(item.path)}>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <br />
      <Button
        variant="contained"
        className=" w-16 h-16 "
        sx={{ borderRadius: "50%", fontSize: "1.2rem" }}
        onClick={handleClickOpen}
      >
        <IoSettingsOutline />
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
