import dotenv from 'dotenv';

// Setup server config from env
// Loads defaults if no envs are present

// Load .env
dotenv.config();

// Config interface
interface Config {
    port: number;
}

// Create global config
const config: Config = {
    port: Number(process.env.PORT) || 5000,
};

export default config;
