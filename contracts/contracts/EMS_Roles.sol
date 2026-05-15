// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EMS_Roles {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER");
    bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE");

    address public owner;

    mapping(address => mapping(bytes32 => bool)) private _hasRole;
    address[] private _members;

    event RoleGranted(address indexed account, bytes32 indexed role);
    event RoleRevoked(address indexed account, bytes32 indexed role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        _grantRole(msg.sender, ADMIN_ROLE);
    }

    function grantRole(address account, bytes32 role) external onlyOwner {
        require(account != address(0), "Zero address");
        _grantRole(account, role);
    }

    function revokeRole(address account, bytes32 role) external onlyOwner {
        require(account != address(0), "Zero address");
        _hasRole[account][role] = false;
        emit RoleRevoked(account, role);
    }

    function hasRole(address account, bytes32 role) external view returns (bool) {
        return _hasRole[account][role];
    }

    function getMembers() external view returns (address[] memory) {
        return _members;
    }

    function _grantRole(address account, bytes32 role) private {
        if (!_hasRole[account][role]) {
            _hasRole[account][role] = true;
            _members.push(account);
            emit RoleGranted(account, role);
        }
    }
}
