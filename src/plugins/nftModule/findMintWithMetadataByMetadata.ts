import type { Commitment, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@/Metaplex';
import { Operation, useOperation, OperationHandler } from '@/types';
import {
  makeMetadataModel,
  makeMintWithMetadataModel,
  MintWithMetadata,
} from './Metadata';
import { toMintAccount } from '../tokenModule';
import { toMetadataAccount } from '@/programs';
import { DisposableScope } from '@/utils';

const Key = 'FindMintWithMetadataByMetadataOperation' as const;
export const findMintWithMetadataByMetadataOperation =
  useOperation<FindMintWithMetadataByMetadataOperation>(Key);
export type FindMintWithMetadataByMetadataOperation = Operation<
  typeof Key,
  FindMintWithMetadataByMetadataInput,
  MintWithMetadata
>;

export type FindMintWithMetadataByMetadataInput = {
  metadataAddress: PublicKey;
  commitment?: Commitment;
  loadJsonMetadata?: boolean; // Default: true
};

export const findMintWithMetadataByMetadataOperationHandler: OperationHandler<FindMintWithMetadataByMetadataOperation> =
  {
    handle: async (
      operation: FindMintWithMetadataByMetadataOperation,
      metaplex: Metaplex,
      scope: DisposableScope
    ): Promise<MintWithMetadata> => {
      const {
        metadataAddress,
        commitment,
        loadJsonMetadata = true,
      } = operation.input;

      const metadataAccount = toMetadataAccount(
        await metaplex.rpc().getAccount(metadataAddress, commitment)
      );

      const mintAccount = toMintAccount(
        await metaplex.rpc().getAccount(metadataAccount.data.mint, commitment)
      );

      let metadataModel = makeMetadataModel(metadataAccount);
      if (loadJsonMetadata) {
        metadataModel = await metaplex
          .nfts()
          .loadJsonMetadata(metadataModel)
          .run(scope);
      }

      return makeMintWithMetadataModel(mintAccount, metadataModel);
    },
  };
