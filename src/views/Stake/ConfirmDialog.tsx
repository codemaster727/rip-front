import { Box, Grid, Paper, Switch, Typography } from "@material-ui/core";
import { InfoTooltip } from "@olympusdao/component-library";
import { ChangeEvent, useMemo, useState } from "react";

export interface ConfirmDialogProps {
  quantity: string;
  currentIndex: string | undefined;
  view: number;
  onConfirm: (value: boolean) => void;
}

export function ConfirmDialog({ quantity, currentIndex, view, onConfirm }: ConfirmDialogProps) {
  const [checked, setChecked] = useState(false);
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onConfirm(value);
  };
  const gripQuantity = useMemo(
    () => (quantity && currentIndex ? Number((Number(quantity) / Number(currentIndex)).toFixed(4)) : ""),
    [quantity, currentIndex],
  );
  const ripQuantity = useMemo(() => (quantity ? Number(Number(quantity).toFixed(4)) : ""), [quantity]);

  return (
    <Paper className="rip-card confirm-dialog">
      <Box className="dialog-container" display="flex" alignItems="center" justifyContent="space-between">
        {/* <Typography variant="body2"> */}
        <Grid component="label" container alignItems="center" spacing={1} wrap="nowrap">
          <Grid item>sRIP</Grid>
          <Grid item>
            <Switch
              checked={checked}
              onChange={handleCheck}
              color="primary"
              className="stake-to-rip-checkbox"
              inputProps={{ "aria-label": "stake to grip" }}
            />
          </Grid>
          <Grid item>
            gRIP
            <InfoTooltip
              message={`Toggle to switch between ${view === 0 ? "staking to" : "unstaking from"} sRIP or gRIP`}
              children={undefined}
            />
          </Grid>
        </Grid>
        {/* </Typography> */}
        {checked && Number(quantity) ? (
          <Typography variant="body2">
            {view === 0
              ? `Stake ${ripQuantity} RIP → ${gripQuantity} gRIP`
              : `Unstake ${gripQuantity} gRIP → ${ripQuantity} RIP`}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
}
