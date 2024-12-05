//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


// 1、创建一个收款函数
// 2、记录投资人并且查看
// 3、在锁定期内，达到目标值，生产商可以提款
// 4、在锁定期内，没有达到目标值，投资人在锁定期以后退款
contract FundMe {

    mapping(address => uint256) public fundersToAmount;

    // uint256 MINIMUM_VALUE = 1 * 10 ** 18; // 1 ETH

    uint256 constant MINIMUM_VALUE = 1; // 1 USD

    uint256 constant TARGET = 100;

    //合约部署时间
    uint256 deploymentTimestamp;

    //锁定时间
    uint256 lockTime;

    address public owner;

    address public erc20Addr;

    bool public getFundSuccess = false;

    //如过要将MINIMUM_VALUE设置为以USD为单位的货币值，则需要引入预言机，获取实时汇率
    AggregatorV3Interface public dataFeed;

    //只会在合约部署时被调用一次
    constructor(uint256 _lockTime, address dataFeedAddr) {
        dataFeed = AggregatorV3Interface(
            //ETH对USD的data feed地址
            // 0x694AA1769357215DE4FAC081bf1f309aDC325306
            dataFeedAddr
        );

        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    // ethAmount由msg.value传入，msg.value的单位是ETH
    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256) {
        // ethPrice: 1个ETH值多少USD
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        
        // ethPrice位为1ETH的美元价格(chainlink预言机准精度为8位小数，即返回值单位是 1e8,需要除以1e8才能得到实际的USD价格),
        // ethAmount的单位为 wei，需要除以 10 ** 18转换位ETH
        return ethAmount / (10 ** 18) * ethPrice / (10 ** 8);
    }

    function getFund() external onlyOwner targetNotReached {
        //this 指代当前合约
        //transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);
        //send: transfer ETH.return false if failed.return true if success
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success,"tx failed.");
        //call: transfer ETH with data.return value of function and bool.(以太坊推荐写法)
        bool success;
        (success,) = payable(msg.sender).call{value:address(this).balance}("");
        require(success,"tx failed.");
        getFundSuccess = true;
    }

    function fund() external payable fundWindClosed {
        require( convertEthToUsd(msg.value) >= MINIMUM_VALUE,"Send more ETH");
        fundersToAmount[msg.sender] = msg.value;
    }

    function refund() external fundWindNotClosed targetReached {
        require(fundersToAmount[msg.sender] != 0,"there is no fund for you");

        //将退款人余额清0
        fundersToAmount[msg.sender] = 0; 
        bool success;
        (success,) = payable(msg.sender).call{value:fundersToAmount[msg.sender]}("");
        require(success,"transfer tx failed.");
    }

    function transferOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function setFunderToAmount(address funder,uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr,"you do not have permission to call this function");
        fundersToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    modifier fundWindClosed() {
        require(block.timestamp < deploymentTimestamp + lockTime,"fund window is closed.");
        _;
    }

     modifier fundWindNotClosed() {
        require(block.timestamp >= deploymentTimestamp + lockTime,"fund window is not close yet.");
        _; //放在下面会减少运算，节约gas fee
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"this function can only be called by owner.");
        _;
    }

    modifier targetNotReached() {
        require(convertEthToUsd(address(this).balance) >= TARGET,"Target is not reached yet.");
        _;
    }

     modifier targetReached() {
        require(convertEthToUsd(address(this).balance) < TARGET,"Target is reached.");
        _;
    }
    
}