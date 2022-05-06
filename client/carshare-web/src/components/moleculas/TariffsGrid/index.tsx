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
import { PackageTariff } from "src/services/configuration/types";
import { useCallback, useMemo, useState } from "react";
import { uniqueId } from "src/utils/uniqueId";
import { UniqueTariff } from "./types";
import { grey } from "@mui/material/colors";

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

const getColumns = (
  deleteRow: (id: GridRowId) => void,
  editable = true
): GridColumns => {
  const columns: GridColumns = [
    { field: "name", headerName: "Тариф", editable, flex: 1 },
    {
      field: "kopecksCost",
      headerName: "Цена пакета",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "kopecksPerMinute",
      headerName: "Цена минуты",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "kopecksPerMinuteParking",
      headerName: "Цена мин. парковки",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "kopecksPerKilometer",
      headerName: "Цена за км",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "minutesIncluded",
      headerName: "Включено минут",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "parkingMinutesIncluded",
      headerName: "Включено минут парковки",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "kilometersIncluded",
      headerName: "Включено км",
      type: "number",
      preProcessEditCellProps: validateNumber,
      valueFormatter: formatNumber,
      editable,
      flex: 1,
    },
    {
      field: "isBase",
      headerName: "Базовый",
      type: "boolean",
      editable,
      flex: 1,
    },
  ];

  if (editable) {
    columns.push({
      field: "actions",
      type: "actions",
      width: 50,
      getActions: (params: { id: GridRowId }) => [
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            deleteRow(params.id);
          }}
        />,
      ],
    });
  }

  return columns;
};

const createEmptyRow = (rowsCount: number) => ({
  id: uniqueId(),
  isBase: rowsCount === 0,
  name: "новый тариф",
});

interface ITariffsGridProps {
  packageTariffs: PackageTariff[];
  updateTariffs?: (packageTariffs: PackageTariff[]) => Promise<void>;
}

const TariffsGrid = ({ packageTariffs, updateTariffs }: ITariffsGridProps) => {
  const disabled = !updateTariffs;

  const [tariffs, setTariffs] = useState(
    (packageTariffs ?? []).map((t) => ({ ...t, id: uniqueId() }))
  );
  const [loadCounter, setLoadCounter] = useState(0);

  const handleRowsUpdate = useCallback(async (tariffs: UniqueTariff[]) => {
    setLoadCounter((ps) => ps + 1);
    updateTariffs && (await updateTariffs(tariffs));
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
      const isBaseRow = tariffs.find((t) => t.id === id)?.isBase;

      const newRows = tariffs.filter((t) => t.id !== id);

      if (isBaseRow) {
        const firstRow = newRows.find(() => true);

        if (firstRow) {
          firstRow.isBase = true;
        }
      }

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

  const columns = useMemo(
    () => getColumns(handleDeleteRow, !disabled),
    [handleDeleteRow]
  );

  return (
    <>
      {!disabled && (
        <Button size="small" onClick={handleAddRow}>
          Добавить тариф
        </Button>
      )}
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
        sx={{ backgroundColor: disabled ? grey[200] : undefined }}
      />
    </>
  );
};

export default TariffsGrid;
