const ContraktorSign = artifacts.require("./ContraktorSign.sol");

module.exports = function(deployer) {
  deployer.deploy(ContraktorSign);
};
