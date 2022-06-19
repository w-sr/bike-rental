import CancelIcon from "@mui/icons-material/Cancel";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import { Bike, User } from "../graphql/type";
import { UserRole } from "../utils/type";

type BikeCardProps = {
  type: string;
  bike: Bike;
  user?: User;
  edit?: () => void;
  remove?: () => void;
  reserve?: () => void;
  cancelReserve?: () => void;
};

const BikeCard = ({
  type,
  bike,
  user,
  edit,
  remove,
  reserve,
  cancelReserve,
}: BikeCardProps) => {
  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3 }}>
      <CardHeader title={bike?.model} subheader={bike?.location} />
      <CardMedia component="img" image="/img/bike.jpeg" alt="Paella dish" />
      <CardActions
        disableSpacing
        sx={{ justifyContent: "space-between", marginTop: 2 }}
      >
        <Rating
          name="simple-rating"
          value={parseFloat(bike?.rate ?? 0)}
          readOnly
        />
        <Box>
          {user?.role === UserRole.User && (
            <>
              <Tooltip title="Reserve">
                <span>
                  <IconButton
                    aria-label="reserve"
                    onClick={reserve}
                    disabled={type === "reserved"}
                  >
                    <BookmarkIcon
                      color={type === "reserved" ? "success" : undefined}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              {type === "reserved" && (
                <Tooltip title="Cancel Reservation">
                  <IconButton
                    aria-label="cancel-reserve"
                    onClick={cancelReserve}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          {user?.role === UserRole.Manager && (
            <>
              <Tooltip title="Edit Bike">
                <IconButton aria-label="edit" onClick={edit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Bike">
                <IconButton aria-label="delete" onClick={remove}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default BikeCard;
