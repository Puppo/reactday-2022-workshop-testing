
import { Link } from 'react-router-dom';

interface Props {
  username: string;
  avatar: string;
}

export default function UserCard({
  username, avatar
}: Props) {
  return <div className='card'>
    <div className="card-content">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img src={avatar} alt={username} />
          </figure>
        </div>
        <div className="media-content">
          <p className="title is-4">{username}</p>
          <p className="subtitle is-6">
            <Link to={`/${username}/repositories`}>@{username}</Link>
          </p>
        </div>
      </div>
    </div>
  </div>
}
