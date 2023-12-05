require('dotenv').config()

process.argv = [
    process.env.DECIMALS,
    process.env.MINT_TARGET,
    process.env.INITIAL_MINT
]