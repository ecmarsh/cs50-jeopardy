import Permissions from '../components/Permissions';
import SignInRequired from '../components/SignInRequired';

const PermissionsPage = props => (
  <div>
    <SignInRequired>
      <Permissions />
    </SignInRequired>
  </div>
);

export default PermissionsPage;
