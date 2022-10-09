import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Loader() {
  return <FontAwesomeIcon icon={faSpinner} spin={true} size="3x" />
}
