import { Link } from "@material-ui/core";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useEns } from "src/hooks/useENS";

export default function WalletAddressEns() {
  const { data: ens } = useEns();
  const { account } = useWeb3Context();

  if (!account) return null;

  return (
    <div className="wallet-link">
      {ens?.avatar && <img className="avatar" src={ens.avatar} alt={account} />}

      <Link href={`https://bscscan.io/address/${account}`} target="_blank">
        {ens?.name || shorten(account)}
      </Link>
    </div>
  );
}
