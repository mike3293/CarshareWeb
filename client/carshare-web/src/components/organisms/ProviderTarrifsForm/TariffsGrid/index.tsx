import { LinearProgress } from "@mui/material";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridPreProcessEditCellProps,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { CarPrice, ProviderWithTarrifs } from "src/types/ProviderWithTarrifs";
import { useCallback, useMemo, useState } from "react";
import services from "src/config/services";
import { uniqueId } from "src/utils/uniqueId";
import { UniqueTariff } from "./types";

const validateNumber = (params: GridPreProcessEditCellProps) => {
  const error = Number.isInteger(params.props.value) && params.props.value < 0;

  return { ...params.props, error };
};

const formatNumber = (params: GridValueFormatterParams<number>) => {
  if (!Number.isInteger(params.value)) {
    return "-";
  }

  return params.value;
};

const getColumns = (deleteRow: (id: GridRowId) => void): GridColumns => [
  { field: "name", headerName: "Тариф", editable: true, flex: 1 },
  {
    field: "kopecksCost",
    headerName: "Цена пакета",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "kopecksPerMinute",
    headerName: "Цена минуты",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "kopecksPerMinuteParking",
    headerName: "Цена мин. парковки",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "kopecksPerKilometer",
    headerName: "Цена за км",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "minutesIncluded",
    headerName: "Включено минут",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "parkingMinutesIncluded",
    headerName: "Включено минут парковки",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "kilometersIncluded",
    headerName: "Включено км",
    type: "number",
    preProcessEditCellProps: validateNumber,
    valueFormatter: formatNumber,
    editable: true,
    flex: 1,
  },
  {
    field: "isBase",
    headerName: "Базовый",
    type: "boolean",
    editable: true,
    flex: 1,
  },
  {
    field: "actions",
    type: "actions",
    width: 50,
    getActions: (params) => [
      <GridActionsCellItem
        key="delete"
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => {
          deleteRow(params.id);
        }}
      />,
    ],
  },
];

const createEmptyRow = (rowsCount: number) => ({
  id: uniqueId(),
  isBase: rowsCount === 0,
  name: "новый тариф",
});

interface ITariffsGridProps {
  providerId: ProviderWithTarrifs["id"];
  car: CarPrice;
}

const TariffsGrid = ({
  providerId,
  car: { packageTariffs, model },
}: ITariffsGridProps) => {
  const [tariffs, setTariffs] = useState(
    (packageTariffs ?? []).map((t) => ({ ...t, id: uniqueId() }))
  );
  const [loadCounter, setLoadCounter] = useState(0);

  const handleRowsUpdate = useCallback(async (tariffs: UniqueTariff[]) => {
    setLoadCounter((ps) => ps + 1);
    await services.configuration.updateTariffs(providerId, model, tariffs);
    setLoadCounter((ps) => ps - 1);
  }, []);

  const handleRowUpdate = useCallback(
    async (tariff: UniqueTariff, previousTariff: UniqueTariff) => {
      let rowsToChange = [...tariffs];

      if (tariff.isBase && previousTariff.isBase !== tariff.isBase) {
        rowsToChange = rowsToChange.map((r) => ({ ...r, isBase: false }));
      }

      const rowIndex = rowsToChange.findIndex((r) => r.id === tariff.id);
      const newRows = [
        ...rowsToChange.slice(0, rowIndex),
        tariff,
        ...rowsToChange.slice(rowIndex + 1),
      ];
      setTariffs(newRows);

      handleRowsUpdate(newRows);
    },
    [tariffs]
  );

  const handleDeleteRow = useCallback(
    async (id: GridRowId) => {
      const newRows = tariffs.filter((t) => t.id !== id);
      setTariffs(newRows);
      handleRowsUpdate(newRows);
    },
    [tariffs]
  );

  const handleAddRow = useCallback(async () => {
    const newRows = [...tariffs, createEmptyRow(tariffs.length)];
    handleRowsUpdate(newRows);
    setTariffs(newRows);
  }, [tariffs]);

  const columns = useMemo(() => getColumns(handleDeleteRow), [handleDeleteRow]);

  return (
    <>
      <Button size="small" onClick={handleAddRow}>
        Добавить тариф
      </Button>
      <DataGrid
        hideFooter
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        loading={loadCounter != 0}
        components={{
          LoadingOverlay: LinearProgress,
        }}
        rows={tariffs}
        processRowUpdate={async (
          tariff: UniqueTariff,
          oldTariff: UniqueTariff
        ) => {
          await handleRowUpdate(tariff, oldTariff);
          return tariff;
        }}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
};

export default TariffsGrid;
