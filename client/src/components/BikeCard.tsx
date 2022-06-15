import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { Bike } from "../utils/type";
import { useState } from "react";

type BikeCardProps = {
  bike: Bike;
  setRate?: (rate: number) => void;
  reserve?: () => void;
  cancelReserve?: () => void;
};

const BikeCard = ({ bike, setRate, reserve, cancelReserve }: BikeCardProps) => {
  const [value, setValue] = useState<number | null>(0);

  return (
    <Card sx={{ maxWidth: 300, boxShadow: 3 }}>
      <CardHeader title={bike?.model} subheader={bike?.location} />
      <CardMedia
        component="img"
        height="194"
        image="/img/bike.jpeg"
        alt="Paella dish"
      />
      <CardContent>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setRate && setRate(newValue as number);
          }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="edit" onClick={reserve}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default BikeCard;
