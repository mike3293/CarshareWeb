import { Checkbox, styled, FormControlLabel, Popover } from "@mui/material";
import { useQuery } from "react-query";
import services from "src/config/services";
import { useFiltersStore } from "src/context/filtersStore";
import MapButton from "src/components/atoms/MapButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useEffect, useState } from "react";

interface ICarFiltersProps {
  isMobile: boolean;
}

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  padding: theme.spacing(1, 2),
}));

const CarFilters = ({ isMobile }: ICarFiltersProps) => {
  const { data = [] } = useQuery(
    "getProvidersSummary",
    () => services.publicCars.getProvidersSummary(),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { selectedProviderIds, setProviderIds } = useFiltersStore();

  useEffect(() => {
    if (!selectedProviderIds.length && data.length) {
      setProviderIds(data.map((p) => p.id));
    }
  }, [data]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <MapButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="primary"
        sx={{
          right: isMobile ? 8 : 11,
          bottom: isMobile ? 95 : 140,
        }}
      >
        <FilterAltIcon />
      </MapButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        disableScrollLock
      >
        <Root>
          {data.map((p) => (
            <FormControlLabel
              key={p.id}
              control={
                <Checkbox
                  checked={selectedProviderIds.some((sp) => sp === p.id)}
                  onChange={(e) =>
                    setProviderIds(
                      e.target.checked
                        ? [...selectedProviderIds, p.id]
                        : selectedProviderIds.filter((sp) => sp !== p.id)
                    )
                  }
                />
              }
              label={p.name}
            />
          ))}
        </Root>
      </Popover>
    </>
  );
};

export default CarFilters;
