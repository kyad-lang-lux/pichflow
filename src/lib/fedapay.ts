import { FedaPay, Transaction } from 'fedapay';

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);
FedaPay.setEnvironment('sandbox');
export { Transaction };