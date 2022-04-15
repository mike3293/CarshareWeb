import { ProviderWithTarrifs } from 'src/types/ProviderWithTarrifs';
import { useMemo } from 'react';
import { orderBy } from 'lodash';
import TariffsGrid from './TariffsGrid';
import { Paper, styled, Typography } from '@mui/material';

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  gap: theme.spacing(4),
  // backgroundColor: theme.palette.secondary.main,
}));

const CarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderWidth: '3px',
  // backgroundColor: theme.palette.secondary.main,
}));

const ProviderTarrifsForm = ({
  provider: { carPrices, id },
}: {
  provider: ProviderWithTarrifs;
}) => {
  const orderedCars = useMemo(
    () => orderBy(carPrices, (c) => c.brand),
    [carPrices]
  );

  return (
    <Root>
      {orderedCars.map((c) => (
        <CarContainer variant="outlined">
          <Typography sx={{ mb: 1 }}>{c.model}</Typography>
          <TariffsGrid car={c} providerId={id} />
        </CarContainer>
      ))}
    </Root>
  );
};

export default ProviderTarrifsForm;
