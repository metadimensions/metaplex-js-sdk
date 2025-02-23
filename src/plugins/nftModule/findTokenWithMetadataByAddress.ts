import type { Commitment, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@/Metaplex';
import { Operation, useOperation, OperationHandler } from '@/types';
import {
  makeMetadataModel,
  makeTokenWithMetadataModel,
  TokenWithMetadata,
} from './Metadata';
import {
  makeMintModel,
  makeTokenWithMintModel,
  TokenWithMint,
  toMintAccount,
  toTokenAccount,
} from '../tokenModule';
import { findMetadataPda, parseMetadataAccount } from '@/programs';
import { DisposableScope } from '@/utils';

const Key = 'FindTokenWithMetadataByAddressOperation' as const;
export const findTokenWithMetadataByAddressOperation =
  useOperation<FindTokenWithMetadataByAddressOperation>(Key);
export type FindTokenWithMetadataByAddressOperation = Operation<
  typeof Key,
  FindTokenWithMetadataByAddressInput,
  TokenWithMetadata | TokenWithMint
>;

export type FindTokenWithMetadataByAddressInput = {
  address: PublicKey;
  commitment?: Commitment;
  loadJsonMetadata?: boolean; // Default: true
};

export const findTokenWithMetadataByAddressOperationHandler: OperationHandler<FindTokenWithMetadataByAddressOperation> =
  {
    handle: async (
      operation: FindTokenWithMetadataByAddressOperation,
      metaplex: Metaplex,
      scope: DisposableScope
    ): Promise<TokenWithMetadata | TokenWithMint> => {
      const { address, commitment, loadJsonMetadata = true } = operation.input;

      const tokenAccount = toTokenAccount(
        await metaplex.rpc().getAccount(address, commitment)
      );

      const mintAddress = tokenAccount.data.mint;
      const metadataAddress = findMetadataPda(mintAddress);
      const accounts = await metaplex
        .rpc()
        .getMultipleAccounts([mintAddress, metadataAddress], commitment);

      const mintAccount = toMintAccount(accounts[0]);
      const metadataAccount = parseMetadataAccount(accounts[1]);
      const mintModel = makeMintModel(mintAccount);

      if (!metadataAccount.exists) {
        return makeTokenWithMintModel(tokenAccount, mintModel);
      }

      let metadataModel = makeMetadataModel(metadataAccount);
      if (loadJsonMetadata) {
        metadataModel = await metaplex
          .nfts()
          .loadJsonMetadata(metadataModel)
          .run(scope);
      }

      return makeTokenWithMetadataModel(tokenAccount, mintModel, metadataModel);
    },
  };
