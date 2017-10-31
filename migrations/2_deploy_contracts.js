const CKSignStorage = artifacts.require('./CKSignStorage.sol');
const CKSignManager = artifacts.require('./CKSignManager.sol');
const CKSignLibrary = artifacts.require('./CKSignLibrary.sol');

module.exports = function(deployer) {
  deployer.deploy(CKSignStorage);
  deployer.deploy(CKSignLibrary);
  deployer.link(CKSignLibrary, CKSignManager);
  deployer.deploy(CKSignManager);
};
