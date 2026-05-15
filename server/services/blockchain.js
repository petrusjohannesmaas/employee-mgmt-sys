import { ethers } from 'ethers';

const EMS_ROLES_ABI = [
  "function hasRole(address account, bytes32 role) view returns (bool)",
  "function grantRole(address account, bytes32 role)",
  "function revokeRole(address account, bytes32 role)",
  "function owner() view returns (address)",
  "event RoleGranted(address indexed account, bytes32 indexed role)",
  "event RoleRevoked(address indexed account, bytes32 indexed role)",
];

const ROLES = {
  ADMIN: ethers.keccak256(ethers.toUtf8Bytes('ADMIN')),
  MANAGER: ethers.keccak256(ethers.toUtf8Bytes('MANAGER')),
  EMPLOYEE: ethers.keccak256(ethers.toUtf8Bytes('EMPLOYEE')),
};

let instance = null;

export function getRolesContract() {
  if (instance) return instance;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
  const signer = provider;
  instance = new ethers.Contract(
    process.env.EMS_ROLES_CONTRACT || ethers.ZeroAddress,
    EMS_ROLES_ABI,
    signer
  );
  return instance;
}

export async function checkRole(walletAddress, role) {
  const contract = getRolesContract();
  return contract.hasRole(walletAddress, ROLES[role]);
}

export async function grantRole(walletAddress, role, privateKey) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    process.env.EMS_ROLES_CONTRACT || ethers.ZeroAddress,
    EMS_ROLES_ABI,
    wallet
  );
  const tx = await contract.grantRole(walletAddress, ROLES[role]);
  await tx.wait();
  return tx;
}

export { ROLES };
