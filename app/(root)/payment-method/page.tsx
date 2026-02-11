import {Metadata} from 'next';
import {auth} from '@/auth';
import { getUserById } from '@/lib/actions/users.actions';
import PaymentMethodForm from './payment-method-form';

export const metadata: Metadata = {
  title: 'Select payment method',
};

const PaymentMethodPage = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return <><PaymentMethodForm preferredPaymentMethod={user.paymentMethod} /></>;
}
 
export default PaymentMethodPage;
