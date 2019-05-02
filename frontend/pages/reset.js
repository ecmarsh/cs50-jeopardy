import PasswordReset from '../components/PasswordReset';

const ResetCallback = ({ query }) => (
  <div>
    <PasswordReset resetToken={query.resetToken} />
  </div>
);

export default ResetCallback;
