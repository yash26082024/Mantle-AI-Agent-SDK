// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract MantleAgentExecutor {
    struct Action {
        address target;
        uint256 value;
        bytes data;
    }

    event ActionExecuted(
        string agentId,
        address indexed target,
        bytes data,
        uint256 value,
        bytes result,
        bytes32 reasoningHash
    );

    address public owner;
    mapping(address => bool) public authorizedAgents;

    constructor() {
        owner = msg.sender;
        authorizedAgents[msg.sender] = true;
    }

    function authorizeAgent(address agentAddress, bool status) external {
        require(msg.sender == owner, "Not owner");
        authorizedAgents[agentAddress] = status;
    }

    function execute(
        Action[] calldata actions,
        string calldata agentId,
        bytes32 reasoningHash
    ) external payable returns (bytes[] memory results) {
        require(authorizedAgents[msg.sender], "Not authorized agent");
        results = new bytes[](actions.length);

        for (uint256 i = 0; i < actions.length; i++) {
            (bool success, bytes memory result) = actions[i].target.call{value: actions[i].value}(
                actions[i].data
            );
            
            if (!success) {
                if (result.length > 0) {
                    assembly {
                        let result_size := mload(result)
                        revert(add(32, result), result_size)
                    }
                } else {
                    revert("Action execution failed with no reason");
                }
            }
            
            results[i] = result;

            emit ActionExecuted(
                agentId,
                actions[i].target,
                actions[i].data,
                actions[i].value,
                result,
                reasoningHash
            );
        }
    }

    receive() external payable {}
}
