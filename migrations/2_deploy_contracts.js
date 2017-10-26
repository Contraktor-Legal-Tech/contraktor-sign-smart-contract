const ContraktorSign = artifacts.require('./ContraktorSign.sol');
const SignLibrary = artifacts.require('./SignLibrary.sol');

module.exports = function(deployer) {
  deployer.deploy(SignLibrary);
  deployer.link(SignLibrary, ContraktorSign);
  deployer.deploy(ContraktorSign);
};
