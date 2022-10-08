import { useState } from 'react';
import './Search.scss';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const isButtonDisabled = searchTerm.length < 3;

  return (
    <div className='Search'>
      <h1 className='title'>Search</h1>

      <form className="Search-form">
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
    </div>
  )
}
