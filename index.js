import { ethers, Wallet } from "ethers";
import bookStore from './abi/BookStore.json' with { type: 'json' };
import * as dotenv from 'dotenv';
dotenv.config();

const contractAddress = '0x0C318178328C2b6E885f9ADb2C105bb66C59AbdE'

const createContractInstanceOnEthereum = (contractAddress, contractAbi) => {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY_SEPOLIA;
    const provider = new ethers.AlchemyProvider('sepolia', alchemyApiKey);
    console.log("provider", provider)

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const wallet = new Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

    return contract
}

const contractOnETH =  createContractInstanceOnEthereum(contractAddress, bookStore.abi)

// create public and private key
const createEthereumAccount = async () => {
    try {
        const privateKey = ethers.SigningKey(id("some-secret-1"))
        const wallet = new ethers.BaseWallet(privateKey)
        console.log("Wallet Address:", wallet.address)
        console.log("Private Key:", wallet.privateKey)
    } catch (error) {
        console.log(error)
        throw error
    }
}

//----------------------

const addBookToContract = async(bookId, title, author, price, stock) => {
    try {
        const txResponse = await contractOnETH.addBook(bookId, title, author, stock, price)
        console.log(`Txn Hash - ${txResponse.hash}`)
        console.log(`https://sepolia.etherscan.io/tx/${txResponse.hash}`)
        
    } catch (error) {
        console.error(error) 
        throw error
    }
}

const _bookId = 1
const getBook = async () => {
    try{
        const books = await contractOnETH.getBooks(_bookId)
        console.log(books)
    } catch (error) {
        console.error(error)
    }
}

const buyBookFromContract = async (bookId,quantity) => {
    try {
        const books = await contractOnETH.getBooks(_bookId)
        const totalPrice = BigInt(books[2]) * BigInt(quantity)
        console.log(`books: ${books}`)
        console.log(`totalPrice: ${totalPrice}`)
        const txResponse = await contractOnETH.buyBook(bookId,quantity, {value: totalPrice})
        console.log(`Txn Hash - ${txResponse.hash}`)
        console.log(`https://sepolia.etherscan.io/tx/${txResponse.hash}`)
    } catch (error) {
        console.error(error)
    }
}

(async () => {
    //await createEthereumAccount()
    //await addBookToContract(115, "Avengers Assemble II", "Stan Lee", 150, 1)
    //await getBook()
    await buyBookFromContract(1,5)
})()