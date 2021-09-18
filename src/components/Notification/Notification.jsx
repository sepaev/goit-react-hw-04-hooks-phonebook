import PropTypes from 'prop-types';
import { TextH2 } from './Notification.styled';

function  Notification ({ message }) {
  return (
    <div>
      <TextH2>{message}</TextH2>
    </div>
  );
};

export default Notification;
Notification.propTypes = {
  message: PropTypes.string.isRequired,
};
