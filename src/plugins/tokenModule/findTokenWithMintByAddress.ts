import type { Commitment, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@/Metaplex';
import { Operation, useOperation, OperationHandler } from '@/types';
import { makeTokenWithMintModel, TokenWithMint } from './Token';
import { toMintAccount, toTokenAccount } from './accounts';
import { makeMintModel } from './Mint';

const Key = 'FindTokenWithMintByAddressOperation' as const;
export const findTokenWithMintByAddressOperation =
  useOperation<FindTokenWithMintByAddressOperation>(Key);
export type FindTokenWithMintByAddressOperation = Operation<
  typeof Key,
  FindTokenWithMintByAddressInput,
  TokenWithMint
>;

export type FindTokenWithMintByAddressInput = {
  address: PublicKey;
  commitment?: Commitment;
};

export const findTokenWithMintByAddressOperationHandler: OperationHandler<FindTokenWithMintByAddressOperation> =
  {
    handle: async (
      operation: FindTokenWithMintByAddressOperation,
      metaplex: Metaplex
    ): Promise<TokenWithMint> => {
      const { address, commitment } = operation.input;

      const tokenAccount = toTokenAccount(
        await metaplex.rpc().getAccount(address, commitment)
      );

      const mintAccount = toMintAccount(
        await metaplex.rpc().getAccount(tokenAccount.data.mint, commitment)
      );

      return makeTokenWithMintModel(tokenAccount, makeMintModel(mintAccount));
    },
  };
