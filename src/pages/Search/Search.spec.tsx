import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search Page', () => {
  const renderSearchComponent = () => {
    render(<Search />);
  };
  const getSearchInput = () => screen.getByPlaceholderText<HTMLInputElement>(/type the username/i)
  const getSearchButton = () => screen.getByRole('button', { name: 'Search' })

  describe('init', () => {

    it(`should have the search input empty`, () => {

      renderSearchComponent();

      expect(getSearchInput()).toHaveValue('')
    })
    it('should have the search button disabled', async () => {

      renderSearchComponent();

      expect(getSearchButton()).toHaveAttribute('disabled');
    })

  })

  describe('search', () => {

    it('should enable the search button if the user type al least 3 characters', () => {
      renderSearchComponent();

      userEvent.type(getSearchInput(), 'ppp');

      expect(getSearchButton()).not.toHaveAttribute('disabled');
    })
    it('should disabled the search button if the user type less then 3 characters', () => {
      renderSearchComponent();

      userEvent.type(getSearchInput(), 'pp');

      expect(getSearchButton()).toHaveAttribute('disabled');
    })
  })

})

export { };

