import { Loader, Notification, RepositoryCard } from '../../components';
import { arrayUtils } from '../../utils';
import { useRepositories } from './hooks/repositories.hooks';
import './Repositories.scss';

export default function Repositories() {

  const { repositories, error, loading } = useRepositories();
  const repositoriesChunks = arrayUtils.sliceIntoChunks(repositories, 4);

  return (
    <div className='Repositories'>
      <h1 className='title'>Repositories</h1>

      {loading && <Loader />}
      {error && <Notification type="error" text={error} />}
      {!loading && !error && <div className="Repositories-results">
        {repositoriesChunks.map((repositories, idx) => <div className="columns" key={idx}>
          {repositories.map(({ name, description }) => <div className="column is-3" key={name}>
            <RepositoryCard name={name} description={description} />
          </div>)}
        </div>)}
      </div>}
    </div>
  )
}
