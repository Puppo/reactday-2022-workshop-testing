import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { gitHubService } from '../../services';
import Search from './Search';

jest.mock('../../services/github.service')

describe('Search Page', () => {
  const renderSearchComponent = () => {
    render(<Search />, { wrapper: MemoryRouter });
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

    let searchUsersMocked: jest.MockedFn<typeof gitHubService.searchUsers>;
    const mockResult = {
      items: [{
        login: 'login-1',
        avatar_url: 'login-1-avatar'
      }, {
        login: 'login-2',
        avatar_url: 'login-2-avatar'
      }, {
        login: 'login-3',
        avatar_url: 'login-3-avatar'
      }]
    }

    beforeEach(() => {
      searchUsersMocked = gitHubService.searchUsers as jest.MockedFn<typeof gitHubService.searchUsers>
    })

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

    describe('perform search', () => {
      const findAllUsersLinks = () => waitFor(() => screen.findAllByRole('link'))
      const findAllUsersImages = () => waitFor(() => screen.findAllByRole('img'))

      const setupMock = () => {
        searchUsersMocked.mockResolvedValue(mockResult)
      }

      const performSearch = () => {
        const searchTerm = 'test';
        renderSearchComponent();

        userEvent.type(getSearchInput(), searchTerm);
        userEvent.click(getSearchButton());
      }

      it('should render the users', async () => {
        setupMock();

        performSearch();

        const resultList = await findAllUsersLinks();
        expect(resultList.length).toBe(mockResult.items.length)
      });

      it('should render for each user the username as link for the detail page', async () => {
        setupMock();

        performSearch();

        const resultList = await findAllUsersLinks()
        resultList.forEach((el, index) => {
          expect(el).toHaveAttribute('href', `/${mockResult.items[index].login}/repositories`,)
        })
      });

      it('should render for each user the avatar image', async () => {
        setupMock();

        performSearch();

        const resultList = await findAllUsersImages()
        resultList.forEach((el, index) => {
          expect(el).toHaveAttribute('src', mockResult.items[index].avatar_url)
        })
      });


    })
  })

})

export { };

