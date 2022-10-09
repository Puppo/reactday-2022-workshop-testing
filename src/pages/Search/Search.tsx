import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gitHubService } from '../../services';
import { arrayUtils } from '../../utils';
import './Search.scss';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const isButtonDisabled = searchTerm.length < 3;
  const [usersChunk, setUsersChunk] = useState<Array<gitHubService.GitHubUser[]>>([])

  const search: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const usersSearchResult = await gitHubService.searchUsers(searchTerm);
    setUsersChunk(arrayUtils.sliceIntoChunks(usersSearchResult.items, 4));
  }

  return (
    <div className='Search'>
      <h1 className='title'>Search</h1>

      <form className="Search-form" onSubmit={search}>
        <div className="field has-addons">
          <div className="control">
            <input className="input" name="search-input" type="text" placeholder="Type the username" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="control">
            <button type="submit" className="button is-info" disabled={isButtonDisabled}>
              Search
            </button>
          </div>
        </div>
      </form>


      <div className="Search-results">
        {usersChunk.map((users, idx) => <div className="columns" key={idx}>
          {users.map(user => <div className="column is-3" key={user.login}>
            <div className='card'>
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img src={user.avatar_url} alt={user.login} />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">{user.login}</p>
                    <p className="subtitle is-6">
                      <Link to={`/${user.login}/repositories`}>@{user.login}</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
        </div>)}
      </div>
    </div>
  )
}
