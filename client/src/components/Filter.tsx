import {
  Box,
  FormControl,
  InputBase,
  InputLabel,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "5px 6px",
  },
}));

type FilterProps = {
  filterChange: (key: string, value: string) => void;
  model: Record<string, string>;
};

const Filter = ({ filterChange, model }: FilterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterChange(e.target.name, e.target.value);
  };

  return (
    <Box display={"flex"} flexDirection="column">
      <Typography variant="h6">Filter</Typography>
      <Box mt={4} mb={1}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="model-search">
            Model
          </InputLabel>
          <BootstrapInput
            id="model-search"
            name="model"
            value={model.model}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Box my={1}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="color-search">
            Color
          </InputLabel>
          <BootstrapInput
            id="color-search"
            name="color"
            value={model.color}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Box my={1}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="location-search">
            Location
          </InputLabel>
          <BootstrapInput
            id="location-search"
            name="location"
            value={model.location}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Box my={1}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="rate-search">
            Average rate
          </InputLabel>
          <BootstrapInput
            id="rate-search"
            name="rate"
            type="number"
            value={model.rate}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default Filter;
