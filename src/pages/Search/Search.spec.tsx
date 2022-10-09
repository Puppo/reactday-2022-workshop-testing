import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Search from './Search';
import { useSearchStore } from './store/search.store';

describe('Search Page', () => {
  const renderSearchComponent = () => {
    render(<Search />, { wrapper: MemoryRouter });
  };
  const getSearchInput = () => screen.getByPlaceholderText<HTMLInputElement>(/type the username/i)
  const getSearchButton = () => screen.getByRole('button', { name: 'Search' })
  const findAllUsersLinks = () => waitFor(() => screen.findAllByRole('link'))
  const findAllUsersImages = () => waitFor(() => screen.findAllByRole('img'))

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
    const usersMock = [{
      username: 'login-1',
      avatar: 'login-1-avatar'
    }, {
      username: 'login-2',
      avatar: 'login-2-avatar'
    }, {
      username: 'login-3',
      avatar: 'login-3-avatar'
    }]
    const initialState = useSearchStore.getState();

    beforeEach(() => {
      useSearchStore.setState(initialState);
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

    it('should perform search when user click the search button', () => {
      const searchMock = jest.fn()
      useSearchStore.setState({
        ...initialState,
        search: searchMock,
      });

      renderSearchComponent();

      userEvent.type(getSearchInput(), 'ppp');
      userEvent.click(getSearchButton());

      expect(searchMock.mock.calls.length).toBe(1);
      expect(searchMock.mock.calls[0][0]).toBe('ppp');
    })

    describe('users', () => {
      const setupStateWithUsers = () => {
        useSearchStore.setState({
          ...initialState,
          users: usersMock
        });
      }

      it('should render users', async () => {
        setupStateWithUsers()

        renderSearchComponent();

        const resultList = await findAllUsersLinks();
        expect(resultList.length).toBe(usersMock.length)
      });

      it('should render for each user the username as link for the detail page', async () => {
        setupStateWithUsers()

        renderSearchComponent();

        const resultList = await findAllUsersLinks()
        resultList.forEach((el, index) => {
          expect(el).toHaveAttribute('href', `/${usersMock[index].username}/repositories`,)
        })
      });

      it('should render for each user the avatar image', async () => {
        setupStateWithUsers()

        renderSearchComponent();

        const resultList = await findAllUsersImages()
        resultList.forEach((el, index) => {
          expect(el).toHaveAttribute('src', usersMock[index].avatar)
        })
      });

    });

    describe('loading', () => {
      const setupStateWithLoading = (loading = true) => {
        useSearchStore.setState({
          ...initialState,
          loading
        });
      }

      it('should render loading', async () => {
        setupStateWithLoading()

        renderSearchComponent();

        const loader = screen.queryByTitle(/content loading/i)
        expect(loader).toBeInTheDocument();
      });

      it('should not render loading', async () => {
        setupStateWithLoading(false)

        renderSearchComponent();

        const loader = screen.queryByTitle(/content loading/i)
        expect(loader).not.toBeInTheDocument();
      });

    });

    describe('error', () => {
      const setupStateWithError = (error: string | undefined) => {
        useSearchStore.setState({
          ...initialState,
          error
        });
      }

      it('should render error', async () => {
        setupStateWithError('error')

        renderSearchComponent();

        const error = screen.queryByText(/error/i)
        expect(error).toBeInTheDocument();
      });

      it('should not render error', async () => {
        setupStateWithError(undefined)

        renderSearchComponent();

        const error = screen.queryByText(/error/i)
        expect(error).not.toBeInTheDocument();
      });

    });

  })

})

export { };

