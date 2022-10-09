import React, { useState } from 'react';
import { Loader, Notification, UserCard } from '../../components';
import { arrayUtils } from '../../utils';
import './Search.scss';
import { useSearchStore } from './store/search.store';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const isButtonDisabled = searchTerm.length < 3;
  const { search: performSearch, loading, error } = useSearchStore()
  const usersChunk = useSearchStore(state => arrayUtils.sliceIntoChunks(state.users, 4))
  const isShowUserOk = useSearchStore(state => !state.error && !state.loading)

  const search: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!isButtonDisabled) performSearch(searchTerm);
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

      {loading && <Loader />}
      {error && <Notification type='error' text={error} />}
      {isShowUserOk && <div className="Search-results">
        {usersChunk.map((users, idx) => <div className="columns" key={idx}>
          {users.map(({ username, avatar }) => <div className="column is-3" key={username}>
            <UserCard key={username} username={username} avatar={avatar} />
          </div>)}
        </div>)}
      </div>}
    </div>
  )
}
