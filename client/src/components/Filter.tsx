import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { UserRole } from "../utils/type";

type FilterProps = {
  filterChange: (key: string, value: string) => void;
  model: Record<string, string>;
};

const RateLabel = [">= 0", ">= 1", ">= 2", ">= 3", ">= 4"];

const Filter = ({ filterChange, model }: FilterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterChange(e.target.name, e.target.value);
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    filterChange(e.target.name, e.target.value.toString());
  };

  const fields = Object.keys(model).filter(
    (x) => x !== "start_date" && x !== "end_date"
  );

  return (
    <Box display={"flex"}>
      {fields.map((field) => (
        <Box mx={1} key={field}>
          {field === "rate" ? (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="rate-select-label">Filter by rate</InputLabel>
                <Select
                  labelId="filter-rate"
                  id="rate-select"
                  value={model[field]}
                  name={field}
                  label="Filter by rate"
                  onChange={handleSelectChange}
                >
                  {[0, 1, 2, 3, 4].map((i: number) => (
                    <MenuItem key={`${i}-1`} value={i}>
                      {RateLabel[i]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : field === "role" ? (
            <Box sx={{ minWidth: 150 }}>
              <FormControl fullWidth>
                <InputLabel id="rate-select-label">Filter by role</InputLabel>
                <Select
                  id="role-select"
                  labelId="filter-role"
                  value={model[field]}
                  name={field}
                  label="Filter by role"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="all">{"All"}</MenuItem>
                  {Object.values(UserRole).map((role: string) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <TextField
              fullWidth
              id={`${field}-search`}
              type={field === "rate" ? "number" : "text"}
              inputProps={{ min: "0", max: "5", step: "1" }}
              name={field}
              label={`Filter by ${field.split("_").join(" ")}`}
              value={model[field]}
              onChange={handleChange}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Filter;
