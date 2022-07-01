import type { Metaplex } from '@/Metaplex';
import {
  findAllByAuthority,
  findAllByWallet,
  findByAddress,
  findByAuthorityAndUuid,
} from './Client.queries';
import { createFromConfig } from './Client.create';
import { update, updateAuthority } from './Client.update';
import { addAssets } from './Client.add';
import {
  CreateCandyMachineInput,
  createCandyMachineOperation,
  CreateCandyMachineOutput,
} from './createCandyMachine';
import { Task } from '@/utils';
import { CandyMachine } from './CandyMachine';
import { CreatedCandyMachineNotFoundError } from '@/errors';

export class CandyMachinesClient {
  constructor(readonly metaplex: Metaplex) {}

  create(input: CreateCandyMachineInput): Task<
    Omit<CreateCandyMachineOutput, 'candyMachine'> & {
      candyMachine: CandyMachine;
    }
  > {
    return new Task(async (scope) => {
      const operation = createCandyMachineOperation(input);
      const output = await this.metaplex.operations().execute(operation, scope);
      scope.throwIfCanceled();

      const candyMachine = await this.findByAddress(
        output.candyMachine.publicKey
      );

      if (candyMachine === null) {
        throw new CreatedCandyMachineNotFoundError(
          output.candyMachine.publicKey
        );
      }

      return { ...output, candyMachine };
    });
  }

  // -----------------
  // Create
  // -----------------
  createFromConfig = createFromConfig;

  // -----------------
  // Queries
  // -----------------
  findByAddress = findByAddress;
  findAllByWallet = findAllByWallet;
  findAllByAuthority = findAllByAuthority;
  findByAuthorityAndUuid = findByAuthorityAndUuid;

  // -----------------
  // Update
  // -----------------
  update = update;
  updateAuthority = updateAuthority;

  // -----------------
  // Add Assets
  // -----------------
  addAssets = addAssets;
}
