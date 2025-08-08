# 🚀 Solidity Smart Contracts Examples

Kumpulan contoh smart contract Solidity untuk pembelajaran dan referensi.

## 📁 **Daftar Contract**

### 1. **SimpleStorage.sol** - Contract Penyimpanan Sederhana
- **Fungsi:** Menyimpan dan mengambil data numerik dan string
- **Fitur:**
  - Store/retrieve uint256 values
  - Store/retrieve string values
  - Increment/decrement functions
  - Owner-only functions
  - Event logging

### 2. **Token.sol** - ERC-20 Token Sederhana
- **Fungsi:** Implementasi token ERC-20 dasar
- **Fitur:**
  - Transfer tokens
  - Approve/transferFrom
  - Mint function (untuk demo)
  - Balance tracking
  - Allowance system

### 3. **Crowdfunding.sol** - Platform Crowdfunding
- **Fungsi:** Platform crowdfunding terdesentralisasi
- **Fitur:**
  - Buat campaign
  - Kontribusi ke campaign
  - Claim funds jika berhasil
  - Refund jika gagal
  - Platform fee system

### 4. **NFT.sol** - ERC-721 NFT
- **Fungsi:** Implementasi NFT (Non-Fungible Token)
- **Fitur:**
  - Mint NFT
  - Transfer ownership
  - Approve/transferFrom
  - Token URI management
  - Metadata storage

## 🛠️ **Cara Menggunakan**

### **Prerequisites:**
```bash
# Install Node.js dan npm
# Install Hardhat
npm install -g hardhat

# Install dependencies
npm install @openzeppelin/contracts
npm install @nomiclabs/hardhat-ethers
npm install @nomiclabs/hardhat-waffle
```

### **Compile Contracts:**
```bash
# Compile semua contracts
npx hardhat compile

# Compile contract tertentu
npx hardhat compile contracts/SimpleStorage.sol
```

### **Deploy Contracts:**
```bash
# Deploy ke local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy ke testnet
npx hardhat run scripts/deploy.js --network goerli
```

## 📝 **Contoh Penggunaan**

### **SimpleStorage Contract:**
```javascript
// Deploy contract
const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
const storage = await SimpleStorage.deploy();

// Set value
await storage.set(42);

// Get value
const value = await storage.get(); // Returns 42
```

### **Token Contract:**
```javascript
// Deploy token
const Token = await ethers.getContractFactory("SimpleToken");
const token = await Token.deploy("MyToken", "MTK", 18, 1000000);

// Transfer tokens
await token.transfer(recipientAddress, ethers.utils.parseEther("100"));

// Check balance
const balance = await token.balanceOf(userAddress);
```

### **Crowdfunding Contract:**
```javascript
// Deploy crowdfunding
const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
const crowdfunding = await Crowdfunding.deploy();

// Create campaign
const campaignId = await crowdfunding.createCampaign(
  "My Project",
  "Description of my project",
  ethers.utils.parseEther("10"),
  30 // 30 days
);

// Contribute to campaign
await crowdfunding.contribute(campaignId, { value: ethers.utils.parseEther("1") });
```

### **NFT Contract:**
```javascript
// Deploy NFT
const NFT = await ethers.getContractFactory("SimpleNFT");
const nft = await NFT.deploy("MyNFT", "MNFT", 1000, ethers.utils.parseEther("0.01"));

// Mint NFT
await nft.mint("ipfs://QmYourMetadataHash", { value: ethers.utils.parseEther("0.01") });

// Transfer NFT
await nft.transfer(recipientAddress, 1);
```

## 🔧 **Testing**

### **Run Tests:**
```bash
# Run semua tests
npx hardhat test

# Run test tertentu
npx hardhat test test/SimpleStorage.test.js
```

### **Test Example:**
```javascript
describe("SimpleStorage", function () {
  it("Should store and retrieve value", async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const storage = await SimpleStorage.deploy();
    
    await storage.set(42);
    expect(await storage.get()).to.equal(42);
  });
});
```

## 🌐 **Deployment**

### **Local Development:**
```bash
# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### **Testnet Deployment:**
```bash
# Deploy to Goerli testnet
npx hardhat run scripts/deploy.js --network goerli

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### **Mainnet Deployment:**
```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔒 **Security Best Practices**

### **Yang Sudah Diimplementasi:**
- ✅ Access control dengan modifiers
- ✅ Input validation
- ✅ Reentrancy protection (basic)
- ✅ Safe math operations (Solidity 0.8+)
- ✅ Event logging

### **Yang Perlu Ditambahkan:**
- 🔄 Pause mechanism
- 🔄 Upgradeable contracts
- 🔄 Multi-signature wallets
- 🔄 Time locks
- 🔄 Rate limiting

## 📚 **Learning Resources**

### **Documentation:**
- [Solidity Docs](https://docs.soliditylang.org/)
- [Ethereum Docs](https://ethereum.org/developers/docs/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)

### **Tools:**
- [Remix IDE](https://remix.ethereum.org/)
- [Hardhat](https://hardhat.org/)
- [Truffle](https://trufflesuite.com/)

### **Testing:**
- [Waffle](https://getwaffle.io/)
- [Chai](https://www.chaijs.com/)
- [Ethers.js](https://docs.ethers.io/)

## 🚨 **Disclaimer**

Contract-contract ini dibuat untuk tujuan pembelajaran. Jangan gunakan untuk production tanpa audit keamanan yang menyeluruh.

## 📞 **Support**

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Happy Coding! 🚀** 