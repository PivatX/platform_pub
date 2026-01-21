import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletButton = () => {
  return (
    <WalletMultiButton className="!bg-primary !rounded-lg !text-primary-foreground hover:!bg-primary/90 !h-10 !px-4 !transition-colors" />
  );
};
