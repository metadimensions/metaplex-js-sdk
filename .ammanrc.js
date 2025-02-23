const { LOCALHOST, tmpLedgerDir } = require('@metaplex-foundation/amman');
const path = require('path');
const MOCK_STORAGE_ID = 'js-next-sdk';

const { accountProviders } = require('./dist/cjs/accountProviders.cjs');

function localDeployPath(programName) {
  return path.join(__dirname, 'test', 'programs', `${programName}.so`);
}

const programIds = {
  metadata: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  vault: 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn',
  auction: 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8',
  metaplex: 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98',
  fixedPriceSaleToken: 'SaLeTjyUa5wXHnGuewUSyJ5JWZaHwz3TxqUntCE9czo',
  candyMachine: 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
  auctionHouse: 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
};

const programs = [
  {
    label: 'Token Metadata',
    programId: programIds.metadata,
    deployPath: localDeployPath('mpl_token_metadata'),
  },
  {
    label: 'Candy Machine',
    programId: programIds.candyMachine,
    deployPath: localDeployPath('mpl_candy_machine'),
  },
  {
    label: 'Auction House',
    programId: programIds.auctionHouse,
    deployPath: localDeployPath('mpl_auction_house'),
  },
];

module.exports = {
  validator: {
    killRunningValidators: true,
    programs,
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
  },
  relay: {
    accountProviders,
  },
  storage: {
    storageId: MOCK_STORAGE_ID,
    clearOnStart: true,
  },
  snapshot: {
    snapshotFolder: path.join(__dirname, 'snapshots'),
  },
};
