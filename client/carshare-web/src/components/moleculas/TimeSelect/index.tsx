import {
  Checkbox,
  styled,
  FormControlLabel,
  Popover,
  IconButton,
  Typography,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import { useQuery } from "react-query";
import services from "src/config/services";
import { useFiltersStore } from "src/context/filtersStore";
import React, { useEffect, useState } from "react";
import { ITimeSelectProps } from "./types";
import { blue, grey } from "@mui/material/colors";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import {
  getWaypointsResidenceTime,
  useRoutingStore,
} from "src/context/routingStore";
import shallow from "zustand/shallow";

const TimeSelect = ({
  waypoint: { id, residenceTimeMins },
}: ITimeSelectProps) => {
  const [resetResidenceTime, setResidenceTime] = useRoutingStore(
    (s) => [s.resetResidenceTimeMins, s.setResidenceTimeMins],
    shallow
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [time, setTime] = useState(residenceTimeMins?.toString() ?? "");

  const closePopup = () => {
    setAnchorEl(null);
    time
      ? setResidenceTime(id, Number.parseInt(time, 10))
      : resetResidenceTime(id);
  };

  return (
    <>
      <Tooltip title="Изменить время нахождения в точке">
        <IconButton
          sx={{
            p: 0.25,
            color: residenceTimeMins ? blue[200] : grey[400],
            "&:hover": {
              color: residenceTimeMins ? blue[400] : grey[500],
            },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <TimerOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closePopup}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { borderRadius: 2, p: 1 },
        }}
        disableScrollLock
      >
        <TextField
          fullWidth
          label="Время стоянки (мин)"
          variant="outlined"
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </Popover>
    </>
  );
};

export default TimeSelect;
